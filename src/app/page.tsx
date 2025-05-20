import { Metadata } from "next"
import { AHKGenerator } from "@/components/ahk-generator"

export const metadata: Metadata = {
  title: "AHK Generator - Create AutoHotkey Scripts Easily",
  description: "A modern web interface for generating AutoHotkey scripts with hotkeys and hotstrings.",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AHK Generator</h1>
          <p className="text-lg text-gray-600">
            Create AutoHotkey scripts with a modern, user-friendly interface
          </p>
        </header>
        <AHKGenerator />
      </div>
    </main>
  )
}
