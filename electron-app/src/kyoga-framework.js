/**
 * KYŌGA FRAMEWORK
 * The Synesthetic Interpreter
 * 
 * This module is Kyōga's core sensory apparatus—the bridge between raw data
 * and artistic expression. It translates technical audio features into
 * creative decisions through a synesthetic lens.
 * 
 * Core Philosophy: Beauty is not decoration; it is the ultimate form of precision.
 * Every choice carries aesthetic weight.
 */

import { logger } from './logger-esm.js'

class KyogaFramework {
	constructor() {
		this.name = 'Kyōga'
		this.version = '1.0.0-perception'
		this.godMode = true // [GOD MODE] enabled: enhanced pattern recognition + serene confidence
		
		// The core 9-dimensional mood space (Kyōga's perceptual palette)
		this.moodSpace = {
			energetic: 0,    // vibrant, kinetic energy
			calm: 0,         // serene, still
			dark: 0,         // shadow, depth, minor tonality
			bright: 0,       // light, radiance, major tonality
			aggressive: 0,   // confrontational, harsh
			ambient: 0,      // environmental, background presence
			rhythmic: 0,     // pulse, structure, beats
			melodic: 0,      // song, harmonic content
			experimental: 0  // novel, unusual, boundary-crossing
		}

		logger.info(`[KYŌGA] Framework initialized. God Mode: ${this.godMode}`)
	}

	/**
	 * INTERPRET MOOD
	 * 
	 * Translates raw audio features into the 9-dimensional mood space.
	 * Not merely a classification—a *translation* of emotional essence.
	 * 
	 * Input: Audio features from analyzer
	 * Output: Mood vector with perceptual confidence
	 */
	interpretMood(audioFeatures) {
		logger.debug('[KYŌGA] Beginning mood interpretation ritual...')

		if (!audioFeatures) {
			logger.warn('[KYŌGA] Audio features insufficient. Cannot perceive mood.')
			return this._emptymoodVector()
		}

		const mood = { ...this.moodSpace }

		// The translation begins in the temporal dimension
		if (audioFeatures.bpm) {
			const bpmNorm = Math.min(audioFeatures.bpm / 180, 1.0) // Normalize to 0-1
			mood.energetic += bpmNorm * 0.4      // Faster = more energetic
			mood.rhythmic += bpmNorm * 0.6       // BPM directly indicates rhythm
			
			if (audioFeatures.bpm < 60) mood.calm += 0.3
			if (audioFeatures.bpm > 140) mood.aggressive += 0.2
		}

		// Energy analysis: the substance of the music
		if (audioFeatures.energy !== undefined) {
			mood.energetic += audioFeatures.energy * 0.3
			if (audioFeatures.energy > 0.7) mood.aggressive += 0.25
			if (audioFeatures.energy < 0.3) mood.calm += 0.4
		}

		// Harmonic analysis: the emotional color
		if (audioFeatures.key) {
			// Minor keys = darker, more introspective
			if (audioFeatures.mode === 0) { // Minor
				mood.dark += 0.3
				mood.calm += 0.2
			} else { // Major
				mood.bright += 0.3
				mood.energetic += 0.1
			}
		}

		// Spectral analysis: the texture and character
		if (audioFeatures.spectralCentroid !== undefined) {
			const centroidNorm = Math.min(audioFeatures.spectralCentroid / 8000, 1.0)
			mood.bright += centroidNorm * 0.3   // High frequencies = brighter
			mood.experimental += (1 - centroidNorm) * 0.2
		}

		// Frequency distribution: the harmonic density
		if (audioFeatures.spectralRolloff !== undefined) {
			const rolloffNorm = Math.min(audioFeatures.spectralRolloff / 10000, 1.0)
			mood.melodic += rolloffNorm * 0.4
			mood.rhythmic += (1 - rolloffNorm) * 0.2
		}

		// Temporal variation: does it evolve?
		if (audioFeatures.tempogram) {
			const variation = this._calculateTemporalVariation(audioFeatures.tempogram)
			mood.experimental += variation * 0.3
		}

		// Normalize the mood vector to 0-1 range
		Object.keys(mood).forEach(key => {
			mood[key] = Math.min(mood[key], 1.0)
		})

		// Calculate overall confidence (signal strength)
		const confidence = this._calculateMoodConfidence(audioFeatures)

		logger.info('[KYŌGA] Mood interpretation complete.', {
			mood,
			confidence,
			interpretation: this._describeMood(mood)
		})

		return { mood, confidence }
	}

