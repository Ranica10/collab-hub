import { Monaco } from "@monaco-editor/react";
import { Theme } from "../../../types";

// Language configuration for supported languages stored as key-value pairs
type LanguageConfig = Record<
  string,
  {
    id: string;
    label: string;
    logoPath: string;
    judge0LanguageId: number;
    monacoLanguage: string;
    defaultCode: string;
  }
>;

export const LANGUAGE_CONFIG: LanguageConfig = {
  javascript: {
    id: "javascript",
    label: "JavaScript",
    logoPath: "/javascript.png",
    judge0LanguageId: 97, // api
    monacoLanguage: "javascript",
    defaultCode: `// JavaScript Playground
console.log("Hello, World!");`,
  },
  typescript: {
    id: "typescript",
    label: "TypeScript",
    logoPath: "/typescript.png",
    judge0LanguageId: 74, // api
    monacoLanguage: "typescript",
    defaultCode: `// TypeScript Playground
console.log("Hello, World!");`,
  },
  python: {
    id: "python",
    label: "Python",
    logoPath: "/python.png",
    judge0LanguageId: 100, // api
    monacoLanguage: "python",
    defaultCode: `# Python Playground
print("Hello, World!")`,
  },
  java: {
    id: "java",
    label: "Java",
    logoPath: "/java.png",
    judge0LanguageId: 91, // api
    monacoLanguage: "java",
    defaultCode: `// Java Playground
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  go: {
    id: "go",
    label: "Go",
    logoPath: "/go.png",
    judge0LanguageId: 60, // api
    monacoLanguage: "go",
    defaultCode: `// Go Playground
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  },
  rust: {
    id: "rust",
    label: "Rust",
    logoPath: "/rust.png",
    judge0LanguageId: 73, // api
    monacoLanguage: "rust",
    defaultCode: `// Rust Playground
fn main() {
    println!("Hello, World!");
}`,
  },
  cpp: {
    id: "cpp",
    label: "C++",
    logoPath: "/cpp.png",
    judge0LanguageId: 105, // api
    monacoLanguage: "cpp",
    defaultCode: ` // C++ Playground
#include <iostream>

int main() {
    std::cout << "Hello, World!";
    
    return 0;
}`,
  },
  csharp: {
    id: "csharp",
    label: "C#",
    logoPath: "/csharp.png",
    judge0LanguageId: 51, // api
    monacoLanguage: "csharp",
    defaultCode: `// C# Playground
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
  },
  ruby: {
    id: "ruby",
    label: "Ruby",
    logoPath: "/ruby.png",
    judge0LanguageId: 72, // api
    monacoLanguage: "ruby",
    defaultCode: `# Ruby Playground
puts "Hello, World!"`,
  },
  swift: {
    id: "swift",
    label: "Swift",
    logoPath: "/swift.png",
    judge0LanguageId: 83, // api
    monacoLanguage: "swift",
    defaultCode: `// Swift Playground
print("Hello, World!")`,
  },
};

// Theme definitions
export const THEMES: Theme[] = [
  { id: "vs-dark", label: "VS Dark", color: "#1e1e1e" },
  { id: "vs-light", label: "VS Light", color: "#ffffff" },
  { id: "github-dark", label: "GitHub Dark", color: "#0d1117" },
  { id: "monokai", label: "Monokai", color: "#272822" },
  { id: "solarized-dark", label: "Solarized Dark", color: "#002b36" },
];

export const THEME_DEFINITONS = {
  "github-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6e7681" },
      { token: "string", foreground: "a5d6ff" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "number", foreground: "79c0ff" },
      { token: "type", foreground: "ffa657" },
      { token: "class", foreground: "ffa657" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "ffa657" },
      { token: "operator", foreground: "ff7b72" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.lineHighlightBackground": "#161b22",
      "editorLineNumber.foreground": "#6e7681",
      "editorIndentGuide.background": "#21262d",
      "editor.selectionBackground": "#264f78",
      "editor.inactiveSelectionBackground": "#264f7855",
    },
  },
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "75715E" },
      { token: "string", foreground: "E6DB74" },
      { token: "keyword", foreground: "F92672" },
      { token: "number", foreground: "AE81FF" },
      { token: "type", foreground: "66D9EF" },
      { token: "class", foreground: "A6E22E" },
      { token: "function", foreground: "A6E22E" },
      { token: "variable", foreground: "F8F8F2" },
      { token: "operator", foreground: "F92672" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#F8F8F2",
      "editorLineNumber.foreground": "#75715E",
      "editor.selectionBackground": "#49483E",
      "editor.lineHighlightBackground": "#3E3D32",
      "editorCursor.foreground": "#F8F8F2",
      "editor.selectionHighlightBackground": "#49483E",
    },
  },
  "solarized-dark": {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "586e75" },
      { token: "string", foreground: "2aa198" },
      { token: "keyword", foreground: "859900" },
      { token: "number", foreground: "d33682" },
      { token: "type", foreground: "b58900" },
      { token: "class", foreground: "b58900" },
      { token: "function", foreground: "268bd2" },
      { token: "variable", foreground: "b58900" },
      { token: "operator", foreground: "859900" },
    ],
    colors: {
      "editor.background": "#002b36",
      "editor.foreground": "#839496",
      "editorLineNumber.foreground": "#586e75",
      "editor.selectionBackground": "#073642",
      "editor.lineHighlightBackground": "#073642",
      "editorCursor.foreground": "#839496",
      "editor.selectionHighlightBackground": "#073642",
    },
  },
};

// Helper function to define themes in Monaco
export const defineMonacoThemes = (monaco: Monaco) => {
  Object.entries(THEME_DEFINITONS).forEach(([themeName, themeData]) => {
    monaco.editor.defineTheme(themeName, {
      base: themeData.base,
      inherit: themeData.inherit,
      rules: themeData.rules.map((rule) => ({
        ...rule,
        foreground: rule.foreground,
      })),
      colors: themeData.colors,
    });
  });
};