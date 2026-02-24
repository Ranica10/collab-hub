"use client";
import { useEffect, useState } from "react";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";

import { useClerk } from "@clerk/nextjs";
import { Editor } from "@monaco-editor/react";

import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import useMounted from "@/hooks/useMounted";

function EditorPanel() {
  // Get the Clerk instance to check if it's loaded
  const clerk = useClerk();

  // State to manage the open/close state of the share modal
  const [isShareOpen, setIsShareOpen] = useState(false);
  // Get necessary state and functions from the code editor store
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore();

  useEffect(() => {
    // Load saved code from localStorage when the component mounts or when the language changes
    const savedCode = localStorage.getItem(`editor-code-${language}`);
     // Use default code if no saved code is found 
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;

    // Update the editor's content with the new code when the language changes
    if (editor) {
      editor.setValue(newCode);
    }
  }, [language, editor]); // whenever the language changes, this effect will run

  useEffect(() => {
    // Load saved font size from localStorage when the component mounts or when the setFontSize function changes
    const savedFontSize = localStorage.getItem("editor-font-size");

    // Update the font size state with the saved value if it exists
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
  }, [setFontSize]);

  const handleRefresh = () => {
    // Get the default code for the current language
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;

    // Reset the editor content to the default code for the current language
    if (editor) {
      editor.setValue(defaultCode);
    }

    // Remove the saved code from localStorage to reset to default on next load
    localStorage.removeItem(`editor-code-${language}`);
  }

  const handleEditorChange = (value: string | undefined) => {
    // Check if value is defined
    if (value) {
      // Save the current code to localStorage whenever it changes
      localStorage.setItem(`editor-code-${language}`, value);
    }
  }

  const handleFontSizeChange = (newSize: number) => {
    // Maximum font size of 24 and minimum of 12
    const size = Math.min(Math.max(newSize, 12), 24);
    // Update the font size state with the new value
    setFontSize(size);
    // Update local storage with the new font size so that it persists across sessions
    localStorage.setItem("editor-font-size", size.toString());
  }

  // State to track if the component is mounted (to avoid hydration issues)
  const mounted = useMounted();
  // Show skeleton while waiting for client-side rendering
  if (!mounted) return <EditorPanelSkeleton />;

  return <div className="relative">
    {/* Container */}
    <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Current language logo */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} />
            </div>
            {/* Header Description */}
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">Write and execute your code</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            {/* Reset Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors cursor-pointer"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}  
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button>
          </div>
      </div>

      {/* Editor */}
      <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
        {clerk.loaded && <Editor
          height="600px"
          language={LANGUAGE_CONFIG[language].monacoLanguage}
          onChange={handleEditorChange}
          theme={theme}
          beforeMount={defineMonacoThemes}
          onMount={(editor) => setEditor(editor)}

          options={{
            minimap: { enabled: false },
            fontSize,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderWhitespace: "selection",
            wordWrap: "on",
            fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            renderLineHighlight: "all",
            lineHeight: 1.6,
            letterSpacing: 0.5,
            roundedSelection: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        /> }

        {/* Loading skeleton */}
        {!clerk.loaded && <EditorPanelSkeleton />}
      </div>
    </div>
  </div>
}

export default EditorPanel