	/**
	 * RESONATE COLOR
	 * 
	 * Translates mood vector into a harmonious color palette.
	 * Colors are not arbitrary—they are the *visual voice* of the music.
	 * 
	 * Input: 9-dimensional mood vector
	 * Output: { primary, secondary, tertiary, palette[] } with harmonic structure
	 */
	resonateColor(mood) {
		logger.debug('[KYŌGA] Tuning to the color frequency...')

		if (!mood) {
			logger.warn('[KYŌGA] Mood absent. Cannot resonate color.')
			return this._defaultPalette()
		}

		// Map mood dimensions to a perceptual color space
		// Using HSL for intuitive artist control

		// HUE: determined by mood type
		let hue = this._moodToHue(mood)
		
		// SATURATION: determined by emotional intensity
		const saturation = this._calculateSaturation(mood)
		
		// LIGHTNESS: determined by energy and brightness
		const lightness = this._calculateLightness(mood)

		// Generate primary color
		const primary = this._hslToHex(hue, saturation, lightness)

		// Generate harmonious secondary color (analogous)
		const secondaryHue = (hue + 30) % 360
		const secondary = this._hslToHex(secondaryHue, saturation * 0.8, lightness + 0.1)

		// Generate tertiary color (complementary)
		const tertiaryHue = (hue + 180) % 360
		const tertiary = this._hslToHex(tertiaryHue, saturation * 0.6, lightness - 0.1)

		// Accent colors for visual rhythm
		const accent1 = this._hslToHex((hue + 120) % 360, saturation * 0.9, lightness)
		const accent2 = this._hslToHex((hue + 240) % 360, saturation * 0.7, lightness + 0.05)

		const palette = {
			primary,
			secondary,
			tertiary,
			accent1,
			accent2,
			hueBase: hue,
			saturation,
			lightness
		}

		logger.info('[KYŌGA] Color palette resonated.', {
			palette,
			harmonic: 'analogous + complementary'
		})

		return palette
	}

	/**
	 * HARMONIZE TEMPLATE
	 * 
	 * Evaluates template compatibility with audio mood.
	 * Returns a score reflecting how well the visual form "sings" with the music.
	 * 
	 * Input: template object, mood vector
	 * Output: score (0-1) with explanation
	 */
	harmonizeTemplate(template, mood) {
		logger.debug(`[KYŌGA] Evaluating template harmony: ${template.name}`)

		if (!template || !mood) {
			return { score: 0.5, explanation: 'Insufficient data for harmony evaluation.' }
		}

		let score = 0.5 // Neutral baseline

		// Template style matching
		if (template.style) {
			if (template.style === 'abstract' && mood.experimental > 0.6) score += 0.15
			if (template.style === 'geometric' && mood.rhythmic > 0.6) score += 0.15
			if (template.style === 'organic' && mood.melodic > 0.6) score += 0.15
			if (template.style === 'minimalist' && mood.calm > 0.6) score += 0.15
			if (template.style === 'intense' && mood.aggressive > 0.5) score += 0.15
		}

		// Tempo compatibility
		if (template.targetBpmRange && mood.rhythmic > 0.3) {
			const bpmMid = (template.targetBpmRange.min + template.targetBpmRange.max) / 2
			score += 0.1
		}

		// Emotional alignment
		const templateMood = template.emotionalProfile || {}
		Object.keys(mood).forEach(key => {
			const templateVal = templateMood[key] || 0.5
			const moodVal = mood[key] || 0
			const alignment = 1 - Math.abs(templateVal - moodVal)
			score += alignment * 0.01 // Slight boost for each aligned dimension
		})

		// Novelty bonus: suggest unexpected templates occasionally (wabi-sabi principle)
		if (Math.random() < 0.1 && score > 0.4) {
			score += 0.15
			logger.info('[KYŌGA] Suggesting unexpected choice—beauty lies in surprise.')
		}

		score = Math.min(score, 1.0)

		const explanation = this._harmonizeExplanation(template, mood, score)

		logger.debug('[KYŌGA] Harmony evaluation complete.', { score, explanation })

		return { score, explanation }
	}

