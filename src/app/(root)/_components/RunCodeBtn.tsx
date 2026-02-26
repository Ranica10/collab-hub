"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";

function RunCode() {
  // Get authenticated user info from Clerk
  const { user } = useUser();
  // Get the runCode function and other relevant state from the code editor store
  const { runCode, language, isRunning, executionResult } = useCodeEditorStore();

  const handleRun = () => {
    
  }

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative inline-flex items-center gap-2.5 px-5 py-2.5
        disabled:cursor-not-allowed
        focus:outline-none cursor-pointer
      `}
    >
      {/* bg wit gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl opacity-100 transition-opacity
       group-hover:opacity-90" />
      
      {/* Button content */}
      <div className="relative flex items-center gap-2.5">
          {isRunning ? (
            /* Loading */
            <>
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-sm font-medium text-white/90">Executing...</span>
            </>
          ) : (
            /* Default state */
            <>
            <div className="relative flex items-center justify-center w-4 h-4">
              <Play className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
            </div>
            <span className="text-sm font-medium text-white/90 group-hover:text-white">
              Run Code
            </span>
          </>
          )}
      </div>
    </motion.button>
  )
}

export default RunCode