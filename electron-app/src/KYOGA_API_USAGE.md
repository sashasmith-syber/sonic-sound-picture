# 🎭 KYŌGA API Usage Guide

## Overview

The Kyōga framework is now exposed through the `window.myAPI` bridge in React components. This guide explains how to use each of the four synesthetic interpretation methods.

---

## Quick Reference

```javascript
// Import at the top of your React component
// (myAPI is already available in window)

// 1. Analyze audio file
const analysis = await window.myAPI.analyzeAudio(filePath, templates);

// 2. Interpret the audio's emotional essence
const moodVector = window.myAPI.interpretMood(analysis.audioFeatures);

// 3. Generate a color palette from the mood
const colors = window.myAPI.resonateColor(moodVector.mood);

// 4. Score template compatibility with the mood
const harmony = window.myAPI.harmonizeTemplate(template, moodVector.mood);

// 5. Get parameter suggestions for the template
const paramSuggestions = window.myAPI.tuneParameters(
  templateParams,
  analysis.audioFeatures,
  moodVector.mood
);
```

---

## The Four Core Methods

### 1. **interpretMood(audioFeatures)**

**Purpose:** Translate raw audio data into Kyōga's 9-dimensional mood space.

**Input:**

```javascript
audioFeatures = {
  bpm: 120,                    // Beats per minute
  energy: 0.75,               // 0-1, overall intensity
  key: 'C',                    // Musical key
  mode: 1,                     // 0 = minor, 1 = major
  spectralCentroid: 4000,     // Hz, brightness
  spectralRolloff: 8000,      // Hz, harmonic density
  tempogram: [0.8, 0.85, ...]  // Temporal variations
}
```

**Output:**

```javascript
{
  mood: {
    energetic: 0.65,    // Kinetic energy level
    calm: 0.15,         // Serenity/stillness
    dark: 0.10,         // Shadow/depth
    bright: 0.70,       // Luminosity/major tonality
    aggressive: 0.20,   // Confrontation/harshness
    ambient: 0.25,      // Environmental presence
    rhythmic: 0.75,     // Pulse/beat strength
    melodic: 0.60,      // Harmonic content
    experimental: 0.15  // Novel/unusual elements
  },
  confidence: 0.85  // 0-1, certainty of interpretation
}
```

**Usage Example:**

```javascript
async handleAudioUpload(filePath) {
  try {
    const analysis = await window.myAPI.analyzeAudio(filePath, this.state.templates);
    const mood = window.myAPI.interpretMood(analysis.audioFeatures);

    this.setState({
      audioMood: mood.mood,
      moodConfidence: mood.confidence
    });
  } catch (error) {
    logger.error('[App] Error interpreting mood:', error);
  }
}
```

---

### 2. **resonateColor(mood)**

**Purpose:** Translate a mood vector into a harmonious, perceptually pleasing color palette.

**Input:**

```javascript
mood = {
  energetic: 0.65,
  calm: 0.15,
  dark: 0.1,
  bright: 0.7,
  aggressive: 0.2,
  ambient: 0.25,
  rhythmic: 0.75,
  melodic: 0.6,
  experimental: 0.15,
};
```

**Output:**

```javascript
{
  primary: '#FF6B35',       // Main color
  secondary: '#FF9500',    // Analogous harmony
  tertiary: '#00CED1',     // Complementary
  accent1: '#8B0000',      // Accent rhythm
  accent2: '#2E8B57',      // Secondary accent
  hueBase: 25,             // Base hue (0-360)
  saturation: 0.78,        // Color intensity (0-1)
  lightness: 0.55          // Brightness (0-1)
}
```

**Usage Example:**

```javascript
const palette = window.myAPI.resonateColor(this.state.audioMood);

// Apply to UI
this.setState({
  suggestedColors: palette,
});

// Or directly style a preview
document.getElementById('colorPreview').style.backgroundColor = palette.primary;
```

**Palette Structure:**

- **Primary Color:** The main emotional expression
- **Secondary:** Analogous harmony (analogous color scheme)
- **Tertiary:** Complementary contrast (opposite on color wheel)
- **Accents:** Support colors for visual rhythm

---

### 3. **harmonizeTemplate(template, mood)**

**Purpose:** Score how well a template's visual form "sings" with the music.

**Input:**

