"use client"

import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Trigger } from "@/types/hotkey"

interface KeyDetectorProps {
  value: Trigger
  onChange: (trigger: Trigger) => void
  disabled?: boolean
}

export function KeyDetector({ value, onChange, disabled }: KeyDetectorProps) {
  const [isListening, setIsListening] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isListening) return

      e.preventDefault()
      const newTrigger: Trigger = {
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        win: e.metaKey,
        key: e.key.toLowerCase(),
      }
      onChange(newTrigger)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isListening) return
      setIsListening(false)
    }

    if (isListening) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isListening, onChange])

  const getDisplayValue = () => {
    const modifiers = [
      value.ctrl ? "Ctrl" : "",
      value.shift ? "Shift" : "",
      value.alt ? "Alt" : "",
      value.win ? "Win" : "",
    ]
      .filter(Boolean)
      .join(" + ")

    return modifiers ? `${modifiers} + ${value.key}` : value.key
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={getDisplayValue()}
        onFocus={() => setIsListening(true)}
        onBlur={() => setIsListening(false)}
        placeholder="Press any key combination..."
        readOnly
        disabled={disabled}
        className={isListening ? "ring-2 ring-primary" : ""}
      />
      {isListening && (
        <div className="absolute top-full left-0 mt-1 text-sm text-muted-foreground">
          Press any key combination...
        </div>
      )}
    </div>
  )
} 