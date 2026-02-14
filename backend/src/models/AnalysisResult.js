const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
    transcript: {
        type: String,
        required: true,
    },
    emergencyType: String,
    intent: String,
    severity: Number,
    panic_level: Number,
    confidence_score: Number,
    fake_call_probability: Number,
    recommended_action: String,
    explanation: String,
    routing: {
        primary: String,
        secondary: [String],
        reason: String,
    },
    summary: {
        who: String,
        what: String,
        where: String,
        condition: String,
        confidence: Number,
    },
    dispatcherSummary: String,
    model: String,
    detectedLanguage: String,
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);
