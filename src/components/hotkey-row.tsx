"use client"

import { HotkeyConfig } from "@/types/hotkey"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { KeyDetector } from "@/components/key-detector"
import { ActionFields } from "@/components/action-fields"
import { Input } from "@/components/ui/input"

interface HotkeyRowProps {
  hotkey: HotkeyConfig
  onUpdate: (updated: Partial<HotkeyConfig>) => void
  onRemove: () => void
}

export function HotkeyRow({ hotkey, onUpdate, onRemove }: HotkeyRowProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Select
                value={hotkey.type}
                onValueChange={(value) => onUpdate({ type: value as "hotkey" | "hotstring" })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotkey">Hotkey</SelectItem>
                  <SelectItem value="hotstring">Hotstring</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={hotkey.action.type}
                onValueChange={(value) =>
                  onUpdate({
                    action: {
                      type: value as any,
                      params: {},
                    },
                  })
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activateOrOpen">Activate or Open</SelectItem>
                  <SelectItem value="send">Send</SelectItem>
                  <SelectItem value="replace">Replace</SelectItem>
                  <SelectItem value="sendUnicodeChar">Send Unicode Char</SelectItem>
                  <SelectItem value="activateOrOpenChrome">Activate or Open Chrome</SelectItem>
                  <SelectItem value="openConfig">Open Config</SelectItem>
                  <SelectItem value="lockWorkStation">Lock Work Station</SelectItem>
                  <SelectItem value="turnMonitorsOff">Turn Monitors Off</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hotkey.type === "hotkey" ? (
              <KeyDetector
                value={hotkey.trigger}
                onChange={(trigger) => onUpdate({ trigger })}
              />
            ) : (
              <Input
                type="text"
                placeholder="Type trigger text"
                value={hotkey.trigger.key}
                onChange={(e) =>
                  onUpdate({
                    trigger: { ...hotkey.trigger, key: e.target.value },
                  })
                }
              />
            )}
          </div>

          <Button
            variant="destructive"
            size="icon"
            onClick={onRemove}
          >
            ×
          </Button>
        </div>

        <ActionFields
          type={hotkey.action.type}
          value={hotkey.action.params}
          onChange={(params) =>
            onUpdate({
              action: {
                ...hotkey.action,
                params,
              },
            })
          }
        />
      </div>
    </Card>
  )
} 