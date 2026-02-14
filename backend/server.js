const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
require('dotenv').config();

const socketHandler = require('./src/events/socketHandler');
const connectDB = require('./src/config/db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Initialize Socket Layer
// Initialize Socket Layer
// Initialize Socket Layer
socketHandler(io);

// Connect to MongoDB
connectDB();

// File Upload Middleware
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const LLMService = require('./src/services/LLMService');
const CallIntelligenceState = require('./src/models/CallState');
const ReasoningEngine = require('./src/core/reasoning');
const AugmentationEngine = require('./src/ai/augmentationEngine/AugmentationEngine');
const AnalysisResult = require('./src/models/AnalysisResult');

// Helper: Extract caller identity from transcript (multilingual Indian support)
function extractCallerIdentity(transcript) {
    const text = (transcript || "").toLowerCase();

    // Name patterns - English + Indian languages (Whisper transcribes Indian languages in their script or romanized)
    const namePatterns = [
        // English
        /my name is ([a-z]+)/i,
        /this is ([a-z]+)/i,
        /i'?m ([a-z]+)/i,
        /i am ([a-z]+)/i,
        /name'?s ([a-z]+)/i,
        /call me ([a-z]+)/i,
        // Tamil (romanized)
        /en[nu]? peyar ([a-z]+)/i,        // என் பெயர் (en peyar)
        /enaku ([a-z]+)/i,
        // Hindi (romanized)
        /mera naam ([a-z]+)/i,             // मेरा नाम
        /mera name ([a-z]+)/i,
        /main ([a-z]+) bol raha/i,         // मैं ___ बोल रहा
        /main ([a-z]+) bol rahi/i,
        // Telugu (romanized)
        /naa peru ([a-z]+)/i,              // నా పేరు
        /na peru ([a-z]+)/i,
        // Kannada (romanized)
        /nanna hesaru ([a-z]+)/i,          // ನನ್ನ ಹೆಸರು
        // Malayalam (romanized)
        /ente peru ([a-z]+)/i,             // എന്റെ പേര്
        /en[td]e peru ([a-z]+)/i,
        // Bengali (romanized)
        /amar naam ([a-z]+)/i,             // আমার নাম
        // Marathi (romanized)
        /majhe naav ([a-z]+)/i,            // माझे नाव
        // Gujarati (romanized)
        /maru naam ([a-z]+)/i,             // મારું નામ
        // Punjabi (romanized)
        /mera naa[mn] ([a-z]+)/i,          // ਮੇਰਾ ਨਾਮ
    ];

    for (const pattern of namePatterns) {
        const match = transcript.match(pattern);
        if (match && match[1]) {
            const word = match[1].toLowerCase();
            const skip = ['calling', 'here', 'at', 'in', 'on', 'the', 'a', 'not', 'so', 'very', 'really', 'just', 'going', 'trying', 'looking', 'having', 'being', 'doing', 'hai', 'hain', 'hu', 'hoon', 'bol', 'baat'];
            if (!skip.includes(word) && word.length > 1) {
                return match[1].charAt(0).toUpperCase() + match[1].slice(1);
            }
        }
    }

    // Gender detection - English + Indian languages
    const femaleClues = [
        // English
        'my husband', 'my boyfriend', 'my son', 'pregnant', 'ma\'am', 'miss', 'mrs', 'mother', 'mom', 'sister', 'daughter', 'girl', 'woman', 'lady',
        // Tamil
        'en kanavar', 'kanavar', 'akka', 'anni', 'amma',
        // Hindi
        'mere pati', 'mera pati', 'bhai', 'beta',
        // Telugu
        'naa bharta', 'akka', 'amma',
        // Kannada
        'nanna ganda', 'akka', 'amma',
        // Malayalam
        'ente bharthav', 'chechi', 'amma',
    ];
    const maleClues = [
        // English
        'my wife', 'my girlfriend', 'my daughter', 'sir', 'mister', 'mr', 'father', 'dad', 'brother', 'son', 'boy', 'man', 'guy',
        // Tamil
        'en manaivi', 'manaivi', 'anna', 'thambi', 'appa',
        // Hindi
        'meri patni', 'meri biwi', 'behen', 'beti',
        // Telugu
        'naa bharya', 'anna', 'nanna',
        // Kannada
        'nanna hendati', 'anna', 'appa',
        // Malayalam
        'ente bharya', 'chettan', 'achan',
    ];

    let f = 0, m = 0;
    for (const clue of femaleClues) { if (text.includes(clue)) f++; }
    for (const clue of maleClues) { if (text.includes(clue)) m++; }

    if (f > m) return "Female Caller";
    if (m > f) return "Male Caller";
    return "Unknown Caller";
}

// Helper: Run simulation engine on transcript and return frontend-ready analysis
function runSimulationAnalysis(transcript) {
    const tempState = new CallIntelligenceState("sim-api");
    tempState.updateTranscript(transcript);
    ReasoningEngine.process(tempState, transcript);
    const augmentation = AugmentationEngine.process(tempState, transcript);
    tempState.updateAnalysis(augmentation);
    const c = tempState.currentAnalysis;
    const callerIdentity = extractCallerIdentity(transcript);
    return {
        emergencyType: (c.emergencyTypes && c.emergencyTypes.length > 0) ? c.emergencyTypes[0] : "General Emergency",
        intent: "Emergency Report",
        severity: Math.round(c.severityScore) || 2,
        panic_level: c.panicIndex || 20,
        confidence_score: c.confidence || 0.6,
        fake_call_probability: c.fakeCallRisk?.probability || 0,
        recommended_action: c.recommendedAction || "Dispatch nearest unit",
        explanation: c.reasoningTrace || "Analysis based on audio transcript keywords.",
        routing: {
            primary: c.emergencyTypes?.includes("Fire") ? "Fire Dept" : c.emergencyTypes?.includes("Medical") ? "Ambulance" : "Police",
            secondary: ["EMS"],
            reason: "Automated classification from transcript"
        },
        summary: {
            who: callerIdentity,
            what: c.emergencyTypes?.join(", ") || "Emergency Incident",
            where: c.locationData?.candidates?.[0] || "Location pending",
            condition: (c.severityScore > 3) ? "Critical" : "Stable",
            confidence: 0.75
        },
        dispatcherSummary: c.recommendedAction || "Dispatch nearest available unit.",
        model: "Simulation Core (Fallback)"
    };
}

// API Routes
// API Routes
app.post('/analyze', upload.single('audio'), async (req, res) => {
    console.log(`[API] POST /analyze request received`);

    // SAFE DEFAULT RESPONSE (Matching Dashboard requirements)
    let responsePayload = {
        transcript: "Processing Error: Audio received but analysis failed.",
        analysis: {
            // Frontend Core Props
            emergencyType: "Unknown",
            intent: "Unclear",
            severity: 1,

            // Dashboard Chart/Metrics Props
            panic_level: 0,
            confidence_score: 0,
            fake_call_probability: 0,

            // Dashboard Text Props
            recommended_action: "Manual Review Required",
            explanation: "System Error or AI Unavailable",

            // Routing
            routing: { primary: "Manual Dispatch", secondary: [], reason: "System Error" },

            // Summary
            summary: { who: "Unknown", what: "Unknown", where: "Unknown", condition: "Unknown" },
            dispatcherSummary: "SYSTEM ERROR: Perform manual analysis.",

            // Metadata
            model: "Error Fallback"
        }
    };

    try {
        if (!req.file) {
            console.warn("[API] No file uploaded.");
            return res.json(responsePayload); // Return default
        }

        const selectedLanguage = req.body?.language || req.query?.language || null;
        console.log(`[API] File received: ${req.file.originalname} (${req.file.size} bytes) [lang: ${selectedLanguage || 'auto'}]`);

        // 1. Attempt Real Analysis
        if (LLMService.isActive()) {
            console.log(`[API] sending to Groq Whisper (whisper-large-v3)...`);
            const result = await LLMService.transcribeAudio(req.file, selectedLanguage);

            if (result && result.text) {
                responsePayload.transcript = result.text;
                const detectedLang = result.language || 'unknown';
                console.log(`[API] Transcribed [${detectedLang}]: "${result.text.substring(0, 80)}..."`);

                // 2. Analyze with LLM
                const tempState = new CallIntelligenceState("temp-api-request");
                const rawAnalysis = await LLMService.analyze(result.text, tempState);

                if (rawAnalysis) {
                    responsePayload.analysis = {
                        ...rawAnalysis,
                        panic_level: rawAnalysis.panicIndex || rawAnalysis.panic_level || 50,
                        confidence_score: rawAnalysis.confidence || rawAnalysis.confidence_score || 0.5,
                        fake_call_probability: rawAnalysis.fakeCallProb || rawAnalysis.fake_call_probability || 0,
                        recommended_action: rawAnalysis.recommendedAction || rawAnalysis.recommended_action || "Assess Situation",
                        explanation: rawAnalysis.reasoningTrace || rawAnalysis.explanation || "Analysis complete.",
                        routing: rawAnalysis.routing || { primary: "Pending", secondary: [], reason: "..." },
                        detectedLanguage: rawAnalysis.detectedLanguage || detectedLang,
                        model: "Groq LLaMA 3 (REST)"
                    };
                } else {
                    console.warn("[API] LLM analysis failed, using simulation fallback");
                    responsePayload.analysis = { ...runSimulationAnalysis(result.text), detectedLanguage: detectedLang };
                }
            } else {
                console.error("[API] Transcription returned null/empty.");
                responsePayload.transcript = "Audio received but transcription unavailable.";
                responsePayload.analysis = runSimulationAnalysis("emergency help needed");
            }
        } else {
            // No API key - pure simulation mode
            console.log(`[API] No API key, running full simulation...`);
            responsePayload.transcript = "Simulation: Emergency call received. Caller reports urgent situation requiring immediate dispatch.";
            responsePayload.analysis = runSimulationAnalysis(responsePayload.transcript);
        }


        // Save to MongoDB (Flattened)
        try {
            const flatAnalysis = {
                transcript: responsePayload.transcript,
                ...responsePayload.analysis
            };

            const analysisResult = new AnalysisResult(flatAnalysis);
            await analysisResult.save();
            console.log("[API] Analysis saved to MongoDB (Flat Structure)");
        } catch (dbError) {
            console.error("[API] Failed to save analysis to MongoDB:", dbError.message);
        }

        console.log("[API] Analysis Success");
        res.json(responsePayload);

    } catch (error) {
        console.error("CRITICAL API ERROR /analyze:", error);
        // MUTATE responsePayload with error details
        responsePayload.transcript = `System Error: ${error.message}`;
        res.status(200).json(responsePayload); // Return 200 OK to prevent crash
    }
});

const { generateHeatmapData } = require('./src/services/liveMap');
app.get('/api/incidents/live-map', (req, res) => {
    res.json(generateHeatmapData());
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`\n⚡ RAPID-100 A.I. ENGINE ONLINE`);
    console.log(`   ► Port: ${PORT}`);
    console.log(`   ► Mode: Enterprise Simulation`);
    console.log(`   ► status: Waiting for dispatch streams...\n`);
});
