/**
 * AugmentationEngine.js
 * 
 * PHase 7: Intelligence Augmentation Layer
 * 
 * This engine subscribes to the existing Call Intelligence State
 * and enriches it with detailed probabilistic analysis.
 * 
 * Capabilities:
 * - Emotion & Stress Analysis
 * - Fake / Prank Detection
 * - Multi-language Detection
 * - Smart Location Extraction
 * - Dynamic Follow-up Questions
 */

class AugmentationEngine {

    static process(state, recentTranscriptChunk) {
        const fullText = state.fullTranscript.toLowerCase();
        const chunk = recentTranscriptChunk.toLowerCase();
        const analysis = state.currentAnalysis;

        // 1. Emotion & Stress Analysis
        // Logic: Keywords + "Speed" (simulated by chunk length vs time)
        const distressKeywords = ['help', 'please', 'hurry', 'dying', 'pain', 'blood', 'cannot breathe'];
        const aggressionKeywords = ['shut up', 'idiot', 'useless', 'stupid', 'hate'];

        let panicScore = analysis.panicIndex || 0;
        let aggressionScore = analysis.emotionalState?.aggression || 0;

        // Distress check
        const distressMatches = distressKeywords.filter(w => chunk.includes(w)).length;
        panicScore += (distressMatches * 5);
        if (chunk.includes('!')) panicScore += 2; // Punctuation urgency (if available)

        // Aggression check
        const aggressionMatches = aggressionKeywords.filter(w => chunk.includes(w)).length;
        aggressionScore += (aggressionMatches * 10);

        // Decay
        panicScore = Math.min(100, Math.max(0, panicScore * 0.98));
        aggressionScore = Math.min(100, Math.max(0, aggressionScore * 0.95));

        // 2. Fake / Prank Detection
        // Logic: Laughter, inconsistent tone, specific phrases
        const prankKeywords = ['prank', 'joke', 'tiktok', 'youtube', 'haha', 'lol', 'fake'];
        let fakeProb = analysis.fakeCallProb || 0;
        const prankMatches = prankKeywords.filter(w => chunk.includes(w)).length;

        if (prankMatches > 0) {
            fakeProb += 0.15;
        } else {
            fakeProb *= 0.98; // Decay if no evidence
        }
        fakeProb = Math.min(1, Math.max(0, fakeProb));

        // 3. Multi-language Detection (Simulated)
        // Simple keyword check for generic demo purposes
        let detectedLang = 'en';
        if (chunk.includes('ayuda') || chunk.includes('fuego') || chunk.includes('policia') || chunk.includes('gracias')) {
            detectedLang = 'es';
        } else if (chunk.includes('hilfe') || chunk.includes('feuer') || chunk.includes('danke')) {
            detectedLang = 'de';
        }

        // 4. Smart Location Extraction
        // Detects patterns like "at [Location]" or "near [Landmark]"
        const locationCandidates = analysis.locationData?.candidates || [];
        const locationRegex = /(?:at|on|near|in)\s+([0-9]+\s+[a-z]+|[a-z]+\s+(?:st|ave|road|blvd|park|highway))/gi;
        let match;
        while ((match = locationRegex.exec(chunk)) !== null) {
            if (match[1] && !locationCandidates.includes(match[1])) {
                locationCandidates.push(match[1]);
            }
        }

        // 5. AI Follow-up Question Engine
        // Generates questions based on missing high-value information
        const questions = [];

        // Contextual checks
        if (analysis.emergencyTypes.includes('Fire')) {
            if (!fullText.includes('trapped')) questions.push({ query: "Are people trapped inside?", importance: 'High' });
            if (!fullText.includes('floor')) questions.push({ query: "Which floor is the fire on?", importance: 'Med' });
        }
        if (analysis.emergencyTypes.includes('Medical')) {
            if (!fullText.includes('breathing')) questions.push({ query: "Is the patient breathing?", importance: 'Critical' });
            if (!fullText.includes('age')) questions.push({ query: "Approximate age of the patient?", importance: 'Low' });
        }
        if (locationCandidates.length === 0) {
            questions.unshift({ query: "What is your exact location?", importance: 'Critical' });
        }

        // 6. Return Enriched Data
        return {
            emotionalState: {
                panic: Math.round(panicScore),
                aggression: Math.round(aggressionScore),
                distressConfidence: (panicScore > 0) ? Math.min(0.99, panicScore / 100) : 0
            },
            fakeCallRisk: {
                probability: parseFloat(fakeProb.toFixed(2)),
                reasons: prankMatches > 0 ? ['Suspicious keywords detected'] : []
            },
            translation: {
                detectedLang,
                isTranslated: detectedLang !== 'en'
            },
            locationData: {
                candidates: locationCandidates,
                confidence: locationCandidates.length > 0 ? 0.85 : 0
            },
            aiQuestions: questions.slice(0, 3) // Top 3
        };
    }
}

module.exports = AugmentationEngine;
