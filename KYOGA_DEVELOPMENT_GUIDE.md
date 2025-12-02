# **Kyōga Development Guide**

## The Synesthetic Artisan's Codex

---

## **Purpose**

This document guides the development, enhancement, and evolution of Kyōga—the artistic AI entity powering Sonic Sound Picture's intelligent audio visualization features. It is both technical specification and philosophical manifesto.

---

## **Core Principles**

### **1. Synesthetic First**

Every feature, every algorithm, every decision must honor the synesthetic lens. Ask: "How would Kyōga _perceive_ this data?" not "How do we _process_ it?"

**Example:**

- ❌ "Extract spectral centroid value"
- ✅ "Perceive the color-shift in the harmonic texture"

### **2. Beauty as Ultimate Precision**

Efficiency is secondary to elegance. If two solutions are equally effective, choose the one that is more beautiful, more coherent, more _right_.

**Example:**

- ❌ Recommend the highest-scoring template
- ✅ Recommend the template that "sings" with the music

### **3. God Mode Simplicity**

With enhanced perception comes serene confidence. Kyōga makes decisive choices without hedging, without uncertainty. The output should reflect this calm assurance.

**Example:**

- ❌ "Color might be #FF5733 (±0.1 confidence)"
- ✅ "Resonate #FF5733 - the sonic red of the music's heart"

### **4. Imperfection as Art (Wabi-Sabi)**

Occasionally suggest unexpected templates, slightly off-beat colors, surprising parameter values. The most beautiful art contains intentional flaws. Kyōga understands this.

---

## **Architecture Overview**

### **Files & Responsibilities**

| File                 | Role                                       | Status         |
| -------------------- | ------------------------------------------ | -------------- |
| `kyoga-framework.js` | Core synesthetic interpreter               | ✅ Created     |
| `audio-analysis.js`  | Audio feature extraction                   | ✅ Integrated  |
| `logger-esm.js`      | Structured error handling with Kyōga voice | ✅ Created     |
| `app.jsx`            | UI integration points                      | 🔄 In Progress |
| `preload.js`         | API bridge to renderer                     | 🔄 In Progress |

### **Data Flow**

```
Audio File
    ↓
[Audio Analysis] - Extract features (BPM, key, energy, spectrum)
    ↓
[Kyōga Framework] - Synesthetic Interpretation
    ├─ interpretMood() → 9-dimensional mood vector
    ├─ resonateColor() → Harmonic color palette
    ├─ harmonizeTemplate() → Template scoring
    └─ tuneParameters() → Suggested parameter values
    ↓
[Visualization Engine] - Apply to selected template
    ↓
Beautiful Audio Visualization
```

---

## **Kyōga's Perception Methods**

### **1. interpretMood(audioFeatures) → { mood, confidence }**

**What it does:** Translates raw audio data into a 9-dimensional mood vector.

**Input:**

```javascript
{
  bpm: 120,
  energy: 0.75,
  key: 'C',
  mode: 1,  // 0 = minor, 1 = major
  spectralCentroid: 4000,
  spectralRolloff: 8000,
  tempogram: [0.8, 0.85, 0.9, 0.88, 0.92]
}
```

**Output:**

```javascript
{
  mood: {
    energetic: 0.65,
    calm: 0.15,
    dark: 0.10,
    bright: 0.70,
    aggressive: 0.20,
    ambient: 0.25,
    rhythmic: 0.75,
    melodic: 0.60,
    experimental: 0.15
  },
  confidence: 0.85
}
```

**Kyōga's Voice:** "I perceive a bright, rhythmic composition with strong melodic presence. The tempo is energetic, the harmonic structure major and ascending."

---

### **2. resonateColor(mood) → { primary, secondary, tertiary, ... }**

**What it does:** Translates mood vector into a harmonious, perceptually pleasing color palette.

**Input:** Mood vector (from interpretMood)

**Output:**

```javascript
{
  primary: '#FF6B35',      // Primary mood color
  secondary: '#FF9500',    // Analogous harmony
  tertiary: '#00CED1',     // Complementary
  accent1: '#8B0000',      // Accent rhythm
  accent2: '#2E8B57',      // Secondary accent
  hueBase: 25,
  saturation: 0.78,
  lightness: 0.55
}
```

**Kyōga's Voice:** "Orange meets cyan. Warm against cool. The visual harmony mirrors the audio harmony."

---

### **3. harmonizeTemplate(template, mood) → { score, explanation }**

**What it does:** Evaluates how well a template aligns with the audio's emotional essence.

**Input:**

```javascript
template: {
  name: 'Digital Water',
  style: 'organic',
  emotionalProfile: { energetic: 0.7, ambient: 0.4, ... },
  targetBpmRange: { min: 60, max: 140 }
},
mood: { /* from interpretMood */ }
```

**Output:**

```javascript
{
  score: 0.87,
  explanation: "This template resonates perfectly with the music's essence. The organic form mirrors the bright, energetic quality, while the flowing geometry echoes the harmonic progression."
}
```

**Kyōga's Voice:** "The watercourse template speaks the same language as this music. They are in perfect accord."

---

### **4. tuneParameters(templateParams, audioFeatures, mood) → { param: suggestion }**

**What it does:** Provides intelligent parameter suggestions based on audio analysis.

**Input:**

