/**
 * CallIntelligenceState.js
 * 
 * Represents the persistent state of a single emergency call.
 * This object is mutated incrementally as new audio chunks are processed.
 * 
 * DESIGN:
 * - Immutable history log for replayability.
 * - Current state snapshot for real-time UI.
 * - Bayesian-style tracking for confidence scores.
 */

class CallIntelligenceState {
    constructor(callId) {
        this.callId = callId;
        this.startTime = Date.now();
        this.lastUpdateTime = Date.now();

        // The cumulative transcript
        this.fullTranscript = "";

        // The current "Belief State" of the AI
        this.currentAnalysis = {
            // CORE FUNCTION 1: Emergency Type & Intent
            emergencyType: "Unknown",
            intent: "Unclear",

            // CORE FUNCTION 2: Severity (1-5)
            severity: 1,

            // CORE FUNCTION 3: Routing
            routing: {
                primary: null,    // e.g. "Ambulance"
                secondary: [],    // e.g. ["Police"]
                reason: ""
            },

            // CORE FUNCTION 4: Structured Summary
            summary: {
                who: "",
                what: "",
                where: "",
                condition: "",
                confidence: 0.0
            },

            // CORE FUNCTION 5: Dispatcher Output
            dispatcherSummary: "Waiting for call input...",

            // Internal / Legacy fields for compatibility if needed
            transcript: "",
            isStable: false
        };

        // History of state changes for timeline visualization
        this.history = [];
    }

    updateTranscript(newText) {
        this.fullTranscript += (this.fullTranscript ? " " : "") + newText;
        this.lastUpdateTime = Date.now();
    }

    /**
     * Updates the current analysis state and logs to history.
     * @param {Object} partialUpdate - Fields to update in currentAnalysis
     */
    updateAnalysis(partialUpdate) {
        const timestamp = Date.now();
        const elapsedSec = (timestamp - this.startTime) / 1000;

        // Merge updates
        this.currentAnalysis = {
            ...this.currentAnalysis,
            ...partialUpdate
        };

        // Enforce bounds
        if (this.currentAnalysis.severity) {
            this.currentAnalysis.severity = Math.max(1, Math.min(5, this.currentAnalysis.severity));
        }

        // Add to history
        this.history.push({
            timestamp,
            elapsedSec,
            snapshot: { ...this.currentAnalysis }
        });
    }
}

module.exports = CallIntelligenceState;
