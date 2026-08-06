"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [lastRun, setLastRun] = useState<string>("Never");
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");

  const handleRunClick = () => {
    setShowModal(true);
  };

  const executeRun = async () => {
    setShowModal(false);
    setStatus("running");
    setLogs(["Starting automation..."]);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        let errMessage = "Unknown error";
        try {
            const data = await res.json();
            errMessage = data.error || errMessage;
        } catch(e) {}
        setStatus("error");
        setLogs((prev) => [...prev, `Error: ${errMessage}`]);
        return;
      }

      if (!res.body) {
        throw new Error("No response body returned from server.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.log) {
                  setLogs((prev) => [...prev, data.log]);
                }
                if (data.error) {
                  setStatus("error");
                  setLogs((prev) => [...prev, `Error: ${data.error}`]);
                }
                if (data.success) {
                  setStatus("success");
                  setLastRun(new Date().toLocaleString());
                }
              } catch (e) {
                // Ignore incomplete JSON parsing errors
              }
            }
          }
        }
      }
    } catch (err: any) {
      setStatus("error");
      setLogs((prev) => [...prev, `Network Error: ${err.message}`]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">LinkedIn Auto Poster</h1>
          <p className="text-neutral-400">AI-driven autonomous startup news curation and publishing.</p>
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleRunClick}
            disabled={status === "running"}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:cursor-not-allowed rounded-full text-white font-semibold text-lg transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
          >
            {status === "running" ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-6 h-6" />
            )}
            {status === "running" ? "Running Automation..." : "Run Now"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Current Status</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${status === 'idle' ? 'bg-neutral-500' : status === 'running' ? 'bg-blue-500 animate-pulse' : status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-semibold capitalize text-lg">{status}</span>
            </div>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Last Run Time</h3>
            <p className="font-semibold text-lg text-neutral-200">{lastRun}</p>
          </div>
        </div>

        {logs.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8">
            <div className="bg-neutral-900/50 border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-neutral-400">Live Logs</h3>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
            </div>
            <div className="p-4 font-mono text-xs text-neutral-400 h-48 overflow-y-auto space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-neutral-600 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className={log.includes("Error") ? "text-red-400" : log.includes("Success") ? "text-green-400" : "text-neutral-300"}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Manual Run Auth</h2>
            <p className="text-sm text-neutral-400 mb-6">Enter the MANUAL_RUN_SECRET to trigger the automation.</p>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-blue-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeRun()}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeRun}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
              >
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
