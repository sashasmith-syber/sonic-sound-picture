# Phase 3 Developer Quick Reference

## Component Architecture

### App.jsx (Main Container)

```javascript
// State Management
this.state = {
  // ...existing state
  kyogaAnalysis, // Raw audio features
  audioMood, // 9D mood vector
  moodConfidence, // 0-1 confidence score
  colorPalette, // 5 colors
  kyogaRecommendations, // Ranked templates
  kyogaParameterSuggestions, // Parameter recommendations
  kyogaAnalyzing, // Loading state
};

// Core Methods
analyzeAudioWithKyoga(audioFeatures); // Main analysis orchestrator
generateParameterSuggestions(template); // Parameter AI suggestions
renderMoodVisualization(); // 9D mood display
renderColorPalette(); // Color harmony display
renderTemplateRecommendations(); // Top 5 templates
renderParameterSuggestions(); // Parameter recommendations
acceptParameterSuggestion(name, value); // Apply suggestion
getParameterCurrentValue(name); // Helper for current values
```

### Wav.jsx (Audio Input)

```javascript
// Enhanced Method
calcTempo(buffer)
  // Creates audioFeatures object
  // Calls props.onAudioAnalyzed(features)

// Props
onAudioAnalyzed: function  // Callback to parent analyzeAudioWithKyoga()
```

## API Call Patterns

### Pattern 1: Interpret Mood

```javascript
const moodResult = await window.myAPI.interpretMood(audioFeatures);
// Returns: { mood: {energy: 0.7, valence: 0.6, ...}, confidence: 0.87 }
```

### Pattern 2: Generate Colors

```javascript
const palette = await window.myAPI.resonateColor(moodResult.mood);
// Returns: { primary: '#FF6B35', secondary: '#004E89', ... }
```

### Pattern 3: Score Templates

```javascript
const harmony = await window.myAPI.harmonizeTemplate(template, mood);
// Returns: { score: 0.84, explanation: 'Good match for...' }
```

### Pattern 4: Get Parameter Suggestions

```javascript
const suggestions = await window.myAPI.tuneParameters(
  configParms, // Current parameter array
  audioFeatures, // Audio analysis object
  mood // 9D mood vector
);
// Returns: {
//   paramName: { suggested: value, confidence: 0.91, reasoning: '...' },
//   ...
// }
```

## State Update Sequence

```javascript
// 1. Audio Load → BPM Detection
setBPM(bpm)                           // Lines ~159
this.setState({ bpm })

// 2. Audio Features Extracted → Analysis Triggered
onAudioAnalyzed callback
analyzeAudioWithKyoga(audioFeatures)  // Lines ~184

// 3. Kyōga APIs Called Sequentially
await window.myAPI.interpretMood()
await window.myAPI.resonateColor()
await window.myAPI.harmonizeTemplate() × N

// 4. State Updated with Results
this.setState({
  kyogaAnalysis,
  audioMood,
  moodConfidence,
  colorPalette,
  kyogaRecommendations
})

// 5. Template Selected → Parameter Suggestions
onSelectTemplate(template)            // Lines ~301
generateParameterSuggestions()        // Lines ~332

// 6. Parameters Applied
acceptParameterSuggestion()           // Lines ~448
this.setState({ customUserTemplateConfiguration })
```

## Logging Convention

All Kyōga operations use standardized logging:

```javascript
logger.info("[KYŌGA] Operation name", { module: "FileName.jsx", key: value });
logger.warn("[KYŌGA] Warning message", { module: "FileName.jsx" });
logger.error("[KYŌGA] Error occurred", { module: "FileName.jsx", error: msg });
```

Example output:

```
[KYŌGA] Extracted audio features, triggering analysis
[KYŌGA] Starting synesthetic audio analysis
[KYŌGA] Mood interpretation complete (confidence: 87%)
[KYŌGA] Color palette generated (primary: #FF6B35)
[KYŌGA] Template harmonization complete (23 templates, top score: 0.84)
[KYŌGA] Audio analysis complete and UI updated
[KYŌGA] Generating parameter suggestions for template
[KYŌGA] Parameter suggestions generated successfully (8 suggestions)
[KYŌGA] Applied parameter suggestion
```

## UI Rendering Hierarchy

```
renderTemplateConfiguration()
├── renderMoodVisualization()
│   ├── 9 progress bars (0-100%)
│   └── Confidence percentage
├── renderColorPalette()
│   ├── 5 color swatches
│   └── HEX codes
├── renderTemplateRecommendations()
│   ├── Table with top 5 templates
│   ├── Rank numbers
│   ├── Template names & authors
│   ├── Harmony scores as progress bars
│   └── Explanations
├── [Template Configuration Form]
│   └── renderTemplateConfigurations()
│       └── ConfigItem components
└── renderParameterSuggestions()
    ├── Table with top 10 suggestions
    ├── Parameter names
    ├── Current values
    ├── Suggested values
    ├── Confidence badges
    ├── Reasoning text
    └── Apply buttons
```

## Error Handling Strategy

