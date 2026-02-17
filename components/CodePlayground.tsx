
import React, { useState } from 'react';
import { FileCode, Play, Save, Settings, Hash, Terminal } from 'lucide-react';

const CodePlayground: React.FC = () => {
  const [code, setCode] = useState(`// Welcome to Vibogram Code Playground
// Write some JS or Python logic here...

const greet = (name) => {
  return "Hello, " + name + "! 🚀";
};

console.log(greet("Developer"));`);

  return (
    <div className="flex flex-col h-[75vh] glass-border overflow-hidden rounded-t-[2rem]">
      {/* File Tab Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-t-lg border-t border-x border-blue-500/30">
          <FileCode className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-mono text-white/80">app.js</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 opacity-40">
          <Hash className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-mono">styles.css</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5">
        <div className="flex gap-4">
          <button className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold hover:brightness-125">
            <Play size={14} /> RUN
          </button>
          <button className="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-white">
            <Save size={14} /> SAVE
          </button>
        </div>
        <Settings size={14} className="text-white/30" />
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative font-mono text-sm">
        <div className="absolute top-0 left-0 w-10 h-full bg-black/20 flex flex-col items-center py-4 text-white/20 select-none border-r border-white/5">
          {Array.from({length: 15}).map((_, i) => (
            <div key={i} className="h-6 flex items-center text-[10px]">{i + 1}</div>
          ))}
        </div>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-transparent pl-12 pr-4 py-4 focus:outline-none resize-none text-blue-100 scrollbar-hide"
          spellCheck={false}
        />
      </div>

      {/* Mini Terminal */}
      <div className="h-32 bg-black/60 border-t border-white/10 p-4 font-mono">
        <div className="flex items-center gap-2 mb-2 text-white/40 text-[10px]">
          <Terminal size={12} /> TERMINAL
        </div>
        <div className="text-green-400 text-xs">
          > vibogram run app.js<br/>
          <span className="text-white">Hello, Developer! 🚀</span>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
