import React from 'react';
import { MessageSquare, MapPin, Globe } from 'lucide-react';

const SuggestionPanel = ({ aiQuestions, locationData, translation }) => {
    return (
        <div className="space-y-4">
            {/* Questions */}
            <div className="glass-card p-5 border-l-4 border-l-blue-500">
                <h3 className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MessageSquare size={14} /> Copilot Suggestions
                </h3>
                <div className="space-y-2">
                    {aiQuestions && aiQuestions.length > 0 ? (
                        aiQuestions.map((q, i) => (
                            <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors cursor-pointer group">
                                <div className="text-sm font-medium text-white group-hover:text-blue-200">{q.query}</div>
                                <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">{q.importance} Priority</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-slate-500 italic">Listening for context...</div>
                    )}
                </div>
            </div>

            {/* Location & Language */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 border-l-4 border-l-yellow-500">
                    <h3 className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <MapPin size={12} /> Location Intel
                    </h3>
                    {locationData?.candidates?.length > 0 ? (
                        <div className="text-sm font-bold text-white leading-tight">
                            {locationData.candidates[0]}
                            <div className="text-[10px] text-slate-400 font-normal mt-1">
                                {(locationData.confidence * 100).toFixed(0)}% Confidence
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500">No location detected</div>
                    )}
                </div>

                <div className="glass-card p-4 border-l-4 border-l-green-500">
                    <h3 className="text-[10px] font-mono text-green-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Globe size={12} /> Language
                    </h3>
                    <div className="text-sm font-bold text-white uppercase">
                        {translation?.detectedLang || 'EN'}
                        <span className="text-[10px] text-slate-500 font-normal ml-2 block normal-case">
                            {translation?.isTranslated ? 'Translated' : 'Original Audio'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuggestionPanel;
