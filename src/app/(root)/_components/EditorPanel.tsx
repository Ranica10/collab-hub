"use client";
import { useEffect, useState } from "react";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { LANGUAGE_CONFIG } from "../_constants";

import { Editor } from "@monaco-editor/react";

function EditorPanel() {
  const [isShareOpen, setIsShareOpen] = useState(false);

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

  }

  const handleEditorChange = () => {

  }

  const handleFontSizeChange = () => {
    
  }

  return (
    <Editor />
  )
}

export default EditorPanel