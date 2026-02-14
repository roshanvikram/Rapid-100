import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Activity, Upload, FileAudio, Play, Square } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const AudioStreamer = (props) => {
    const { socket, isCallActive, onCallStart, onCallEnd, onAnalysisComplete } = props;
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [mode, setMode] = useState('mic'); // 'mic' or 'file'
    const [uploadedFile, setUploadedFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, analyzing, error, success
    const [errorMessage, setErrorMessage] = useState('');
    const [micError, setMicError] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    // --- Start Recording (just records, no streaming) ---
    const startRecording = async () => {
        try {
            setMicError('');
            chunksRef.current = [];
            setRecordingTime(0);

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                    ? 'audio/webm;codecs=opus'
                    : 'audio/webm'
            });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onerror = (e) => {
                console.error('MediaRecorder error:', e);
                setMicError('Recording error occurred');
            };

            // Collect data every second (just buffering, not sending)
            mediaRecorder.start(1000);
            setIsRecording(true);
            onCallStart();

            // Timer for recording duration display
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Mic access error:', err);
            setMicError(
                err.name === 'NotAllowedError'
                    ? 'Microphone access denied. Please allow mic permission.'
                    : 'Could not access microphone. Check your device.'
            );
        }
    };

    // --- Stop Recording & Send Full Audio for Analysis ---
    const stopRecordingAndAnalyze = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
            setIsRecording(false);
            return;
        }

        // When stopped, the final data chunk fires, then we send everything
        mediaRecorderRef.current.onstop = async () => {
            // Stop mic stream
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            setIsRecording(false);
            setIsAnalyzing(true);

            // Build the complete audio blob from all chunks
            const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
            console.log(`Recording complete: ${chunksRef.current.length} chunks, ${(audioBlob.size / 1024).toFixed(1)} KB`);

            if (audioBlob.size < 1000) {
                setMicError('Recording too short. Please speak for at least a few seconds.');
                setIsAnalyzing(false);
                onCallEnd();
                return;
            }

            // Send complete audio to backend /analyze endpoint
            try {
                const formData = new FormData();
                formData.append('audio', audioBlob, 'recording.webm');

                console.log("Sending full recording to /analyze...");
                const response = await fetch('http://localhost:5001/analyze', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Server Error: ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Analysis Result:", data);

                if (data.analysis) {
                    setIsAnalyzing(false);
                    if (onAnalysisComplete) {
                        onAnalysisComplete(data);
                    }
                } else {
                    throw new Error("No analysis in response");
                }
            } catch (error) {
                console.error("Analysis Failed:", error);
                setIsAnalyzing(false);
                setMicError(error.message || "Analysis failed. Try again.");
            }
        };

        mediaRecorderRef.current.stop();
    };

    // --- File Logic ---
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length) {
            setUploadedFile(acceptedFiles[0]);
            setMode('file');
            setStatus('idle');
            setErrorMessage('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'audio/*': [] },
        maxFiles: 1
    });

    const analyzeFile = async () => {
        if (!uploadedFile) return;

        setStatus('analyzing');
        setErrorMessage('');
        onCallStart();

        try {
            const formData = new FormData();
            formData.append('audio', uploadedFile);

            const response = await fetch('http://localhost:5001/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.analysis) {
                setStatus('success');
                if (onAnalysisComplete) {
                    onAnalysisComplete(data);
                }
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Analysis Failed:", error);
            setStatus('error');
            setErrorMessage(error.message || "Connection Failed");
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // --- Render ---
    return (
        <div className="glass-card p-1 pb-0 relative overflow-hidden group w-full">
            {/* Ambient Glow */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-rapid-blue via-rapid-purple to-rapid-red opacity-0 transition-opacity duration-1000 blur-xl ${(isRecording || isAnalyzing) ? 'opacity-40' : ''}`}></div>

            <div className="relative bg-[#0B101B]/90 backdrop-blur-xl p-8 rounded-[11px] flex flex-col items-center gap-6 z-10 min-h-[400px]">

                {/* Mode Switcher */}
                <div className="flex bg-slate-800/50 p-1 rounded-lg w-full mb-2">
                    <button
                        onClick={() => { if (!isRecording && !isAnalyzing) { setMode('mic'); setUploadedFile(null); } }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'mic' ? 'bg-rapid-blue text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Microphone
                    </button>
                    <button
                        onClick={() => { if (!isRecording && !isAnalyzing) setMode('file'); }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'file' ? 'bg-rapid-purple text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        File Upload
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full flex flex-col items-center justify-center relative">

                    {mode === 'mic' ? (
                        <div className="text-center space-y-6">
                            {/* Mic Button with Recording Animation */}
                            <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
                                {isRecording && (
                                    <>
                                        <div className="absolute inset-0 rounded-full border border-red-500/30 animate-[ping_2s_linear_infinite]"></div>
                                        <div className="absolute inset-4 rounded-full border border-red-500/30 animate-[ping_2.5s_linear_infinite]"></div>
                                        <div className="absolute inset-0 rounded-full bg-red-500/5 animate-pulse"></div>
                                    </>
                                )}
                                {isAnalyzing && (
                                    <div className="absolute inset-0 rounded-full border-2 border-rapid-blue/50 border-t-rapid-blue animate-spin"></div>
                                )}

                                {isAnalyzing ? (
                                    /* Analyzing state - show spinner */
                                    <div className="relative z-20 w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-rapid-blue to-indigo-700 shadow-2xl shadow-blue-600/30">
                                        <Activity size={32} className="animate-spin" />
                                    </div>
                                ) : isRecording ? (
                                    /* Recording state - show stop button */
                                    <button
                                        onClick={stopRecordingAndAnalyze}
                                        className="relative z-20 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl bg-gradient-to-br from-red-600 to-red-800 hover:scale-105 shadow-red-600/30"
                                    >
                                        <Square size={28} fill="currentColor" />
                                    </button>
                                ) : (
                                    /* Idle state - show mic button */
                                    <button
                                        onClick={startRecording}
                                        className="relative z-20 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl bg-gradient-to-br from-rapid-blue to-indigo-700 hover:scale-110 shadow-blue-600/30"
                                    >
                                        <Mic size={32} />
                                    </button>
                                )}
                            </div>

                            {/* Status Text */}
                            {micError ? (
                                <p className="text-red-400 text-sm font-medium px-4">{micError}</p>
                            ) : isAnalyzing ? (
                                <p className="text-rapid-blue text-sm font-medium animate-pulse">
                                    Analyzing your recording...
                                </p>
                            ) : isRecording ? (
                                <div className="space-y-2">
                                    <p className="text-red-400 text-sm font-medium flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                        Recording... {formatTime(recordingTime)}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                        Click the stop button when done speaking
                                    </p>
                                </div>
                            ) : (
                                <p className="text-slate-400 text-sm font-medium">
                                    Tap to Start Recording
                                </p>
                            )}
                        </div>
                    ) : (
                        /* File UI */
                        <div className="w-full text-center space-y-6">
                            {!uploadedFile ? (
                                <div {...getRootProps()} className={`border-2 border-dashed border-slate-700 rounded-2xl p-8 transition-all cursor-pointer ${isDragActive ? 'border-rapid-purple bg-rapid-purple/10' : 'hover:border-slate-500 hover:bg-white/5'}`}>
                                    <input {...getInputProps()} />
                                    <Upload size={40} className="mx-auto text-slate-500 mb-4" />
                                    <p className="text-slate-300 font-medium">Drop audio call file here</p>
                                    <p className="text-xs text-slate-500 mt-2">Supports MP3, WAV, WebM, OGG</p>
                                </div>
                            ) : (
                                <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-lg bg-rapid-purple/20 flex items-center justify-center text-rapid-purple">
                                            <FileAudio size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white font-medium truncate max-w-[180px]">{uploadedFile.name}</p>
                                            <p className="text-xs text-slate-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>

                                    {status === 'error' && (
                                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-xs text-left">
                                            Error: {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        onClick={status === 'analyzing' ? null : analyzeFile}
                                        disabled={status === 'analyzing'}
                                        className={`w-full py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${status === 'analyzing'
                                            ? 'bg-slate-700 cursor-wait'
                                            : 'bg-gradient-to-r from-rapid-purple to-pink-600 hover:scale-[1.02] shadow-lg shadow-purple-600/20'
                                            }`}
                                    >
                                        {status === 'analyzing' ? (
                                            <><Activity className="animate-spin" size={18} /> Analyzing...</>
                                        ) : (
                                            <><Play size={18} fill="currentColor" /> Analyze File</>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Visualizer Footer */}
                <div className="w-full h-12 flex items-end justify-center gap-[2px] opacity-30">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-1 bg-white rounded-t-sm transition-all duration-100 ${(isRecording || isAnalyzing || status === 'analyzing') ? 'animate-pulse' : ''}`}
                            style={{
                                height: (isRecording || isAnalyzing || status === 'analyzing') ? `${Math.random() * 100}%` : '10%',
                                backgroundColor: (isRecording || isAnalyzing || status === 'analyzing') ? (i % 2 === 0 ? '#3B82F6' : '#8B5CF6') : '#334155'
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AudioStreamer;
