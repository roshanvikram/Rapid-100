const CallIntelligenceState = require('../models/CallState');
const ReasoningEngine = require('../core/reasoning');
const AugmentationEngine = require('../ai/augmentationEngine/AugmentationEngine');
const LLMService = require('../services/LLMService');

// In-memory store (Replace with Redis in production)
const activeSessions = new Map();

// Extract caller name or identify gender (multilingual Indian support)
function extractCallerIdentity(transcript) {
    const text = (transcript || "").toLowerCase();
    const namePatterns = [
        /my name is ([a-z]+)/i, /this is ([a-z]+)/i, /i'?m ([a-z]+)/i, /i am ([a-z]+)/i,
        /name'?s ([a-z]+)/i, /call me ([a-z]+)/i,
        /en[nu]? peyar ([a-z]+)/i, /mera naam ([a-z]+)/i, /mera name ([a-z]+)/i,
        /main ([a-z]+) bol raha/i, /main ([a-z]+) bol rahi/i,
        /naa peru ([a-z]+)/i, /na peru ([a-z]+)/i,
        /nanna hesaru ([a-z]+)/i, /ente peru ([a-z]+)/i, /en[td]e peru ([a-z]+)/i,
        /amar naam ([a-z]+)/i, /majhe naav ([a-z]+)/i, /maru naam ([a-z]+)/i,
    ];
    const skip = ['calling','here','at','in','on','the','a','not','so','very','really','just','going','trying','looking','having','being','doing','hai','hain','hu','hoon','bol','baat'];
    for (const pattern of namePatterns) {
        const match = transcript.match(pattern);
        if (match && match[1] && !skip.includes(match[1].toLowerCase()) && match[1].length > 1) {
            return match[1].charAt(0).toUpperCase() + match[1].slice(1);
        }
    }
    const femaleClues = ['my husband','my boyfriend','my son','pregnant','ma\'am','miss','mrs','mother','mom','sister','daughter','girl','woman','lady','en kanavar','kanavar','akka','anni','amma','mere pati','mera pati','naa bharta','nanna ganda','ente bharthav','chechi'];
    const maleClues = ['my wife','my girlfriend','my daughter','sir','mister','mr','father','dad','brother','son','boy','man','guy','en manaivi','manaivi','anna','thambi','appa','meri patni','meri biwi','behen','beti','naa bharya','nanna hendati','ente bharya','chettan','achan'];
    let f = 0, m = 0;
    for (const c of femaleClues) { if (text.includes(c)) f++; }
    for (const c of maleClues) { if (text.includes(c)) m++; }
    if (f > m) return "Female Caller";
    if (m > f) return "Male Caller";
    return "Unknown Caller";
}

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        // Initialize Session
        activeSessions.set(socket.id, new CallIntelligenceState(socket.id));

        socket.on('start-call', () => {
            console.log(`[Session] Started for ${socket.id}`);
            // Reset state
            activeSessions.set(socket.id, new CallIntelligenceState(socket.id));
            const state = activeSessions.get(socket.id);
            socket.emit('ai-update', state.currentAnalysis);
        });

        socket.on('audio-chunk', ({ transcript, isFinal }) => {
            console.log(`[Socket] Received SIMULATED chunk: "${transcript}"`);
            if (!transcript) return;
            const state = activeSessions.get(socket.id);
            if (state && isFinal) {
                state.updateTranscript(transcript);
                socket.emit('transcript-update', state.fullTranscript);
                processAnalysis(socket, transcript, state);
            }
        });

        // NEW: Real-Time Audio Stream Handler (Binary Chunks)
        socket.on('audio-stream-chunk', async (buffer) => {
            // console.log(`[Socket] Received binary chunk: ${buffer.byteLength} bytes`);
            const state = activeSessions.get(socket.id);
            if (!state) return;

            if (LLMService.isActive()) {
                // Convert buffer to "File Object" match LLMService expectation
                const tempFile = {
                    buffer: Buffer.from(buffer),
                    originalname: 'stream_chunk.webm',
                    size: buffer.byteLength
                };

                const result = await LLMService.transcribeAudio(tempFile);
                if (result && result.text && result.text.trim().length > 0) {
                    console.log(`[RealMic] [${result.language}] Transcribed: "${result.text}"`);

                    state.updateTranscript(result.text + " ");
                    socket.emit('transcript-update', state.fullTranscript);

                    processAnalysis(socket, result.text, state);
                }
            } else {
                socket.emit('error', "Real AI not active. Cannot transcribe live stream.");
            }
        });

        socket.on('audio-file', async ({ buffer, fileName }) => {
            console.log(`[Socket] Received audio file: ${fileName}`);
            const state = activeSessions.get(socket.id);
            if (!state) return;

            if (LLMService.isActive()) {
                // 1. Transcribe (Core Function 1)
                const fullText = await LLMService.transcribeAudio(Buffer.from(buffer));

                if (fullText) {
                    console.log(`[Whisper] Transcribed: ${fullText}`);

                    // Reset transcript for fresh file analysis
                    state.fullTranscript = fullText;
                    socket.emit('transcript-update', { text: fullText, isFinal: true });

                    // 2. Analyze (Core Functions 2-5)
                    // For a full file, we analyze the WHOLE text as one big "chunk"
                    processAnalysis(socket, fullText, state);

                } else {
                    socket.emit('error', "Could not transcribe audio.");
                }
            } else {
                socket.emit('error', "Real AI Not Active. Configure API Key.");
            }
        });

        const runSimulationFallback = (socket, textSegment, state) => {
            console.log("[Analysis] Using Simulation Engine (Fallback)");
            try {
                ReasoningEngine.process(state, textSegment);
                const augmentation = AugmentationEngine.process(state, textSegment);
                state.updateAnalysis(augmentation);

                const current = state.currentAnalysis;

                const uiPayload = {
                    ...current,
                    emergencyType: (current.emergencyTypes && current.emergencyTypes.length > 0) ? current.emergencyTypes[0] : "Analysing...",
                    intent: "Emergency Report",
                    severity: Math.round(current.severityScore) || 1,
                    panic_level: current.panicIndex || 10,
                    confidence_score: current.confidence || 0.5,
                    fake_call_probability: current.fakeCallRisk?.probability || 0,
                    recommended_action: current.recommendedAction || "Monitor Channel",
                    explanation: current.reasoningTrace || "Processing audio stream patterns...",
                    routing: {
                        primary: current.emergencyTypes?.includes("Fire") ? "Fire Dept" : "Police",
                        secondary: ["EMS"],
                        reason: "Automated Dispatch Rule 104"
                    },
                    summary: {
                        who: extractCallerIdentity(state.fullTranscript || textSegment),
                        what: current.emergencyTypes?.join(", ") || "Incident",
                        where: current.locationData?.candidates?.[0] || "Unknown Location",
                        condition: (current.severityScore > 3) ? "Critical" : "Stable",
                        confidence: 0.8
                    },
                    dispatcherSummary: current.recommendedAction ? `RECOMMENDATION: ${current.recommendedAction}` : "Awaiting data...",
                    model: "Simulation Core (Fallback)"
                };

                socket.emit('analysis-update', uiPayload);
            } catch (err) {
                console.error("[Analysis] Error in Simulation Engine:", err);
            }
        };

        const processAnalysis = (socket, textSegment, state) => {
            console.log(`[Analysis] Processing segment for ${socket.id}: "${textSegment}"`);

            if (LLMService.isActive()) {
                LLMService.analyze(textSegment, state)
                    .then(realAnalysis => {
                        if (realAnalysis) {
                            state.updateAnalysis(realAnalysis);
                            state.currentAnalysis.model = "Groq LLaMA 3";
                            socket.emit('analysis-update', state.currentAnalysis);
                        } else {
                            // LLM returned null (rate limit, error) - fall back to simulation
                            console.warn("[Analysis] LLM returned null, falling back to simulation");
                            runSimulationFallback(socket, textSegment, state);
                        }
                    })
                    .catch(err => {
                        console.error("[Analysis] LLM error, falling back to simulation:", err.message);
                        runSimulationFallback(socket, textSegment, state);
                    });
            } else {
                runSimulationFallback(socket, textSegment, state);
            }
        };

        socket.on('disconnect', () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
            activeSessions.delete(socket.id);
        });
    });
};
