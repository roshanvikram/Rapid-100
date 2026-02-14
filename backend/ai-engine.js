const ANALYZE_INTERVAL_MS = 3000; // Analyze every 3 seconds

class AIEngine {
  constructor() {
    this.lastAnalysis = null;
    this.history = [];
  }

  analyzeTranscript(transcript) {
    const text = transcript.toLowerCase();
    
    // Default low-risk state
    let state = {
        emergency_types: [],
        severity: 1, // 1-5
        panic_level: 10, // 0-100
        fake_call_probability: 0.1, // 0-1
        confidence_score: 0.8,
        recommended_action: "Monitor Situation",
        explanation: "Changes in tone or keywords not yet detected.",
        timestamp: new Date().toISOString()
    };

    // Keyword detection logic (Mock AI)
    if (text.includes("fire") || text.includes("smoke") || text.includes("burn")) {
        state.emergency_types.push("Fire");
        state.severity = Math.max(state.severity, 4);
        state.panic_level = 80;
        state.recommended_action = "Dispatch Fire Department";
        state.explanation = "Detected keywords related to fire/smoke.";
    }
    
    if (text.includes("heart attack") || text.includes("numb") || text.includes("chest pain") || text.includes("unconscious")) {
        state.emergency_types.push("Medical");
        state.severity = Math.max(state.severity, 5);
        state.panic_level = 90;
        state.recommended_action = "Dispatch Ambulance & EMT";
        state.explanation = "Keywords indicate critical medical emergency.";
    }

    if (text.includes("gun") || text.includes("shot") || text.includes("intruder") || text.includes("fight")) {
        state.emergency_types.push("Police");
        state.severity = Math.max(state.severity, 5);
        state.panic_level = 95;
        state.recommended_action = "Dispatch Police Units";
        state.explanation = "Threat to life/safety detected.";
    }

    if (text.includes("prank") || text.includes("joke") || text.includes("haha")) {
        state.fake_call_probability = 0.8;
        state.recommended_action = "Verify Caller Verify Identity";
        state.explanation = "Potential prank call indicators detected.";
    }

    // Temporal Intelligence: Ramp up severity if panic stays high
    if (this.lastAnalysis && this.lastAnalysis.panic_level > 70) {
        state.severity = Math.min(5, state.severity + 0.5); // Escalation
    }

    // Store history
    this.history.push(state);
    this.lastAnalysis = state;

    return state;
  }
}

module.exports = AIEngine;