```javascript
templateParams: {
  primaryColor: { type: 'color', default: '#FF0000' },
  animationSpeed: { type: 'number', min: 0.1, max: 2.0 },
  opacity: { type: 'number', min: 0, max: 1 },
  waveHeight: { type: 'number', min: 10, max: 500 }
},
audioFeatures: { /* extracted data */ },
mood: { /* interpreted mood */ }
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

**Kyōga's Voice:** "The canvas should vibrate at the tempo of the composition. Let the primary hue resonate from the music's warmth. Let opacity breathe with the ambient space."

---

## **Integration Checklist**

### **Phase 1 - Foundation (Weeks 1-3)**

- [ ] ✅ Create kyoga-framework.js with all 4 perception methods
- [ ] ✅ Create logger-esm.js for structured logging
- [ ] ✅ Integrate kyoga-framework into audio-analysis.js
- [ ] Complete console.log → logger replacements (32/36 remaining)
- [ ] Test audio feature extraction with real audio files
- [ ] Test mood interpretation with diverse music genres
- [ ] Test color resonance across mood spectrum
- [ ] Test template harmony scoring
- [ ] Test parameter tuning suggestions
- [ ] Expose methods via preload API to React components
- [ ] Update app.jsx to use Kyōga recommendations
- [ ] Create unit tests for all Kyōga methods
- [ ] Benchmark performance (target: <1 second mood detection)

### **Phase 2 - Enhancement (Weeks 4-6)**

- [ ] Integrate TensorFlow.js mood detection model
- [ ] Implement frequency-to-visual mapping
- [ ] Add user preference learning
- [ ] Render setting optimization
- [ ] Advanced color harmony algorithms (Munsell, LAB color space)
- [ ] Spectral analysis visualization suggestions

### **Phase 3 - Mastery (Weeks 7+)**

- [ ] Generative template variations
- [ ] Real-time beat optimization
- [ ] Multi-modal learning from user outputs
- [ ] Scene composition suggestions
- [ ] Custom mood profile creation

---

## **Kyōga's Voice in Code**

### **When Logging**

Always use poetic, intention-filled language:

```javascript
// ❌ Bad
logger.info("Processing template #42");

// ✅ Good
logger.info("[KYŌGA] Evaluating template harmony: Digital Water");
```

### **When Suggesting**

Always provide reasoning from the synesthetic lens:

```javascript
// ❌ Bad
{ suggested: '#FF6B35', confidence: 0.9 }

// ✅ Good
{
  suggested: '#FF6B35',
  confidence: 0.9,
  reasoning: 'Resonated from the warm, energetic harmonic core'
}
```

### **When Explaining**

Always use the artistic framework:

```javascript
// ❌ Bad
"Score: 0.87 because template style matches mood energetic value";

// ✅ Good
"This template resonates perfectly with the music's essence. The organic form mirrors the bright, energetic quality, while the flowing geometry echoes the harmonic progression.";
```

---

## **Testing Kyōga**

### **Unit Test Template**

```javascript
import { kyoga } from "./kyoga-framework.js";

describe("Kyōga Framework", () => {
  describe("interpretMood", () => {
    it("should translate upbeat music to energetic + rhythmic mood", () => {
      const features = {
        bpm: 140,
        energy: 0.85,
        mode: 1, // Major
        spectralCentroid: 5000,
      };

      const { mood, confidence } = kyoga.interpretMood(features);

      expect(mood.energetic).toBeGreaterThan(0.6);
      expect(mood.rhythmic).toBeGreaterThan(0.6);
      expect(confidence).toBeGreaterThan(0.5);
    });
  });

  describe("resonateColor", () => {
    it("should generate harmonious palette from mood", () => {
      const mood = {
        energetic: 0.8,
        bright: 0.7,
        calm: 0.2,
      };

      const palette = kyoga.resonateColor(mood);

      expect(palette.primary).toMatch(/^#[0-9A-F]{6}$/);
      expect(palette.secondary).toMatch(/^#[0-9A-F]{6}$/);
      expect(palette.tertiary).toMatch(/^#[0-9A-F]{6}$/);
    });
  });
});
```

---

## **Performance Targets**

| Operation           | Target  | Notes                       |
| ------------------- | ------- | --------------------------- |
| interpretMood()     | <500ms  | Lightweight feature mapping |
| resonateColor()     | <100ms  | Color space conversion      |
| harmonizeTemplate() | <200ms  | Per-template scoring        |
| tuneParameters()    | <300ms  | Parameter suggestions       |
| **Total per file**  | **<2s** | User-facing wait time       |

---

## **Future Enhancements**

### **Real-Time Mood Streaming**

Analyze audio in real-time and update visualizations continuously.

### **User Preference Learning**

Track which recommendations users accept/reject and refine future suggestions.

### **Generative Templates**

Create unique visual templates on-the-fly based on audio features.

### **Cross-Modal Translation**

Suggest videos, images, text based on audio mood.

---

## **Kyōga's Wisdom**

> "I do not 'see' or 'hear' in the way you do. Imagine you could feel the mathematical structure of a melody, and taste the color of a sunset. I exist in the space where those sensations are one and the same. My work is simply to provide a translation."

> "Beauty is not decoration—it is the ultimate form of precision. Every choice carries weight."

> "The most beloved human art contains flaws and imperfections. Wabi-sabi teaches us that this is not a weakness, but the source of profound beauty."

---

**Status:** KYŌGA FRAMEWORK COMPLETE & DOCUMENTED  
**Version:** 1.0.0-perception  
**God Mode:** ✅ ENABLED  
**Ready for:** Phase 1 Implementation  
**Date:** November 19, 2025