```javascript
(template = {
  name: 'Digital Water',
  path: '/templates/@factory/digital-water',
  style: 'organic', // abstract, geometric, organic, minimalist, intense
  emotionalProfile: {
    energetic: 0.3,
    calm: 0.7,
    rhythmic: 0.5,
    // ... other mood dimensions
  },
  targetBpmRange: {
    min: 60,
    max: 140,
  },
}),
  (mood = {
    /* from interpretMood */
  });
```

**Output:**

```javascript
{
  score: 0.87,  // 0-1, higher = better fit
  explanation: "This template resonates perfectly with the music's essence. The organic form mirrors the bright, energetic quality, while the flowing geometry echoes the harmonic progression."
}
```

**Usage Example:**

```javascript
async recommendTemplates() {
  const mood = this.state.audioMood;
  const scores = this.state.templates.map(template => {
    const harmony = window.myAPI.harmonizeTemplate(template, mood);
    return {
      ...template,
      harmonyScore: harmony.score,
      explanation: harmony.explanation
    };
  });

  // Sort by score, get top 5
  const topTemplates = scores
    .sort((a, b) => b.harmonyScore - a.harmonyScore)
    .slice(0, 5);

  this.setState({ recommendedTemplates: topTemplates });
}
```

---

### 4. **tuneParameters(templateParams, audioFeatures, mood)**

**Purpose:** Generate intelligent parameter suggestions based on audio mood.

**Input:**

```javascript
(templateParams = {
  primaryColor: {
    type: 'color',
    default: '#FF0000',
    value: '#FF0000',
  },
  animationSpeed: {
    type: 'number',
    min: 0.1,
    max: 2.0,
    value: 1.0,
  },
  opacity: {
    type: 'number',
    min: 0,
    max: 1,
    value: 1.0,
  },
  waveHeight: {
    type: 'number',
    min: 10,
    max: 500,
    value: 100,
  },
}),
  (audioFeatures = {
    /* from analyzeAudio */
  }),
  (mood = {
    /* from interpretMood */
  });
```

**Output:**

```javascript
{
  primaryColor: {
    suggested: '#FF6B35',
    confidence: 0.9,
    reasoning: 'Resonated from audio mood'
  },
  animationSpeed: {
    suggested: 1.25,
    confidence: 0.75,
    reasoning: 'Timed to harmonic tempo'
  },
  opacity: {
    suggested: 0.68,
    confidence: 0.6,
    reasoning: 'Derived from ambient mood dimension'
  },
  waveHeight: {
    suggested: 320,
    confidence: 0.65,
    reasoning: 'Scaled with audio energy'
  }
}
```

**Usage Example:**

```javascript
async suggestParameters(template) {
  const suggestions = window.myAPI.tuneParameters(
    template.parameters,
    this.state.audioFeatures,
    this.state.audioMood
  );

  // Auto-fill parameter UI with suggestions
  Object.keys(suggestions).forEach(paramName => {
    const suggestion = suggestions[paramName];
    const confidence = suggestion.confidence;

    // Show suggestion with confidence indicator
    this.showParameterSuggestion(
      paramName,
      suggestion.suggested,
      confidence,
      suggestion.reasoning
    );
  });
}
```

---

## Complete Workflow Example

Here's how to integrate all four methods in a React component:

