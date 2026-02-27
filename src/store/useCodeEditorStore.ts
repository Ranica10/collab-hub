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
            // Get the current language and code from the store
            const { language, getCode } = get();
            const code = getCode();

            console.log("Code being executed:", code);

            // Validation: Check if the code is empty before running it
            if (!code) {
                set({ error: "Please enter some code!!" });
                return;
            }

            // Reset error and output states before running new code
            set({isRunning: true, error: null, output: ""});

            try {
                // Get the Judge0 language ID from the config for the current language
                const judge0LanguageId = LANGUAGE_CONFIG[language].judge0LanguageId;

                // Make a POST request to the Judge0 API to execute the code (done by a submission)
                const response = await fetch("https://ce.judge0.com/submissions/?base64_encoded=false&wait=true", {
                    method: "POST", // HTTP method for sending data to the server
                    headers: {
                    "Content-Type": "application/json", // Specify that the request body is in JSON format
                    },
                    body: JSON.stringify({
                        source_code: code, // the code to be executed
                        language_id: judge0LanguageId, // the language ID for the code (e.g. JavaScript: 97)
                        redirect_stderr_to_stdout: false, // keep stderr and stdout seperate
                    }),
                });

                // Parse the JSON response from the API
                const data = await response.json(); 
                //console.log("Judge0 API response: ", data);

                // Handle compilation errors (if any)
                if (data.compile_output) {
                    const error = data.compile_output;
                    console.log("Compilation error: ", error);

                    set({ error, executionResult: { code, output: "", error } });
                    return;
                }

                // Handle runtime errors (if any)
                if (data.stderr) {
                    const error = data.stderr;
                    console.log("Runtime error: ", error);

                    set({ error, executionResult: { code, output: "", error } });
                    return;
                }

                // Handle successful execution
                const output = data.stdout || "";
                set({
                    output: output.trim(),
                    executionResult: {
                        code,
                        output: output.trim(),
                        error: null,
                    },
                });

            } catch (e) {
                console.log("Error running code: ", e);
                set({
                error: "Error running code",
                executionResult: { code, output: "", error: "Error running code" },
                });
            } finally {
                set({ isRunning: false });
            }
        }
    }
})