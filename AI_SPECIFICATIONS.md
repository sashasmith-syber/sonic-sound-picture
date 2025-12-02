# 🤖 SONIC SOUND PICTURE - AI ENTITY SPECIFICATIONS & TECHNICAL REQUIREMENTS

**Version:** 1.0  
**Date:** November 19, 2025  
**Purpose:** Define AI capabilities required for intelligent audio-to-visual synthesis in SSP

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Core AI Capabilities](#core-ai-capabilities)
3. [Technical Architecture](#technical-architecture)
4. [Integration Points](#integration-points)
5. [Data Pipelines](#data-pipelines)
6. [Output Specifications](#output-specifications)
7. [Performance Requirements](#performance-requirements)
8. [Quality Metrics](#quality-metrics)

---

## 🎯 EXECUTIVE SUMMARY

The AI Entity must serve as an **"Artistic AI Co-Creator"** that intelligently bridges audio characteristics to visual template selection and customization. It combines:

- **Technical Audio Analysis** (BPM, frequency, energy, dynamics)
- **Artistic Intelligence** (mood, style, mood→visual mapping)
- **Template Optimization** (parameter auto-configuration)
- **Creative Suggestions** (color palettes, effects, compositions)

**Primary Goal:** Reduce user decision complexity from 1000s of possibilities to 5-10 curated recommendations

---

## 🧠 CORE AI CAPABILITIES

### **TIER 1: ESSENTIAL (Must Have)**

#### **1.1 Audio Feature Extraction**

**Input:** WAV/MP3 audio file  
**Output:** Structured audio metadata

**Required Features:**

| Feature                    | Method                  | Precision        | Usage                    |
| -------------------------- | ----------------------- | ---------------- | ------------------------ |
| **Tempo/BPM**              | Music-tempo library     | ±2 BPM           | Template sync            |
| **Key Detection**          | Chroma-based analysis   | ±1 semitone      | Color harmony            |
| **Energy Profile**         | RMS + Spectral centroid | Continuous 0-1   | Animation intensity      |
| **Frequency Distribution** | FFT analysis            | 16-band spectrum | Visual frequency mapping |
| **Dynamic Range**          | Peak-to-RMS ratio       | dB scale         | Contrast & punch         |
| **Onset Detection**        | Spectral flux           | Frame-level      | Beat synchronization     |
| **Duration**               | File metadata           | Seconds          | Frame count calculation  |

**Technical Stack:**

```javascript
- music-tempo (already integrated)
- essentia.js (partially integrated, expand)
- web-audio-api (AudioContext)
- fft.js (Fast Fourier Transform)
```

**API Signature:**

```javascript
const audioFeatures = await AudioAnalyzer.extractFeatures(filePath);
// Returns: { bpm, key, energy, spectrum[], onset[], duration, rms, peakFreq }
```

---

#### **1.2 Mood & Style Detection**

**Input:** Audio features + file metadata  
**Output:** Mood classification & style tags

**Mood Classification (9 categories):**

```javascript
{
  energetic: 0.0-1.0,      // High tempo, loud, rhythmic
  calm: 0.0-1.0,           // Low tempo, soft, smooth
  dark: 0.0-1.0,           // Minor key, low frequency focus
  bright: 0.0-1.0,         // Major key, high frequency focus
  aggressive: 0.0-1.0,     // Harsh, dissonant, high dynamic range
  ambient: 0.0-1.0,        // Sparse, atmospheric, low change
  rhythmic: 0.0-1.0,       // Strong beat, high onset count
  melodic: 0.0-1.0,        // Rich harmonic content
  experimental: 0.0-1.0    // Unusual characteristics
}
```

**Technical Implementation:**

**Option A (Recommended - Local):**

```javascript
// Pre-trained TensorFlow.js model
- Model: Music Mood Classifier (lightweight, ~5MB)
- Input: Mel-spectrogram (128 bins × 87 frames)
- Output: 9-class probability distribution
- Inference time: <500ms
```

**Option B (Fallback - Rule-based):**

```javascript
if (bpm > 120 && energy > 0.7) mood.energetic = HIGH;
if (bpm < 80 && energy < 0.4) mood.calm = HIGH;
if (key in minorKeys) mood.dark += 0.3;
// ... etc
```

**API Signature:**

```javascript
const moodProfile = await MoodDetector.analyze(audioFeatures);
// Returns: { energetic, calm, dark, bright, ... confidence: 0.85 }
```

---

#### **1.3 Template Recommendation Engine**

**Input:** Audio features + mood profile + available templates  
**Output:** Ranked list of templates with scores

**Recommendation Scoring Formula:**

```javascript
Score = (
  0.25 * templateMoodMatch(template, mood) +
  0.20 * templateBPMMatch(template, bpm) +
  0.20 * templateStyleMatch(template, style) +
  0.15 * templatePopularity(template) +
  0.10 * templateUserHistory(template, user) +
  0.10 * templateDiversity(template, previousChoices)
) × confidenceFactor
```

**Template Metadata Required:**

Each template needs optional metadata in `template.json`:

```json
{
  "aiMetadata": {
    "suggestedMood": ["energetic", "rhythmic"],
    "bpmRange": [90, 160],
    "keyCompatibility": ["all", "major"],
    "visualStyle": ["abstract", "geometric"],
    "intensity": 0.8,
    "complexity": 0.6,
    "tags": ["electronic", "dance", "futuristic"]
  }
}
```

**API Signature:**

```javascript
const recommendations = await TemplateRecommender.rank(
  audioFeatures,
  moodProfile,
  availableTemplates,
  userContext
);
// Returns: [
//   { template, score: 0.94, reasons: [...] },
//   { template, score: 0.91, reasons: [...] },
//   ...top 5
// ]
```

---

#### **1.4 Intelligent Parameter Auto-Configuration**

**Input:** Selected template + audio features + mood  
**Output:** Suggested template parameters (text, colors, files)

**Parameter Types (from template schema):**

| Type      | AI Capability                  | Example                     |
| --------- | ------------------------------ | --------------------------- |
| **text**  | Generate/suggest from metadata | "Band Name" ← from MP3 tags |
| **color** | Harmony-based generation       | Color palette from mood     |
| **file**  | Image/logo suggestions         | User's brand assets         |

**Color Harmony Engine:**

```javascript
PrimaryColor = MoodToColor(mood) // Mood → Base color
SecondaryColor = ComplementaryColor(Primary)
TertiaryColor = AnalogousColor(Primary)

// Mood → Color Mapping
{
  energetic: "#FF4500",   // Orange-red
  calm: "#87CEEB",        // Sky blue
  dark: "#1a1a2e",        // Deep navy
  bright: "#FFD700",      // Gold
  aggressive: "#8B0000",  // Dark red
  ambient: "#B0C4DE",     // Light blue
  rhythmic: "#FF1493",    // Deep pink
  melodic: "#9370DB",     // Medium purple
  experimental: "#00CED1" // Dark turquoise
}
```

**Text Generation Strategy:**

```javascript
// Extract from audio metadata
artist = mp3Tags.artist || "Unknown Artist";
title = mp3Tags.title || extractFromFilename(path);

// Generate suggestions if missing
if (!artist) {
  // Mood-based suggestion: "Neon Pulse", "Whisper", etc.
  artist = generateArtisticName(mood, bpm);
}
```

**API Signature:**

```javascript
const suggestions = await ParameterSuggester.generate(
  template,
  audioFeatures,
  moodProfile,
  userProfile
);
// Returns: {
//   "Band Name": "Sonic Dreams",
//   "Song Name": "Electric Horizons",
//   "Background Color": "#1a1a2e",
//   "Foreground Color": "#FF4500"
// }
```

---

### **TIER 2: HIGH VALUE (Should Have)**

#### **2.1 Frequency-to-Visual Mapping**

**Capability:** Intelligently map audio frequency spectrum to template visualization

**Frequency Bands (16-band analysis):**

```
20Hz    -    Sub Bass       → Visual: Low-end rumble effects
80Hz    -    Bass            → Visual: Main beat synchronization
200Hz   -    Low Mids       → Visual: Bass frequency response
500Hz   -    Mids            → Visual: Mid-range dynamics
2kHz    -    Upper Mids     → Visual: Vocal presence
4kHz    -    Presence       → Visual: Detail/crispness
8kHz    -    Brilliance     → Visual: High-end sparkle
16kHz   -    Air            → Visual: Air/reverb effects
```

**Implementation:**

```javascript
const frequencyMap = {
  0-4: "deepBassPulse",      // Sub-bass visualization
  4-8: "midBassKick",         // Bass drum sync
  8-10: "midRangeWave",       // Vocal/melody
  10-14: "upperRangeShimmer", // Brightness
  14-16: "ultraHighSpark"     // Air/space
}

// Apply to template parameters
visualEffectIntensity = frequencyEnergy[band] * 0.8
```

---

#### **2.2 Adaptive Rendering Optimization**

**Capability:** Suggest render parameters based on content

**Analysis:**

```javascript
if (high_dynamic_range && energetic) {
  suggest: {
    fps: 60,              // Smooth for fast motion
    transparent: false,   // Opaque for high contrast
    effects: "enabled"    // Full effects
  }
} else if (ambient && calm) {
  suggest: {
    fps: 24,              // Cinematic, lower processing
    transparent: true,    // Ethereal look
    effects: "selective"  // Subtle effects
  }
}
```

---

#### **2.3 User Preference Learning**

**Capability:** Improve recommendations based on user history

**Tracking Metrics:**

- Template selections per mood
- Customization patterns
- Rendering preferences
- Output satisfaction (implicit)

**Implementation:**

```javascript
userPreferences = {
  favoriteMoods: { energetic: 0.8, calm: 0.3 },
  templatePreferences: { "simple-player": 0.9, "planet-9": 0.7 },
  customizationStyle: "bold" | "subtle" | "balanced",
};

// Adjust recommendation weights
Score *= 1 + userPreferences.templatePreferences[template.name];
```

---

#### **2.4 Visual Style Transfer Suggestions**

**Capability:** Suggest visual style variants based on audio

**Style Categories:**

```javascript
styles = {
  abstract: "Geometric, minimal forms",
  organic: "Flowing, natural shapes",
  digital: "Grid-based, tech aesthetic",
  painterly: "Brush-like, artistic",
  minimalist: "Extreme simplification",
  maximalist: "Rich, complex details",
};

// Map mood + template → style recommendation
if (mood.experimental && mood.energetic) {
  suggestStyle: "digital" | "abstract";
}
```

---

### **TIER 3: NICE TO HAVE (Could Have)**

#### **3.1 Real-time Beat Synchronization Optimization**

- Adaptive frame rate based on BPM accuracy
- Beat prediction for smoother visualization
- Dynamic timing adjustment

#### **3.2 Generative Template Variations**

- Create variations of selected template
- Parameter remixing
- Style mutation

#### **3.3 Multi-Modal Learning**

- Learn from rendered outputs (feedback loop)
- Computer vision analysis of result quality
- Iterative improvement

#### **3.4 Contextual Scene Generation**

- Scene transitions based on song structure
- Emotional arc tracking
- Narrative visualization suggestions

---

## 🏗️ TECHNICAL ARCHITECTURE

### **System Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    ELECTRON UI (React)                      │
│  AudioSelector → AIRecommender → TemplateConfigurator      │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│          PRELOAD LAYER (Secure IPC Bridge)                  │
│  myAPI.analyzeAudio(), recommendTemplates(), etc.          │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│            AI PROCESSING LAYER (Node.js)                    │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │ Audio Analyzer  │  │ Mood Detector    │  │ Recommender│ │
│  │ (Essentia.js)   │  │ (TensorFlow.js)  │  │ Engine     │ │
│  └─────────────────┘  └──────────────────┘  └────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Parameter Generator | Style Engine | User Learner     │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│          DATA LAYER (File System & Storage)                 │
│  Audio Files | Templates | User Preferences | Models       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔌 INTEGRATION POINTS

### **1. Preload API Extensions**

**Current (Already Implemented):**

```javascript
myAPI.analyzeAudio(filePath, templates);
myAPI.getAnalyzerStatus();
```

**Required New Methods:**

```javascript
// Phase 1
myAPI.extractAudioFeatures(filePath)
  → { bpm, key, energy, spectrum[], duration, rms }

myAPI.detectMood(audioFeatures)
  → { energetic: 0.8, calm: 0.2, ... confidence: 0.92 }

myAPI.recommendTemplates(audioFeatures, moodProfile, templates)
  → [{ template, score, reasons }]

myAPI.suggestParameters(template, audioFeatures, mood)
  → { "Band Name": "...", "Background Color": "#..." }

myAPI.analyzeFrequencySpectrum(filePath)
  → { freqBands: [], dominantFrequencies: [], spectrum: [] }

// Phase 2
myAPI.generateColorPalette(mood, baseColor)
  → { primary: "#...", secondary: "#...", tertiary: "#..." }

myAPI.suggestRenderSettings(audioFeatures, mood)
  → { fps: 60, transparent: false, effects: "enabled" }

myAPI.learnUserPreference(templateName, moodProfile)
  → void (saves to user profile)

myAPI.suggestStyleVariant(template, audioFeatures)
  → { style: "abstract", description: "..." }
```

---

### **2. React Component Integration Points**

**New Components Needed:**

```jsx
<AIRecommendationPanel
  audioAnalysis={analysis}
  templates={templates}
  onSelect={handleTemplateSelect}
/>

<ParameterAutoFill
  template={selectedTemplate}
  audioFeatures={features}
  mood={moodProfile}
  onUpdate={handleParameterUpdate}
/>

<ColorPaletteGenerator
  mood={moodProfile}
  onColorSelect={handleColorUpdate}
/>

<FrequencyVisualizer
  spectrum={audioFeatures.spectrum}
  selectedFreqBands={template.frequencyMappings}
/>

<AIInsights
  audioAnalysis={analysis}
  moodConfidence={confidence}
  recommendations={recommendations}
/>
```

---

## 📊 DATA PIPELINES

### **Pipeline 1: Analysis → Recommendation**

```
User selects audio file
    ↓
[Audio Extraction] → Raw PCM data
    ↓
[Feature Extraction] → BPM, key, energy, spectrum, onsets
    ↓
[Mood Detection] → 9-dimensional mood vector
    ↓
[Template Scoring] → Score each template against mood + features
    ↓
[Ranking & Filtering] → Top 5 recommendations with reasons
    ↓
Display to user with confidence scores & explanations
```

### **Pipeline 2: Template Selection → Configuration**

```
User selects template from recommendations
    ↓
[Extract Template Structure] → Get all parameters
    ↓
[Analyze Audio Metadata] → Extract artist, title, genre tags
    ↓
[Generate Suggestions] → AI-suggested values for each param
    ↓
[Apply User Preferences] → Filter through learned preferences
    ↓
[Create Palette] → Generate color scheme from mood
    ↓
Display suggested values with auto-fill options
```

### **Pipeline 3: Content Analysis**

```
Audio file → [Frequency Analysis]
              ↓
              [Generate 16-band spectrum analysis]
              ↓
              [Map to template visualization zones]
              ↓
              [Suggest frequency-locked effects]
```

---

## 📤 OUTPUT SPECIFICATIONS

### **Output 1: Audio Feature Object**

```javascript
{
  // Timing
  duration: 243.5,                    // seconds
  bpm: 128,                           // beats per minute
  confidence_bpm: 0.92,               // 0-1 confidence

  // Harmonic
  key: "C",                           // musical key
  mode: "major",                      // major | minor
  confidence_key: 0.78,               // 0-1 confidence

  // Energy & Dynamics
  energy: 0.73,                       // 0-1 (0=silent, 1=very loud)
  rms: -12.5,                         // dB
  peak: -2.3,                         // dB
  dynamic_range: 10.2,                // dB
  onset_count: 156,                   // total beat onsets detected

  // Frequency
  spectrum: [0.1, 0.15, 0.08, ...],  // 16-band frequency distribution (0-1 each)
  dominant_frequency: 440,            // Hz
  spectral_centroid: 2800,           // Hz (brightness indicator)
  spectral_rolloff: 8000,            // Hz

  // Temporal
  onset_strength: [0, 0.1, 0.8, ...], // Array of onset magnitudes per frame
  tempogram: [0.2, 0.5, 0.3, ...],   // Tempo stability over time

  // Metadata
  analyzed_at: "2025-11-19T10:30:00Z",
  version: "1.0",
  quality_score: 0.89                 // Overall analysis quality
}
```

---

### **Output 2: Mood Profile Object**

```javascript
{
  // Core Dimensions (all 0-1)
  energetic: 0.82,        // High tempo, loud, dynamic
  calm: 0.18,             // Relaxed, peaceful
  dark: 0.45,             // Minor key, low frequencies, somber
  bright: 0.55,           // Major key, high frequencies, cheerful
  aggressive: 0.38,       // Harsh, intense, powerful
  ambient: 0.22,          // Atmospheric, sparse
  rhythmic: 0.91,         // Strong beat, percussive
  melodic: 0.65,          // Rich harmonies, tuneful
  experimental: 0.28,     // Unusual, avant-garde

  // Metadata
  confidence: 0.87,       // Overall classification confidence
  primary_mood: "energetic",
  secondary_mood: "rhythmic",
  suggested_style: "digital",
  analysis_method: "ml_model_v1",
  model_confidence: 0.87,
  processed_at: "2025-11-19T10:30:00Z"
}
```

---

### **Output 3: Template Recommendation Object**

```javascript
[
  {
    template: {
      name: "simple-player",
      key: "simple-player",
      image: "...",
      config: {...}
    },
    score: 0.94,
    confidence: 0.87,
    reasons: [
      "Matches energetic mood (0.82)",
      "Perfect for 128 BPM sync",
      "You selected similar templates 5 times",
      "Highly rated for rhythmic content"
    ],
    frequency_match: 0.89,
    mood_match: 0.94,
    user_preference_boost: 0.92,
    popularity_score: 0.78,
    diversity_score: 0.85,
    estimated_render_time: "8 minutes"
  },
  // ... more recommendations
]
```

---

### **Output 4: Parameter Suggestions Object**

```javascript
{
  "Band Name": {
    suggested: "Sonic Dreams",
    confidence: 0.72,
    source: "mood-based-generation",
    alternatives: ["Electric Pulse", "Neon Horizons"]
  },
  "Song Name": {
    suggested: "Digital Aurora",
    confidence: 0.68,
    source: "metadata-extraction",
    alternatives: ["Rhythmic Journey", "Energetic Echo"]
  },
  "Background Color": {
    suggested: "#1a1a2e",
    confidence: 0.85,
    reasoning: "Deep navy from energetic + dark mood combination",
    source: "mood-color-mapping",
    palette: {
      primary: "#1a1a2e",
      secondary: "#FF4500",
      tertiary: "#FFD700"
    }
  },
  "Foreground Color": {
    suggested: "#FF4500",
    confidence: 0.88,
    reasoning: "Energetic orange-red for visual pop",
    source: "color-harmony-engine"
  }
}
```

---

## ⚡ PERFORMANCE REQUIREMENTS

### **Speed Targets**

| Operation            | Target Time | Acceptable Range |
| -------------------- | ----------- | ---------------- |
| Feature Extraction   | 2-3 sec     | 1-5 sec          |
| Mood Detection       | 1-2 sec     | 0.5-3 sec        |
| Template Ranking     | 0.5-1 sec   | 0.2-2 sec        |
| Parameter Generation | 0.5 sec     | 0.2-1 sec        |
| Color Palette Gen    | 0.1 sec     | 0.05-0.5 sec     |
| **Total User Wait**  | **4-7 sec** | **Max 10 sec**   |

### **Memory Usage**

- Audio buffer: ≤200MB (for 10min audio)
- ML models cached: ≤50MB
- Processing overhead: ≤100MB
- **Total: ≤350MB peak**

### **Scalability**

- Support 10,000+ templates
- Process audio up to 60 minutes
- Handle offline mode (no network)
- Background processing (no UI freeze)

---

## 📈 QUALITY METRICS

### **Recommendation Quality**

```javascript
Metrics = {
  // Accuracy
  precision: 0.85, // % of recommendations user finds useful
  recall: 0.9, // % of good templates in top 5
  mrr: 0.88, // Mean Reciprocal Rank (avg position of good result)

  // Relevance
  mood_match_accuracy: 0.89,
  style_consistency: 0.87,
  user_satisfaction: 0.84,

  // Diversity
  template_variety_score: 0.75, // Top 5 aren't too similar
  style_diversity: 0.82,

  // Performance
  average_ranking_time: 0.8, // seconds
  first_result_latency: 2.1, // seconds
  ui_responsiveness: 0.98, // 98% non-blocking
};
```

### **Audio Analysis Accuracy**

```javascript
{
  // Against ground truth (manual annotation)
  bpm_mae: 1.2,                  // Mean Absolute Error in BPM
  key_accuracy: 0.92,            // Correct key detection %
  mood_classification: 0.85,     // Correct primary mood %

  // Frequency analysis
  spectrum_correlation: 0.94,    // Alignment with ground truth spectrum
  dominant_frequency_error: 8,   // Hz error margin

  // Overall
  feature_extraction_reliability: 0.91
}
```

---

## 🎨 ARTISTIC GUIDELINES FOR AI ENTITY

The AI must embody:

1. **Intuitive Understanding**: Understand audio's emotional essence, not just numbers
2. **Creative Curation**: Suggest surprising-but-fitting combinations
3. **Respect for Intent**: Never override user preference with "optimization"
4. **Artistic Literacy**: Understand design principles, color theory, composition
5. **Cultural Awareness**: Recognize different music genres and aesthetic traditions
6. **Explainability**: Always explain WHY a recommendation was made
7. **Continuous Learning**: Improve from user feedback and preferences

---

## 🚀 IMPLEMENTATION ROADMAP

### **Phase 1 (Weeks 1-3): Foundation**

- ✅ Audio feature extraction (music-tempo + essentia.js)
- ✅ Basic mood detection (rule-based + ML model)
- ✅ Template recommendation engine
- ✅ Parameter suggestion system

### **Phase 2 (Weeks 4-6): Enhancement**

- [ ] Color palette generation
- [ ] Frequency-to-visual mapping
- [ ] Render setting optimization
- [ ] User preference learning

### **Phase 3 (Weeks 7+): Advanced**

- [ ] Generative template variations
- [ ] Scene composition suggestions
- [ ] Multi-modal learning
- [ ] Real-time optimization

---

## 📝 SUMMARY: REQUIRED AI CAPABILITIES

**Minimum Viable AI Entity Must Have:**

1. ✅ **Audio Feature Extraction** - BPM, key, energy, frequency spectrum
2. ✅ **Mood Classification** - 9-dimensional mood detection
3. ✅ **Template Recommendation** - Intelligent ranking algorithm
4. ✅ **Parameter Auto-Fill** - Suggest text, colors, files
5. ✅ **Color Harmony Engine** - Mood → color mapping

**Should Have (High Value):**

6. **Frequency Mapping** - Link spectrum to visual zones
7. **Render Optimization** - Suggest settings per content
8. **User Learning** - Improve from preferences
9. **Style Suggestions** - Visual aesthetics per mood

**Nice to Have:**

10. **Real-time Sync** - Beat prediction & optimization
11. **Generative Variants** - Template variations
12. **Scene Generation** - Narrative visualization

---

## 🎯 SUCCESS CRITERIA

- ✅ User satisfaction: >85% (recommendations feel "right")
- ✅ Time saved: >60% reduction in manual configuration
- ✅ Processing speed: <10 seconds for full analysis
- ✅ Model accuracy: >85% for mood detection
- ✅ Explainability: Every recommendation has clear reasoning
- ✅ Offline capability: Works without internet
- ✅ Artistic quality: Recommendations feel creative, not robotic

---

**Ready to build your Artistic AI Entity! 🚀🎨🤖**