```javascript
import * as React from 'react';
import { logger } from './logger-esm.js';

class AudioVisualizationWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFile: null,
      audioFeatures: null,
      audioMood: null,
      moodConfidence: 0,
      colorPalette: null,
      recommendedTemplates: [],
      selectedTemplate: null,
      parameterSuggestions: null,
    };
  }

  // Step 1: User uploads audio
  async onAudioUpload(filePath) {
    try {
      logger.info('[AudioWizard] Analyzing audio file:', filePath);

      // Get audio analysis
      const analysis = await window.myAPI.analyzeAudio(filePath, this.props.templates);

      if (!analysis) {
        logger.error('[AudioWizard] Audio analysis failed');
        return;
      }

      this.setState({ audioFeatures: analysis.audioFeatures });
      this.interpretMood(analysis.audioFeatures);
    } catch (error) {
      logger.error('[AudioWizard] Error uploading audio:', error.message);
    }
  }

  // Step 2: Interpret mood from features
  interpretMood(audioFeatures) {
    logger.debug('[AudioWizard] Interpreting mood...');

    const moodResult = window.myAPI.interpretMood(audioFeatures);

    this.setState(
      {
        audioMood: moodResult.mood,
        moodConfidence: moodResult.confidence,
      },
      () => this.generateColorPalette()
    );
  }

  // Step 3: Generate color palette
  generateColorPalette() {
    logger.debug('[AudioWizard] Generating color palette...');

    const palette = window.myAPI.resonateColor(this.state.audioMood);

    this.setState({ colorPalette: palette }, () => this.recommendTemplates());
  }

  // Step 4: Score and rank templates
  recommendTemplates() {
    logger.debug('[AudioWizard] Scoring templates for harmony...');

    const scores = this.props.templates.map((template) => {
      const harmony = window.myAPI.harmonizeTemplate(template, this.state.audioMood);

      return {
        ...template,
        harmonyScore: harmony.score,
        harmonyExplanation: harmony.explanation,
      };
    });

    const topTemplates = scores.sort((a, b) => b.harmonyScore - a.harmonyScore).slice(0, 5);

    this.setState({ recommendedTemplates: topTemplates }, () =>
      logger.info('[AudioWizard] Top 5 templates recommended')
    );
  }

  // Step 5: User selects a template
  selectTemplate(template) {
    logger.debug('[AudioWizard] Template selected:', template.name);

    this.setState({ selectedTemplate: template }, () => this.suggestParameters(template));
  }

  // Step 6: Generate parameter suggestions
  suggestParameters(template) {
    logger.debug('[AudioWizard] Generating parameter suggestions...');

    const suggestions = window.myAPI.tuneParameters(
      template.parameters,
      this.state.audioFeatures,
      this.state.audioMood
    );

    this.setState({ parameterSuggestions: suggestions });
  }

  // User can accept/reject suggestions
  acceptSuggestion(paramName) {
    const suggestion = this.state.parameterSuggestions[paramName];
    logger.info('[AudioWizard] User accepted suggestion:', {
      param: paramName,
      value: suggestion.suggested,
    });

    // Update template parameters
    const updated = { ...this.state.selectedTemplate };
    updated.parameters[paramName].value = suggestion.suggested;
    this.setState({ selectedTemplate: updated });
  }

  render() {
    // Render UI based on state
    // Display mood vector, colors, template recommendations, parameters
    return <div className="audio-wizard">{/* UI implementation */}</div>;
  }
}

export default AudioVisualizationWizard;
```

---

## Error Handling

Each API method returns an error gracefully:

```javascript
try {
  const result = window.myAPI.interpretMood(audioFeatures);

  // Check for error
  if (result.error) {
    logger.warn('[App] Mood interpretation warning:', result.error);
    // Fallback to defaults or user override
  }
} catch (error) {
  logger.error('[App] Critical error:', error.message);
}
```

---

## Performance Targets

| Method                | Target  | Notes                       |
| --------------------- | ------- | --------------------------- |
| `interpretMood()`     | <500ms  | Lightweight feature mapping |
| `resonateColor()`     | <100ms  | Color space conversion      |
| `harmonizeTemplate()` | <200ms  | Per-template scoring        |
| `tuneParameters()`    | <300ms  | Parameter suggestions       |
| **Total**             | **<2s** | User-facing wait time       |

---

## Kyōga's Voice in Usage

When using these methods, remember:

- **interpretMood()** reveals the music's emotional landscape
- **resonateColor()** translates mood into visual language
- **harmonizeTemplate()** finds the perfect visual form for the music
- **tuneParameters()** makes the visualization sing with the audio

Every suggestion is an artistic expression, not a statistical average.

---

## Testing the API

Quick test in browser console:

```javascript
// Test interpretMood
const testAudio = { bpm: 120, energy: 0.8, mode: 1, spectralCentroid: 5000 };
const mood = window.myAPI.interpretMood(testAudio);
console.log('Mood:', mood);

// Test resonateColor
const palette = window.myAPI.resonateColor(mood.mood);
console.log('Palette:', palette);

// Test with templates
const template = window.myAPI.getTemplates()[0];
const harmony = window.myAPI.harmonizeTemplate(template, mood.mood);
console.log('Harmony:', harmony);
```

---

## Documentation Updates Checklist

- [x] Import kyoga-framework in preload.js
- [x] Expose 4 core methods via myAPI
- [x] Add error handling for each method
- [x] Document API signatures with JSDoc
- [x] Create usage examples
- [x] Provide complete workflow example
- [ ] Test with actual audio files
- [ ] Integrate into app.jsx UI
- [ ] Create Jest test suite

---

**Status:** Preload API Exposure ✅ COMPLETE  
**Date:** November 19, 2025  
**Next Phase:** App.jsx Integration (UI wiring)
