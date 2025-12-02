/**
 * ES6 Module version of Logger for React components and ES6 imports
 * Use: import { logger } from './logger-esm.js'
 */

const LOG_LEVELS = {
	DEBUG: 'DEBUG',
	INFO: 'INFO',
	WARN: 'WARN',
	ERROR: 'ERROR',
	CRITICAL: 'CRITICAL'
}

const LOG_LEVEL_PRIORITY = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	CRITICAL: 4
}

class Logger {
	constructor(minLevel = LOG_LEVELS.INFO) {
		this.minLevel = minLevel
		this.logs = []
		this.maxLogs = 1000
		this.errorCallbacks = []
		this.logToConsole = true
	}

	_createLogEntry(level, args) {
		const timestamp = new Date().toISOString()
		const message = args.map(arg => {
			if (typeof arg === 'object') {
				try {
					return JSON.stringify(arg)
				} catch (e) {
					return String(arg)
				}
			}
			return String(arg)
		}).join(' ')

		return { timestamp, level, message }
	}

	_addLog(level, args) {
		if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.minLevel]) {
			return
		}

		const entry = this._createLogEntry(level, args)
		this.logs.push(entry)

		// Keep only recent logs
		if (this.logs.length > this.maxLogs) {
			this.logs.shift()
		}

		// Log to console
		if (this.logToConsole) {
			const consoleMethod = level === LOG_LEVELS.WARN ? 'warn' : 
									level === LOG_LEVELS.ERROR || level === LOG_LEVELS.CRITICAL ? 'error' : 
									'log'
			console[consoleMethod](`[${entry.timestamp}] [${level}]`, ...args)
		}

		// Trigger error callbacks for ERROR and CRITICAL
		if (level === LOG_LEVELS.ERROR || level === LOG_LEVELS.CRITICAL) {
			this.errorCallbacks.forEach(cb => {
				try {
					cb(entry)
				} catch (e) {
					console.error('[KYŌGA] Error in error callback:', e.message)
				}
			})
		}
	}

	debug(...args) {
		this._addLog(LOG_LEVELS.DEBUG, args)
	}

	info(...args) {
		this._addLog(LOG_LEVELS.INFO, args)
	}

	warn(...args) {
		this._addLog(LOG_LEVELS.WARN, args)
	}

	error(...args) {
		this._addLog(LOG_LEVELS.ERROR, args)
	}

	critical(...args) {
		this._addLog(LOG_LEVELS.CRITICAL, args)
	}

	getLogs(level = null) {
		if (!level) {
			return this.logs
		}
		return this.logs.filter(log => log.level === level)
	}

	onError(callback) {
		if (typeof callback === 'function') {
			this.errorCallbacks.push(callback)
		}
	}

	exportLogs(format = 'json') {
		if (format === 'json') {
			return JSON.stringify(this.logs, null, 2)
		} else if (format === 'csv') {
			const header = 'Timestamp,Level,Message\n'
			const rows = this.logs.map(log => 
				`"${log.timestamp}","${log.level}","${log.message.replace(/"/g, '""')}"`
			).join('\n')
			return header + rows
		}
		return this.logs.map(log => `[${log.timestamp}] [${log.level}] ${log.message}`).join('\n')
	}

	clear() {
		this.logs = []
	}
}

// Create singleton instance
const logger = new Logger(LOG_LEVELS.DEBUG)

// Utility function for safe async execution with error logging
export const asyncHandler = (asyncFunc) => {
	return async (...args) => {
		try {
			return await asyncFunc(...args)
		} catch (error) {
			logger.error('Async operation failed:', error.message, error.stack)
			throw error
		}
	}
}

// Utility function for safe API calls with error logging
export const safeApiCall = async (apiFunc, fallback = null) => {
	try {
		return await apiFunc()
	} catch (error) {
		logger.error('API call failed:', error.message)
		return fallback
	}
}

export { logger, Logger, LOG_LEVELS }
