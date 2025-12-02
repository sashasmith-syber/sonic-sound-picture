
const Log = function () {
	return this
}

Log.prototype.init = async function () {
	// FIXME: FIX PERMISSION DENIED
	this.logFilename = await window.myAPI.pathJoin([await window.myAPI.homeDirectory(), 'ssp.log'])
	// logger.info('[KYŌGA] Log file initialized:', this.logFilename)
}

Log.prototype.reset = async function () {
	window.myAPI.deleteFile(this.logFilename)
}

Log.prototype.stringify = function (obj) {
	const result = typeof obj === 'string' ? obj : JSON.stringify(obj, (key, value) => {
		if (value === obj) {
			return;
		}
		return value;
	})
	return result
}

Log.prototype.argsToString = async function () {
	const result = []
	const args = Array.from(arguments)
	for (let a = 0; a < args.length; a++) {
		const arg = Array.from(args[a])

		for (let b = 0; b < arg.length; b++) {
			const e = arg[b];

			try {
				result.push(this.stringify(e));
			} catch (error) {
				// skip errors
			}
		}
	}


	return result
}

Log.prototype.writePersistent = async function (logType, args) {
	/* skip logging to file for now 
	const logEntry = await this.argsToString(args)
	try {
		const dt = new Date().toUTCString()
		const strings = [dt, `[${logType}]`].concat(logEntry);
		window.myAPI.appendLogFileEntry(this.logFilename, strings.join(' '));
	} catch (e) {
		// logger.error('[KYŌGA] Unable to persist log entry:', e.message);
	} 
	*/
}

Log.prototype.log = function () {
	// Use logger instance for modern logging
	if (typeof logger !== 'undefined') {
		logger.debug('[KYŌGA] Log:', Array.from(arguments).join(' '))
	}
	this.writePersistent('log', arguments)
}

Log.prototype.error = function () {
	// Use logger instance for modern logging
	if (typeof logger !== 'undefined') {
		logger.error('[KYŌGA] Error:', Array.from(arguments).join(' '))
	}
	this.writePersistent('log', arguments)
}

Log.prototype.warn = function () {
	// Use logger instance for modern logging
	if (typeof logger !== 'undefined') {
		logger.warn('[KYŌGA] Warning:', Array.from(arguments).join(' '))
	}
	this.writePersistent('log', arguments)
}

Log.prototype.info = function () {
	// Use logger instance for modern logging
	if (typeof logger !== 'undefined') {
		logger.info('[KYŌGA] Info:', Array.from(arguments).join(' '))
	}
	this.writePersistent('log', arguments)
}

Log.prototype.trace = function () {
	// Use logger instance for modern logging
	if (typeof logger !== 'undefined') {
		logger.debug('[KYŌGA] Trace:', Array.from(arguments).join(' '))
	}
	this.writePersistent('log', arguments)
}

module.exports = Log