
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ReconReport } from '../types';
import { Video, Loader2, Play, Download, AlertTriangle, Key, Shield, Sparkles, Info } from 'lucide-react';

interface VideoGeneratorProps {
  report: ReconReport;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({ report }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkAndPromptKey = async () => {
    try {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
      return true;
    } catch (e) {
      console.error("Key selection failed", e);
      return true; // Assume success and proceed as per instructions
    }
  };

  const generateVideoSummary = async () => {
    setLoading(true);
    setError(null);
    setStatus('Initializing Video Synthesis Engine...');

    const authorized = await checkAndPromptKey();
    if (!authorized) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const prompt = `A cinematic, high-tech cybersecurity visualization. 
      The video shows a 3D digital globe of ${report.domain} being analyzed by a blue holographic shield. 
      Cyber-attacks are blocked by a neon firewall. 
      The text "SURFACE DISCOVERED" and "RISK LEVEL: ${report.riskLevel.toUpperCase()}" pulses in a futuristic HUD. 
      Neon blue and dark slate color palette, 4k, smooth camera sweep, digital grain.`;

      setStatus('Submitting job to Veo-3.1-Fast...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatus('Veo is rendering your security summary (this takes ~1-2 minutes)...');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        setStatus(`Rendering: ${new Date().toLocaleTimeString()} - AI is dreaming of cyber-defense...`);
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      if (operation.error) {
        throw new Error(operation.error.message || "Video generation failed.");
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("No video output received.");

      setStatus('Fetching video bytes...');
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY as string}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setVideoUrl(url);
      setStatus('Synthesis Complete.');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        // @ts-ignore
        window.aistudio.openSelectKey();
        setError("API Key verification failed. Please select a valid paid project API key.");
      } else {
        setError(err.message || "Failed to generate video summary.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0F111A] border border-white/5 rounded-3xl p-8 space-y-8 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Sparkles size={14} /> AI Video Summary
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Report Synthesis</h2>
          <p className="text-sm text-slate-400 max-w-xl font-medium">
            Generate a cinematic AI video visualization of your organization's attack surface using the Gemini Veo model.
          </p>
        </div>

        {!videoUrl && !loading && (
          <button 
            onClick={generateVideoSummary}
            className="group relative flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-indigo-500 hover:text-white shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20"
          >
            <Video size={20} className="group-hover:animate-pulse" />
            GENERATE VIDEO INTEL
          </button>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0B0E14] border border-white/5 rounded-3xl space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-500/20 rounded-full" />
            <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-white font-bold animate-pulse uppercase tracking-widest text-xs">{status}</p>
            <p className="text-[10px] text-slate-500 uppercase font-mono">Status: Awaiting Veo Response</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl flex items-center gap-4">
          <AlertTriangle className="text-rose-500" size={24} />
          <div className="space-y-1">
            <p className="text-sm text-white font-bold">{error}</p>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-rose-500 underline">Check billing requirements</a>
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <div className="relative group rounded-3xl overflow-hidden border border-white/10 bg-black aspect-video shadow-2xl">
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <a 
                href={videoUrl} 
                download={`surfacex-intel-${report.domain}.mp4`}
                className="bg-black/60 backdrop-blur-md p-3 rounded-xl text-white hover:bg-indigo-600 transition-all flex items-center gap-2 text-xs font-bold"
              >
                <Download size={16} /> DOWNLOAD MP4
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
            <Info size={18} className="text-indigo-400 shrink-0" />
            <p className="text-xs text-slate-300 italic">
              This video was synthesized using your actual report data. Risk Level: <span className="text-indigo-400 font-bold">{report.riskLevel}</span>, Asset Count: <span className="text-indigo-400 font-bold">{report.subdomains.length}</span>.
            </p>
          </div>
        </div>
      )}

      <div className="pt-8 border-t border-white/5">
        <div className="flex items-start gap-4 p-6 bg-[#0B0E14] rounded-2xl border border-white/5">
          <Key className="text-slate-500 shrink-0 mt-1" size={18} />
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Veo Requirements</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Video generation is an enterprise-tier feature. You must select a API key from a Google Cloud project with billing enabled. High-quality 720p videos are typically generated in 60-120 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
