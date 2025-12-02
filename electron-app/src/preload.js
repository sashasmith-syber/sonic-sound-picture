// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// src/main/preload.js

import { execa } from 'execa'
import tempWrite from 'temp-write'
import Handlebars from 'handlebars'
import cpy from 'cpy'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import BlenderLocation from 'blender-location'
import Setup from './setup'
import filenamify from 'filenamify'
import TemplateController from './template-controller.js'
import { analyzer as audioAnalyzer } from './audio-analysis.js'
import { kyoga } from './kyoga-framework.js'
import { logger } from './logger-esm.js'

const { clipboard } = require('electron')
const os = require('os')
const fs = require('fs')
const fsAync = require('fs/promises')
const path = require('path')
const { contextBridge, ipcRenderer } = require('electron')
const Store = require('electron-store')
const store = new Store()
const open = require("open")
const crypto = require('crypto')
const AdmZip = require("adm-zip")
const setup = new Setup()

function HashValue() {
	return this
}

HashValue.prototype.compute = async function (file, customStringValue) {
	const fileBuffer = await fsAync.readFile(file)
	const hashSum = crypto.createHash('sha256')
	let newBuffer = null
	if (customStringValue === undefined) {
		newBuffer = fileBuffer
	} else {
		const customStringValueBuffer = Buffer.from(customStringValue, 'utf8')
		newBuffer = Buffer.concat([customStringValueBuffer, fileBuffer]);
	}
	hashSum.update(newBuffer);
	const hex = hashSum.digest('hex');
	return hex;
}


function listFolders(rootFolder) {
	const results = [];
	try {
		// Read the contents of the root folder
		const files = fs.readdirSync(rootFolder);

		// Iterate over the files and folders
		for (const file of files) {
			// Construct the full path of the file
			const filePath = `${rootFolder}/${file}`;

			// Check if the file is a directory
			if (fs.statSync(filePath).isDirectory()) {
				// If the file is a directory, recursively search it for the specified files
				const folders = listFolders(filePath);
				results.push(...folders);
			} else if (file === 'template.json' || file === 'template.png' || file === 'template.blend') {
				// If the file is one of the specified files, add the folder to the results
				results.push(rootFolder);
				break;
			}
		}
	} catch (e) {
		logger.error('[KYŌGA] Error searching for template folder:', e.message)
	}

	return results;
}

function clearLineBreaks(text) {
	const result = text.toString().replace(/\r\n/g, '\n')
	return result
}

// https://www.npmjs.com/package/gunzip-file
// npm i adm-zip
const download = (url, dest, e) => {
	return new Promise(function (resolve, reject) {
		const file = fs.createWriteStream(dest);
		const req = request.get(url);
		let len = 1;
		let cur = 0;
		let total = len / 1048576; //1048576 - bytes in  1Megabyte
		req.on('response', function (data) {
			logger.debug('[KYŌGA] Download response headers content-length:', data.headers['content-length']);
		});

		// verify response code
		req.on('response', (response) => {
			if (response.statusCode !== 200) {
				reject(new Error('Response status was ' + response.statusCode));
			}
			len = parseInt(response.headers['content-length'], 10);
			cur = 0;
			total = len / 1048576; //1048576 - bytes in  1Megabyte
			e({
				total,
				percent: (100.0 * cur / (len || 1)).toFixed(2)
			})

			req.pipe(file);
		});
		req.on("data", function (chunk) {
			cur += chunk.length;
			e({
				total: len,
				percent: (100.0 * cur / (len || 1)).toFixed(2)
			})
		});

		// close() is async, call cb after close completes
		file.on('finish', () => file.close(resolve));

		// check for request errors
		req.on('error', (err) => {
			fs.unlink(dest, () => reject(new Error(err.message))); // delete the (partial) file and then return the error
		});

		file.on('error', (err) => { // Handle errors
			fs.unlink(dest, () => reject(new Error(err.message))); // delete the (partial) file and then return the error
		});
	})
};

let abortController = null

