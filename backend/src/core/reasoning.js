/**
 * reasoning.js
 * 
 * The "Brain" of RAPID-100.
 * In a real-world scenario, this would call GPT-4o.
 * For this localized version, we use a sophisticated State Machine 
 * with Bayesian-like probability updates based on keyword clusters.
 */

const SafetyLayer = require('./safety');

// Keyword Knowledge Base
const KNOWLEDGE_BASE = {
    FIRE: {
        keywords: ["fire", "smoke", "burn", "flame", "alarm", "smell"],
        baseSeverity: 4.0,
        action: "Dispatch Fire & Rescue",
        questions: ["Are there people trapped inside?", "Do you see open flames?", "Is the smoke black or white?"]
    },
    MEDICAL: {
        keywords: ["blood", "heart", "chest pain", "breathing", "unconscious", "pain", "collapsed"],
        baseSeverity: 4.5,
        action: "Dispatch EMS / Ambulance",
        questions: ["Is the patient conscious?", "Are they breathing?", "Do you know CPR?"]
    },
    POLICE: {
        keywords: ["gun", "shot", "fight", "intruder", "knife", "scared", "robbery", "attack"],
        baseSeverity: 5.0,
        action: "Dispatch Police Units",
        questions: ["Are you in a safe location?", "Is the attacker still present?", "Do you have a description?"]
    },
    DISTRESS: {
        keywords: ["help", "please", "hurry", "die", "dead", "emergency"],
        impact: 0.5 // Adds to severity
    }
};

class ReasoningEngine {
    /**
     * Analyzes a new transcript chunk and updates the call state.
     * @param {CallIntelligenceState} callState 
     * @param {string} newChunk 
     */
    static process(callState, newChunk) {
        callState.updateTranscript(newChunk);

        const text = callState.fullTranscript.toLowerCase();
        const current = callState.currentAnalysis;

        // 1. Detect Emergency Types (Accumulative)
        let detectedTypes = new Set(current.emergencyTypes);
        let maxBaseSeverity = 1.0;
        let matchedCategory = null;

        Object.entries(KNOWLEDGE_BASE).forEach(([type, data]) => {
            if (type === 'DISTRESS') return; // Modifier only

            const matchCount = data.keywords.filter(w => text.includes(w)).length;
            if (matchCount > 0) {
                detectedTypes.add(type);
                if (data.baseSeverity > maxBaseSeverity) {
                    maxBaseSeverity = data.baseSeverity;
                    matchedCategory = type;
                }
            }
        });

        // 2. Calculate Bayesian Severity Update
        // Logic: Previous Severity + (New Evidence * Weight)
        // We simulate "Confidence" growth as transcript length increases

        let newSeverity = Math.max(current.severityScore, maxBaseSeverity);

        // Modifiers
        const distressCount = KNOWLEDGE_BASE.DISTRESS.keywords.filter(w => text.includes(w)).length;
        newSeverity += (distressCount * 0.2);

        // Panic Index Logic (Length + Keywords)
        // Faster speech (more words in short time) usually implies panic. 
        // Here we just use keyword density for simulation.
        let newPanic = 30 + (distressCount * 10) + (newSeverity * 10);

        // 3. Fake Call Probability
        // Logic: Laughter or specific words increase it.
        if (text.includes("prank") || text.includes("joke") || text.includes("haha")) {
            current.fakeCallProb += 0.2;
        } else {
            // Decay fake prob over time if no "fake" indicators found
            current.fakeCallProb *= 0.95;
        }

        // 4. Determine Action & Reasoning
        let action = "Monitor Situation";
        let reasoning = "Monitoring audio stream for specific threats...";
        let nextQuestion = "Where are you located?";

        if (matchedCategory) {
            action = KNOWLEDGE_BASE[matchedCategory].action;
            reasoning = `Detected indicators of ${matchedCategory} (${Array.from(detectedTypes).join(", ")}). Distress level indicates ${Math.round(newSeverity)}/5 severity.`;

            // Pick a question based on context (simple rotation or random for now)
            const questionList = KNOWLEDGE_BASE[matchedCategory].questions;
            nextQuestion = questionList[Math.floor(Date.now() / 5000) % questionList.length];
        }

        // 5. Apply Updates
        callState.updateAnalysis({
            emergencyTypes: Array.from(detectedTypes),
            severityScore: newSeverity,
            panicIndex: newPanic,
            confidence: Math.min(0.95, 0.2 + (text.length / 200)), // Confidence grows with data
            recommendedAction: action,
            reasoningTrace: reasoning,
            primaryThreat: matchedCategory,
            nextBestQuestion: nextQuestion,
            safetyOverrideActive: false // Reset for check
        });

        // 6. Run Safety Layer (The "Guardian" Module)
        // This overrides the AI's logic if ethical boundaries are crossed.
        const safetyResult = SafetyLayer.applyOverrides(callState.currentAnalysis, text);
        if (safetyResult.overrideApplied) {
            callState.updateAnalysis({
                ...safetyResult.state
            });
        }

        return callState.currentAnalysis;
    }
}

module.exports = ReasoningEngine;
