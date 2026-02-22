import { Monaco } from "@monaco-editor/react";
import { create } from "zustand";

import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";
import { CodeEditorState } from "@/types";

const getInitialState = () => {
    // If we are on the server, return default values
    if (typeof window === "undefined") {
        return {
            language: "javascript",
            fontSize: 14,
            theme: "vs-dark",
        }
    }

    // If we are on the client, return values from localStorage bc it is browser API
    const savedLanguage = localStorage.getItem("editor-language") || "javascript";
    const savedFontSize = localStorage.getItem("editor-font-size") || 14;
    const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";

    return {
        language: savedLanguage,
        fontSize: Number(savedFontSize),
        theme: savedTheme,
    }
}

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
    const initialState = getInitialState();

    // Return inital state + other default values for the store
    return {
        ...initialState,
        output: "",
        isRunning: false,
        error: null,
        editor: null,
        executionResult: null,

        getCode: () => get().editor?.getValue() || "",

        setEditor: (editor: Monaco) => {
            // Check if there is any prev. code in LS and set it in the editor if it exists
            const savedCode = localStorage.getItem(`editor-code-${get().language}`); // (e.g. "editor-code-javascript")

            if (savedCode) {
                editor.setValue(savedCode);
            }

            set({ editor }); // update editor state in the store
        },

        setTheme: (theme: string) => {
            // Save the theme in localStorage so that it stays after page reloads
            localStorage.setItem("editor-theme", theme);
            set({ theme }); // update theme state in the store
        },

        setFontSize: (fontSize: number) => {
            // Save the font size in localStorage so that it stays after page reloads
            localStorage.setItem("editor-font-size", fontSize.toString());
            set({ fontSize }); // update fontSize state in the store
        },

        setLanguage: (language: string) => {
            // Save current language code before switching to another language
            const currentCode = get().editor?.getValue();
            if (currentCode) {
                // Save the code in localStorage with a key specific to the language (e.g. "editor-code-javascript")
                localStorage.setItem(`editor-code-${get().language}`, currentCode);
            }

            localStorage.setItem("editor-language", language); // change the language itself

            // When we switch languages, reset the output and error states and update the language state in the store
            set({
                language,
                output: "",
                error: null,
            });
        },

        runCode: async () => {
            // function stub
        }
    }
})