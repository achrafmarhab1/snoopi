"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HotkeyRow } from "@/components/hotkey-row"
import { ScriptPreview } from "@/components/script-preview"
import { generateAHKScript } from "@/lib/ahk-generator"
import { HotkeyConfig } from "@/types/hotkey"

export function AHKGenerator() {
  const [hotkeys, setHotkeys] = useState<HotkeyConfig[]>([
    {
      id: "1",
      type: "hotkey",
      trigger: {
        ctrl: false,
        shift: false,
        alt: false,
        win: false,
        key: "",
      },
      action: {
        type: "send",
        params: {
          input: "",
        },
      },
    },
  ])

  const [generatedScript, setGeneratedScript] = useState<string>("")
  const [isDirty, setIsDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateHotkey = (hotkey: HotkeyConfig): string | null => {
    if (!hotkey.trigger.key) {
      return "Key/trigger text is required"
    }

    if (hotkey.type === "hotkey" && !hotkey.trigger.ctrl && !hotkey.trigger.shift && !hotkey.trigger.alt && !hotkey.trigger.win) {
      return "At least one modifier key (Ctrl, Shift, Alt, Win) is required for hotkeys"
    }

    // Validate action params based on action type
    switch (hotkey.action.type) {
      case "send":
      case "replace":
        if (!(hotkey.action.params as any).input) {
          return "Input text is required"
        }
        break
      case "activateOrOpen":
        if (!(hotkey.action.params as any).window && !(hotkey.action.params as any).program) {
          return "Window title or program path is required"
        }
        break
      case "activateOrOpenChrome":
        if (!(hotkey.action.params as any).tabName && !(hotkey.action.params as any).url) {
          return "Tab name or URL is required"
        }
        break
      case "sendUnicodeChar":
        if (!(hotkey.action.params as any).charCode) {
          return "Unicode character code is required"
        }
        break
      case "custom":
        if (!(hotkey.action.params as any).code) {
          return "Custom AHK code is required"
        }
        break
    }

    return null
  }

  const addHotkey = () => {
    setHotkeys([
      ...hotkeys,
      {
        id: Date.now().toString(),
        type: "hotkey",
        trigger: {
          ctrl: false,
          shift: false,
          alt: false,
          win: false,
          key: "",
        },
        action: {
          type: "send",
          params: {
            input: "",
          },
        },
      },
    ])
    setIsDirty(true)
    setError(null)
  }

  const removeHotkey = (id: string) => {
    if (hotkeys.length <= 1) {
      setError("At least one hotkey/hotstring is required")
      return
    }
    setHotkeys(hotkeys.filter((hk) => hk.id !== id))
    setIsDirty(true)
    setError(null)
  }

  const updateHotkey = (id: string, updatedHotkey: Partial<HotkeyConfig>) => {
    const newHotkeys = hotkeys.map((hk) =>
      hk.id === id ? { ...hk, ...updatedHotkey } : hk
    )
    setHotkeys(newHotkeys)
    setIsDirty(true)
    setError(null)
  }

  const generateScript = () => {
    // Validate all hotkeys
    for (const hotkey of hotkeys) {
      const validationError = validateHotkey(hotkey)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    try {
      const script = generateAHKScript(hotkeys)
      setGeneratedScript(script)
      setIsDirty(false)
      setError(null)
    } catch (err) {
      setError("Failed to generate script. Please check your configuration.")
      console.error("Script generation error:", err)
    }
  }

  const downloadScript = () => {
    try {
      const blob = new Blob([generatedScript], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "hotkeys.ahk"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError("Failed to download script")
      console.error("Download error:", err)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          {hotkeys.map((hotkey) => (
            <HotkeyRow
              key={hotkey.id}
              hotkey={hotkey}
              onUpdate={(updated) => updateHotkey(hotkey.id, updated)}
              onRemove={() => removeHotkey(hotkey.id)}
            />
          ))}
          <Button
            variant="outline"
            className="w-full"
            onClick={addHotkey}
          >
            Add Hotkey/Hotstring
          </Button>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={generateScript}
          disabled={!isDirty}
        >
          Generate Script
        </Button>
        {generatedScript && (
          <Button
            variant="secondary"
            onClick={downloadScript}
          >
            Download Script
          </Button>
        )}
      </div>

      {generatedScript && (
        <ScriptPreview script={generatedScript} />
      )}
    </div>
  )
} 