/**
 * Configuration Management
 * Handles environment-specific settings and paths
 */

const fs = require('fs')
const path = require('path')
const os = require('os')

class Config {
	constructor() {
		this.isDevelopment = process.env.NODE_ENV === 'development'
		this.appDataPath = this.getAppDataPath()
		this.devTestPath = this.getDevTestPath()
	}

	/**
	 * Get application data directory
	 */
	getAppDataPath() {
		if (process.platform === 'win32') {
			return path.join(process.env.APPDATA || os.homedir(), 'SSP')
		} else if (process.platform === 'darwin') {
			return path.join(os.homedir(), 'Library', 'Application Support', 'SSP')
		} else {
			return path.join(os.homedir(), '.ssp')
		}
	}

	/**
	 * Get development test audio path
	 * Returns first available test file or null
	 */
	getDevTestPath() {
		// Try common development paths
		const potentialPaths = [
			path.join(os.homedir(), 'Desktop', 'test', 'demo_mastered.wav'),
			path.join(os.homedir(), 'Music', 'test_audio.wav'),
			path.join(os.homedir(), 'Downloads', 'sample.wav')
		]

		for (const testPath of potentialPaths) {
			if (fs.existsSync(testPath)) {
				return testPath
			}
		}

		return null
	}

	/**
	 * Get development audio file for testing
	 * Only available in development mode
	 */
	getDevAudioFile() {
		if (!this.isDevelopment) {
			return null
		}
		return this.devTestPath
	}

	/**
	 * Ensure required directories exist
	 */
	ensureDirectories() {
		if (!fs.existsSync(this.appDataPath)) {
			fs.mkdirSync(this.appDataPath, { recursive: true })
		}
	}
}

module.exports = new Config()