```javascript
try {
  const result = await window.myAPI.someMethod(params);
  this.setState({ result });
} catch (error) {
  logger.error("[KYŌGA] Operation failed", {
    module: "App.jsx",
    error: error.message,
  });
  // Continue gracefully - don't break UI
}
```

All rendering methods check for null:

```javascript
if (!this.state.audioMood) {
  return null; // Don't render section
}
```

## Testing Checklist

### Unit Tests Needed

- [ ] analyzeAudioWithKyoga() with valid audio
- [ ] generateParameterSuggestions() with template
- [ ] acceptParameterSuggestion() updates state
- [ ] getParameterCurrentValue() returns correct value
- [ ] Render methods return null when state is null

### Integration Tests Needed

- [ ] Audio upload → mood analysis → UI update flow
- [ ] Template selection → parameter suggestions flow
- [ ] Parameter suggestion acceptance → state update flow
- [ ] Error handling for failed API calls

### Manual Tests Needed

- [ ] Happy audio (high valence) shows warm colors
- [ ] Sad audio (low valence) shows cool colors
- [ ] Complex audio shows diverse mood dimensions
- [ ] Parameter suggestions match audio mood
- [ ] UI responsive on mobile/tablet
- [ ] All logging appears with [KYŌGA] tags

## Performance Checklist

- [ ] interpretMood() < 200ms
- [ ] resonateColor() < 100ms
- [ ] harmonizeTemplate() < 50ms per template
- [ ] tuneParameters() < 100ms
- [ ] UI renders in < 500ms for 10 templates
- [ ] No memory leaks in state updates
- [ ] No unnecessary re-renders

## Common Issues & Solutions

### Issue: Parameter suggestions show "N/A" for current values

**Solution**: Verify parameter names match between config.parms and suggestions

```javascript
// Config has: { name: 'brightness', value: 65 }
// Suggestion has key: 'brightness'
// Lookup uses: param.name === paramName || param.title === paramName
```

### Issue: Kyōga visualizations don't appear

**Solution**: Check if audioFeatures were extracted

```javascript
if (!this.state.audioMood) {
  logger.warn("[KYŌGA] Skipping - no audio analysis");
  return null; // Render nothing
}
```

### Issue: Parameter suggestions don't update UI

**Solution**: Ensure acceptParameterSuggestion() calls setState()

```javascript
this.setState({ customUserTemplateConfiguration: config });
```

### Issue: Logging shows undefined module name

**Solution**: Always pass `{ module: 'FileName.jsx' }` to logger

```javascript
logger.info("[KYŌGA] Message", { module: "App.jsx" });
```

## Key Files Reference

| File    | Lines   | Purpose                        |
| ------- | ------- | ------------------------------ |
| app.jsx | 1-50    | State initialization           |
| app.jsx | 184-230 | analyzeAudioWithKyoga()        |
| app.jsx | 232-258 | generateParameterSuggestions() |
| app.jsx | 275-466 | Render methods                 |
| wav.jsx | 8       | Logger import                  |
| wav.jsx | 142-175 | calcTempo() enhancement        |
| app.jsx | 291     | Wav component instantiation    |
| app.jsx | 876-889 | renderTemplateConfiguration()  |

## Next Phase (Phase 4)

### Jest Test Suite

- Unit tests for all methods
- Mock Kyōga API calls
- Test state management
- Test render methods
- Test error handling

Expected files:

- `__tests__/app.test.jsx`
- `__tests__/kyoga-integration.test.js`
- Mock implementations for window.myAPI

---

## Quick Copy-Paste Examples

### Add new parameter suggestion

```javascript
// In renderParameterSuggestions()
<tr key={paramName}>
  <td>
    <strong>{paramName}</strong>
  </td>
  <td>{this.getParameterCurrentValue(paramName)}</td>
  <td>
    <strong>{suggestion.suggested}</strong>
  </td>
  <td>
    <span
      className={`badge ${
        suggestion.confidence > 0.7 ? "bg-success" : "bg-warning"
      }`}
    >
      {(suggestion.confidence * 100).toFixed(0)}%
    </span>
  </td>
  <td className="small">{suggestion.reasoning}</td>
  <td>
    <button
      onClick={() =>
        this.acceptParameterSuggestion(paramName, suggestion.suggested)
      }
      className="btn btn-sm btn-outline-success"
    >
      ✓ Apply
    </button>
  </td>
</tr>
```

### Add new mood dimension

```javascript
// In renderMoodVisualization()
const dimensions = [..., 'newDimension'];

dimensions.map((dim) => (
  <div key={dim} className="col-md-3 mb-2">
    <strong>{dim.charAt(0).toUpperCase() + dim.slice(1)}</strong>
    <div className="progress">
      <div
        className="progress-bar"
        style={{ width: ((mood[dim] || 0) * 100) + '%' }}
      >
        {((mood[dim] || 0) * 100).toFixed(0)}%
      </div>
    </div>
  </div>
))
```

---

**Phase 3 Completion Date**: [Current Date]  
**Total Implementation Time**: ~4-5 hours  
**Lines of Code Added**: ~360  
**Files Modified**: 2
