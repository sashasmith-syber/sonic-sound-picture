/**
 * Centralized Error Handling & Logging System
 * Provides structured logging and error management
 */

const LOG_LEVELS = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	CRITICAL: 4
}

class Logger {
	constructor() {
		this.currentLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG
		this.logs = []
		this.maxLogs = 1000
		this.errorCallbacks = []
	}

	/**
	 * Set logging level
	 */
	setLevel(level) {
		this.currentLevel = level
	}

	/**
	 * Register callback for critical errors
	 */
	onError(callback) {
		this.errorCallbacks.push(callback)
	}

	/**
	 * Internal logging method
	 */
	_log(level, levelName, message, data = null) {
		if (level < this.currentLevel) return

		const timestamp = new Date().toISOString()
		const logEntry = {
			timestamp,
			level: levelName,
			message,
			data
		}

		this.logs.push(logEntry)
		if (this.logs.length > this.maxLogs) {
			this.logs.shift()
		}

		// Always output to console
		const consoleMethod = levelName === 'ERROR' || levelName === 'CRITICAL' ? 'error' : 'log'
		console[consoleMethod](`[${levelName}] ${timestamp} - ${message}`, data || '')

		// Trigger callbacks for critical errors
		if (level >= LOG_LEVELS.ERROR) {
			this.errorCallbacks.forEach(cb => cb(logEntry))
		}
	}

	debug(message, data) {
		this._log(LOG_LEVELS.DEBUG, 'DEBUG', message, data)
	}

	info(message, data) {
		this._log(LOG_LEVELS.INFO, 'INFO', message, data)
	}

	warn(message, data) {
		this._log(LOG_LEVELS.WARN, 'WARN', message, data)
	}

	error(message, data) {
		this._log(LOG_LEVELS.ERROR, 'ERROR', message, data)
	}

	critical(message, data) {
		this._log(LOG_LEVELS.CRITICAL, 'CRITICAL', message, data)
	}

	/**
	 * Get recent logs
	 */
	getLogs(count = 50) {
		return this.logs.slice(-count)
	}

	/**
	 * Export logs as JSON
	 */
	exportLogs() {
		return JSON.stringify(this.logs, null, 2)
	}
}

/**
 * Async error handler wrapper
 * Wraps async functions to catch and log errors
 */
function asyncHandler(fn) {
	return async (...args) => {
		try {
			return await fn(...args)
		} catch (error) {
			const logger = require('./logger.js')
			logger.error(`Async operation failed: ${fn.name}`, {
				message: error.message,
				stack: error.stack
			})
			throw error
		}
	}
}

/**
 * Safe API call wrapper
 * Handles common API errors gracefully
 */
async function safeApiCall(apiFunction, fallbackValue = null) {
	try {
		return await apiFunction()
	} catch (error) {
		const logger = require('./logger.js')
		logger.error('API call failed', {
			message: error.message,
			stack: error.stack
		})
		return fallbackValue
	}
}

module.exports = {
	Logger,
	LOG_LEVELS,
	asyncHandler,
	safeApiCall,
	logger: new Logger()
}