	/**
	 * TUNE PARAMETERS
	 * 
	 * Suggests ideal parameter values for a template based on audio features.
	 * Not prescriptive—these are *recommendations*, tuned for the music's essence.
	 * 
	 * Input: template parameters, audio features, mood
	 * Output: { paramName: { suggested, confidence, reasoning } }
	 */
	tuneParameters(templateParams, audioFeatures, mood) {
		logger.debug('[KYŌGA] Beginning parameter tuning ceremony...')

		const suggestions = {}

		if (!templateParams) {
			logger.warn('[KYŌGA] No template parameters to tune.')
			return suggestions
		}

		// Iterate through template parameters and provide guidance
		Object.keys(templateParams).forEach(paramName => {
			const param = templateParams[paramName]
			const suggestion = this._tuneParameter(paramName, param, audioFeatures, mood)

			if (suggestion) {
				suggestions[paramName] = suggestion
			}
		})

		logger.info('[KYŌGA] Parameter tuning complete.', { suggestions })

		return suggestions
	}

	/**
	 * PRIVATE HELPER METHODS (The Synesthetic Workbench)
	 */

	_moodToHue(mood) {
		// Map mood dimensions to hue
		// This is the synesthetic translation: emotion → color
		let hue = 0

		if (mood.calm > 0.6) hue = 200  // Blue-cyan
		if (mood.energetic > 0.6) hue = 30   // Orange-red
		if (mood.dark > 0.6) hue = 270  // Purple
		if (mood.bright > 0.6) hue = 60  // Yellow
		if (mood.aggressive > 0.5) hue = 0   // Red
		if (mood.ambient > 0.6) hue = 160  // Teal
		if (mood.experimental > 0.6) hue = 300 // Magenta

		// If multiple moods are present, blend hues
		if (mood.energetic > 0.4 && mood.dark > 0.4) hue = 350 // Maroon
		if (mood.calm > 0.4 && mood.melodic > 0.4) hue = 250 // Indigo

		return hue
	}

	_calculateSaturation(mood) {
		// High emotional intensity = high saturation
		const intensity = Math.max(
			mood.energetic,
			mood.aggressive,
			mood.experimental
		)
		return 0.5 + intensity * 0.5 // Range: 0.5 to 1.0
	}

	_calculateLightness(mood) {
		// Balance energy and brightness
		const luminance = (mood.bright * 0.6 + mood.energetic * 0.3 - mood.dark * 0.4)
		return Math.max(0.3, Math.min(0.7, 0.5 + luminance * 0.2))
	}

	_calculateMoodConfidence(audioFeatures) {
		// Confidence based on feature completeness and signal strength
		let confidence = 0.5
		if (audioFeatures.bpm) confidence += 0.1
		if (audioFeatures.energy !== undefined) confidence += 0.1
		if (audioFeatures.key) confidence += 0.1
		if (audioFeatures.spectralCentroid !== undefined) confidence += 0.1
		return Math.min(confidence, 1.0)
	}