contextBridge.exposeInMainWorld('myAPI', {
	desktop: true,
	x: (e) => {
		return new Promise((resolve) => {
			for (let i = 0; i < 5; i++) {
				e.f(`"a" + ${i}`)
			}
			resolve(true)
		})
	},
	download,
	unzip: (zipFile, files, targetPath) => {
		const zip = new AdmZip(zipFile)
		for (let f = 0; f < files.length; f++) {
			const fn = files[f];
			zip.extractEntryTo(/*entry name*/ fn, /*target path*/ targetPath, /*maintainEntryPath*/ false, /*overwrite*/ true);
		}
	},
	deleteFile: async (filename) => {
		return await fsAync.unlink(filename)
	},
	appendLogFileEntry: async (filename, log) => {
		fsAync.appendFile(filename, log + "\r\n", (err) => {
			if (err) {
				logger.error('[KYŌGA] Error appending to log file:', err.message)
			}
		})
	},
	toggleDevTools: async () => {
		const result = await ipcRenderer.invoke("devtools:toggle")
		return result;
	},
	openDirectory: async () => {
		const result = await ipcRenderer.invoke("dialog:openDirectory")
		return result;
	},
	openZipFile: async () => {
		const result = await ipcRenderer.invoke("dialog:openZipFile")
		return result;
	},
	getUserTemplateFolder: () => {
		const result = path.join(path.dirname(store.path), 'templates')
		return result;
	},
	showTemplateFolder: async () => {
		const templateFolder = path.join(path.dirname(store.path), 'templates')
		open(templateFolder);
	},
	showFactoryTemplateFolder: async () => {
		const p = await ipcRenderer.invoke("path:app")
		const factory = path.join(p, '.webpack/renderer', 'static/templates/@factory')
		open(factory);
	},
	homeDirectory: async () => {
		const result = path.dirname(store.path)
		return result
	},
	tempDirectory: async () => {
		const result = ipcRenderer.invoke("path:temp")
		return result;
	},
		clearCache: async () => {
			const temp = await ipcRenderer.invoke("path:temp")
			logger.debug('[KYŌGA] Clearing cache from temporary directory:', temp)
		// delete *_BAND_*.wav and *_BAND_*.csv files in temp directory
		const files = await fsAync.readdir(temp)
		for (let i = 0; i < files.length; i++) {
			const file = files[i].toLowerCase()
			if (file.indexOf('_band_') > -1 && (file.indexOf('.wav') > -1 || file.indexOf('.csv') > -1)) {
				const fn = path.join(temp, file)
				logger.debug('[KYŌGA] Deleting analysis cache file:', fn)
				await fsAync.unlink(fn)
			}
		}
	},

	/* 	instance_test: async () => {
			const result = await ipcRenderer.invoke("instance:check")
			return result;
		}, */
	ww: async () => {
		const result = path.join(__dirname, './inference.js')
		//const w = fs.readFileSync(result, 'utf8').toString()
		//const r = new Worker(URL.createObjectURL(new Blob([w], { type: 'text/javascript' })));

		const res = new Worker(result);

		return res;
	},
	isDev: () => {
		return process.execPath.match(/dist[\\/]electron/i)
	},
	fileExists: (fn) => {
		const result = fs.existsSync(fn)
		return result;
	},
	deleteFile: (fn) => {
		const result = fs.unlinkSync(fn)
		return result;
	},
	// get filename with extension
	getFilename: (fn) => {
		const result = path.parse(fn).base.toLowerCase()
		return result;
	},
	rawFilename: (fn) => {
		const result = path.parse(fn).name.toLowerCase()
		return result;
	},
	storageDataPath: () => {
		return store.path;
	},
	load: (key) => {
		return store.get(key)
	},
	save: (key, value) => {
		store.set(key, value)
	},
	open: (url) => {
		open(url)
	},
	// function to encode file data to base64 encoded string
	image64: (file) => {
		try {

			// read binary data
			const bitmap = fs.readFileSync(file);
			// convert binary data to base64 encoded string
			return Buffer.from(bitmap).toString('base64');
		} catch (error) {
			return ""
		}
	},
	jsonFile: (file) => {
		const j = fs.readFileSync(file)
		return JSON.parse(j.toString())
	},
	copyFile: (source, target) => {
		fs.copyFileSync(source, target)
	},
	readFileSync: (source) => {
		const result = fs.readFileSync(source).toString()
		return result;
	},
	writeJsonFile: (filename, obj) => {
		fs.writeFileSync(filename, JSON.stringify(obj, null, 2));
	},
	execCancel: () => {
		abortController.abort();
	},
	pathJoin: (args) => {
		return path.join.apply(path, args)
	},
	hashValue: async (file, customStringValue) => {
		const h = new HashValue()
		const hex = await h.compute(file, customStringValue)
		return hex;
	},
	copyFile: async (source, target) => {
		const result = await fsAync.copyFile(source, target)
		return result;
	},
	getPath(filename) {
		return path.dirname(filename)
	},
	exec: async (config) => {
		return new Promise((resolve, reject) => {
			abortController = new AbortController();
			const subprocess = execa(config.cmd, config.parms, {
				cwd: config.cwd,
				signal: abortController.signal
			})
			if (config.pipeToFile) {
				subprocess.stdout.pipe(fs.createWriteStream(config.pipeToFile))
			}

			subprocess.stdout.setEncoding('utf8')

			if (config.stdout) {
				subprocess.stdout.on('data', function (data) {
					const lines = clearLineBreaks(data).split('\n')
					for (let l = 0; l < lines.length; l++) {
						const line = lines[l].trim();
						if (line !== '') {
							config.stdout(line)
						}
					}
				})
			}

			if (config.stderr) {
				subprocess.stderr.on('data', function (data) {
					const lines = clearLineBreaks(data).split('\n')
					for (let l = 0; l < lines.length; l++) {
						const line = lines[l].trim();
						if (line !== '') {
							config.stderr(line)
						}
					}
				})
			}

			subprocess.on('close', function (exitcode) {
				// resolve(exitcode.toString())
			})

			try {
				// const result = await 
				subprocess.then(resolve).catch(reject)
			} catch (error) {
				reject(error)
			}
		})
		// subprocess.stdout.pipe(fs.createWriteStream('stdout.txt'))
	},
	copyToclipboard: (text) => {
		clipboard.writeText(text)
	},
	simpleExec: async (app, parms, cwd) => {
		const { stdout } = await execa(app, parms, {
			cwd: cwd
		});
		return (stdout);
	},
	staticFile: async (file) => {
		const p = await ipcRenderer.invoke("path:app")
		const filePath = path.join(p, '.webpack/renderer', file);
		return {
			path: filePath,
			content: await fsAync.readFile(filePath, 'utf8'),
		}
	},
	compileTemplate: (templateString) => {
		var template = Handlebars.compile(templateString)
		return template
	},

	getWaveformData: async (file) => {
		const result = await fsAync.readFile(file, 'binary')
		return result;
	},
	tempWrite: (data) => {
		const fn = tempWrite.sync(data)
		return fn;
	},
	filenamify: (str) => {
		return filenamify(str)
	},
	getAppVersion: async () => {
		const p = await ipcRenderer.invoke("app:version")
		return p
	},
	getOsVersion: () => {
		const p = `${os.platform()} ${os.release()}`; // 'darwin'
		return p
	},
	platform: () => {
		return process.platform
	},
	isWindows: () => {
		const result = process.platform === "win32";
		return result
	},
	binaryFolder: () => {
		const result = path.join(path.dirname(store.path), 'apps')
		if (!fs.existsSync(result)) {
			fs.mkdirSync(result)
		}
		return result
	},
	getBasename: (file) => {
		// get filename without extension
		return path.basename(file, path.extname(file))
	},
	copyDirectory: async (source, destination) => {
		// Copy node_modules content to destination
		try {

			await cpy(path.join(`${source}/**`), destination)
		} catch (e) {
			logger.error('[KYŌGA] Error copying directory:', e.message)
		}
	},
	getBlenderLocation: async () => {
		const l = new BlenderLocation()
		const result = await l.find()
		return result
	},
	setup: () => {
		return setup
	},
	downloadAndUnzip: async (targetDirectory, tempDirectory, app, setState, platform) => {
		return await setup.downloadAndUnzip(targetDirectory, tempDirectory, app, setState, platform)
	},
	filenamify: (str) => { return filenamify(str) },
	setupGetExecutable: (homeDirectory, app, tool) => {
		const result = setup.getExecutable(homeDirectory, app, tool, setup.platform())
		return result
	},
	applicationStaticFolder: async () => {
		const p = await ipcRenderer.invoke("path:app")
		return path.join(p, '.webpack/renderer', 'static')
	},
	getTemplates: async () => {
		const thirdParty = path.join(path.dirname(store.path), 'templates')
		const p = await ipcRenderer.invoke("path:app")
		const factory = path.join(p, '.webpack/renderer', 'static/templates')
		const factoryTemplates = listFolders(factory)
		const folders = factoryTemplates.concat(listFolders(thirdParty))

		const templateLimit = factoryTemplates.length - 2
		let currentTemplate = 0
		const result = folders.map(f => {
			// normalize path separators to os specific separators
			logger.debug('[KYŌGA] Loading template from path:', f)
			f = path.normalize(f)

			// the last 2 folders of path f where the 1.st is the author and the 2.nd the template name
			const parts = f.split(path.sep)
			const author = parts[parts.length - 2]
			const name = parts[parts.length - 1]

			const key = f.replace(/\\/g, '_').replace(/\//g, '_')

			currentTemplate = currentTemplate + 1

			const fn = path.join(f, 'template.json')
			let res = {
				path: f,
				key: key,
				author: author,
				name: name,
				image: path.join(f, 'template.png'),
				json: path.join(f, 'template.json'),
				blend: path.join(f, 'template.blend'),
				config: path.join(f, 'template.json'),
				isFactoryTemplate: f.toLowerCase().indexOf('@factory') !== -1
			}

			if (
				fs.existsSync(res.image) &&
				fs.existsSync(res.blend) &&
				fs.existsSync(res.json)
			) {
				try {
					res.config = JSON.parse(fs.readFileSync(fn, 'utf8'))
				} catch (e) {
					res.config = {}
					logger.error('[KYŌGA] Error parsing template config:', e.message)
				}
			} else {
				res = null
			}
			return res
		}).filter(f => f !== null).sort((a, b) => {
			if (a.isFactoryTemplate && !b.isFactoryTemplate) {
				return 1; // a comes before b
			} else if (!a.isFactoryTemplate && b.isFactoryTemplate) {
				return -1; // b comes before a
			} else {
				return 0; // leave order unchanged
			}
		})

		return result
	},
	exportTemplate: async (source, target) => {
		const ctrl = new TemplateController()
		await ctrl.exportTemplate(source, target)
	},
	installTemplate: async (zipFilename) => {
		const ctrl = new TemplateController()
		await ctrl.install(zipFilename)
	},
	analyzeAudio: async (filePath, templates) => {
		try {
			const analysis = await audioAnalyzer.analyzeAudio(filePath, templates)
			return analysis
		} catch (error) {
			logger.error('[KYŌGA] Audio analysis error:', error.message)
			return null
		}
	},
	getAnalyzerStatus: () => {
		return audioAnalyzer.getStatus()
	},

	// ========================================
	// KYŌGA SYNESTHETIC FRAMEWORK API
	// ========================================

	/**
	 * Translate audio features into a 9-dimensional mood vector.
	 * This is Kyōga's perceptual lens on the music.
	 * 
	 * @param {Object} audioFeatures - From analyzeAudio()
	 * @returns {Object} { mood: { energetic, calm, dark, bright, ... }, confidence: 0-1 }
	 */
	interpretMood: (audioFeatures) => {
		try {
			logger.debug('[KYŌGA] API call: interpretMood()')
			const result = kyoga.interpretMood(audioFeatures)
			return result
		} catch (error) {
			logger.error('[KYŌGA] Error in interpretMood:', error.message)
			return { mood: {}, confidence: 0, error: error.message }
		}
	},

	/**
	 * Generate a harmonious color palette from a mood vector.
	 * Colors are the visual voice of the music.
	 * 
	 * @param {Object} mood - From interpretMood()
	 * @returns {Object} { primary, secondary, tertiary, accent1, accent2, hueBase, saturation, lightness }
	 */
	resonateColor: (mood) => {
		try {
			logger.debug('[KYŌGA] API call: resonateColor()')
			const palette = kyoga.resonateColor(mood)
			return palette
		} catch (error) {
			logger.error('[KYŌGA] Error in resonateColor:', error.message)
			return { primary: '#999999', error: error.message }
		}
	},

	/**
	 * Score a template's compatibility with the audio mood.
	 * Higher scores indicate better harmony between visual form and music.
	 * 
	 * @param {Object} template - Template object with { name, style, emotionalProfile, ... }
	 * @param {Object} mood - From interpretMood()
	 * @returns {Object} { score: 0-1, explanation: string }
	 */
	harmonizeTemplate: (template, mood) => {
		try {
			logger.debug('[KYŌGA] API call: harmonizeTemplate()', { template: template.name })
			const result = kyoga.harmonizeTemplate(template, mood)
			return result
		} catch (error) {
			logger.error('[KYŌGA] Error in harmonizeTemplate:', error.message)
			return { score: 0.5, explanation: 'Unable to evaluate harmony', error: error.message }
		}
	},

	/**
	 * Generate intelligent parameter suggestions for a template based on audio analysis.
	 * Suggests colors, animation speeds, opacity, and other visual parameters.
	 * 
	 * @param {Object} templateParams - Template parameter definitions
	 * @param {Object} audioFeatures - From analyzeAudio()
	 * @param {Object} mood - From interpretMood()
	 * @returns {Object} { paramName: { suggested, confidence, reasoning }, ... }
	 */
	tuneParameters: (templateParams, audioFeatures, mood) => {
		try {
			logger.debug('[KYŌGA] API call: tuneParameters()')
			const suggestions = kyoga.tuneParameters(templateParams, audioFeatures, mood)
			return suggestions
		} catch (error) {
			logger.error('[KYŌGA] Error in tuneParameters:', error.message)
			return { error: error.message }
		}
	}
})


const templateFolder = path.join(path.dirname(store.path), 'templates')
// create templates folder if not exists
if (!fs.existsSync(templateFolder)) {
	fs.mkdirSync(templateFolder)
}
const text = `
Save you 3rd party templates here.
Put each template in a separate folder like .../ssp/templates/[AUTHOR-NAME]/[TEMPLATE_NAME].
`
fs.writeFileSync(path.join(templateFolder, 'README.txt'), text)

const myAsyncServicePromise = new Promise((resolve) => { resolve(true) })
contextBridge.exposeInMainWorld('myAsyncServicePromise', myAsyncServicePromise)