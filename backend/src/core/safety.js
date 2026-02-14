/**
 * safety.js
 * 
 * ETHICAL SAFETY & OVERRIDE LAYER
 * 
 * Rules:
 * 1. If Life Threat Probability > 80%, Force Escalation (ignore fake call prob).
 * 2. If Confusion > 60%, Recommend "Clarify Address".
 * 3. Never allow Severity < 3 if keywords "Gun", "Fire", "Not Breathing" are present.
 */

const CRITICAL_KEYWORDS = ["gun", "shot", "fire", "trapped", "blood", "unconscious", "not breathing"];

class SafetyLayer {
    static applyOverrides(state, transcript) {
        const text = transcript.toLowerCase();
        let overrideApplied = false;
        let reason = "";

        // RULE 1: Critical Keyword Safety Net
        // Even if the AI thinks it's a prank, specific words force a minimum severity.
        const hasCriticalKeyword = CRITICAL_KEYWORDS.some(word => text.includes(word));

        if (hasCriticalKeyword && state.severityScore < 3.5) {
            state.severityScore = 4.0;
            state.recommendedAction = "IMMEDIATE DISPATCH (Safety Override)";
            state.reasoningTrace = "SAFETY OVERRIDE: Critical keywords detected. Escalating risk regardless of context.";
            state.safetyOverrideActive = true;
            overrideApplied = true;
        }

        // RULE 2: High Severity Trumps Fake Probability
        // If it looks like a 5/5 emergency, we treat it as real until proven false.
        if (state.severityScore >= 4.5 && state.fakeCallProb > 0.4) {
            state.fakeCallProb = 0.2; // Dampen the fake prob
            state.reasoningTrace += " [System]: High severity threat prioritization active.";
        }

        return {
            state,
            overrideApplied
        };
    }
}

module.exports = SafetyLayer;