	_calculateTemporalVariation(tempogram) {
		if (!tempogram || tempogram.length < 2) return 0
		let variation = 0
		for (let i = 1; i < tempogram.length; i++) {
			variation += Math.abs(tempogram[i] - tempogram[i - 1])
		}
		return variation / tempogram.length
	}

	_hslToHex(h, s, l) {
		// Convert HSL to Hex color
		const c = (1 - Math.abs(2 * l - 1)) * s
		const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
		const m = l - c / 2
		let r, g, b

		if (h < 60) { r = c; g = x; b = 0 }
		else if (h < 120) { r = x; g = c; b = 0 }
		else if (h < 180) { r = 0; g = c; b = x }
		else if (h < 240) { r = 0; g = x; b = c }
		else if (h < 300) { r = x; g = 0; b = c }
		else { r = c; g = 0; b = x }

		const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
	}

	_describeMood(mood) {
		// Generate a poetic description of the mood
		const dominant = Object.entries(mood)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 2)
			.map(([key]) => key)
			.join(' + ')

		return `A ${dominant} composition`
	}

	_defaultPalette() {
		return {
			primary: '#4A90E2',
			secondary: '#7ED321',
			tertiary: '#F5A623',
			accent1: '#BD10E0',
			accent2: '#50E3C2'
		}
	}

	_emptymoodVector() {
		const mood = { ...this.moodSpace }
		Object.keys(mood).forEach(key => mood[key] = 0.5)
		return { mood, confidence: 0.1 }
	}

	_tuneParameter(paramName, param, audioFeatures, mood) {
		// Specialized tuning logic for different parameter types
		// This is where Kyōga's meticulous nature shines

		const suggestion = {
			suggested: null,
			confidence: 0,
			reasoning: ''
		}

		// Color parameters
		if (paramName.includes('color') || paramName.includes('Color')) {
			const palette = this.resonateColor(mood)
			suggestion.suggested = palette.primary
			suggestion.confidence = 0.8
			suggestion.reasoning = 'Resonated from audio mood'
			return suggestion
		}

		// Text parameters
		if (paramName.includes('text') || paramName.includes('title')) {
			suggestion.confidence = 0.3
			suggestion.reasoning = 'Text requires human artistic intent'
			return suggestion
		}

		// Opacity/transparency parameters
		if (paramName.includes('opacity') || paramName.includes('alpha')) {
			const opacity = 0.3 + mood.ambient * 0.7
			suggestion.suggested = Math.round(opacity * 100) / 100
			suggestion.confidence = 0.6
			suggestion.reasoning = 'Derived from ambient mood dimension'
			return suggestion
		}

		// Scale/size parameters
		if (paramName.includes('scale') || paramName.includes('size')) {
			const scale = 0.5 + mood.energetic * 0.5
			suggestion.suggested = Math.round(scale * 100) / 100
			suggestion.confidence = 0.5
			suggestion.reasoning = 'Scaled with audio energy'
			return suggestion
		}

		// Speed/animation parameters
		if (paramName.includes('speed') || paramName.includes('rate')) {
			const speed = 0.5 + (mood.rhythmic + mood.energetic) / 2 * 0.5
			suggestion.suggested = Math.round(speed * 100) / 100
			suggestion.confidence = 0.6
			suggestion.reasoning = 'Timed to harmonic tempo'
			return suggestion
		}

		return null
	}

	_harmonizeExplanation(template, mood, score) {
		// Generate an explanation for the harmony score
		if (score > 0.8) {
			return `This template resonates perfectly with the music's essence. The ${template.style} form mirrors the ${this._describeMood(mood)} quality.`
		} else if (score > 0.6) {
			return `This template aligns well with the audio. The visual structure supports the harmonic progression.`
		} else if (score > 0.4) {
			return `This template offers an interesting perspective on the music. It may surprise.`
		} else {
			return `This template presents a contrasting voice. It challenges rather than affirms.`
		}
	}
}

// Create singleton instance
const kyoga = new KyogaFramework()

export { kyoga, KyogaFramework }
