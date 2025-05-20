"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Action, ActionType } from "@/types/hotkey"

interface ActionFieldsProps {
  type: ActionType
  value: Action["params"]
  onChange: (params: Action["params"]) => void
}

export function ActionFields({ type, value, onChange }: ActionFieldsProps) {
  switch (type) {
    case "activateOrOpen":
      return (
        <div className="space-y-2">
          <Input
            placeholder="Window title"
            value={(value as any).window || ""}
            onChange={(e) =>
              onChange({
                ...value,
                window: e.target.value,
              })
            }
          />
          <Input
            placeholder="Program path"
            value={(value as any).program || ""}
            onChange={(e) =>
              onChange({
                ...value,
                program: e.target.value,
              })
            }
          />
        </div>
      )

    case "send":
    case "replace":
      return (
        <Input
          placeholder="Input text"
          value={(value as any).input || ""}
          onChange={(e) =>
            onChange({
              input: e.target.value,
            })
          }
        />
      )

    case "sendUnicodeChar":
      return (
        <Input
          type="number"
          placeholder="Unicode character code"
          value={(value as any).charCode || ""}
          onChange={(e) =>
            onChange({
              charCode: e.target.value,
            })
          }
        />
      )

    case "activateOrOpenChrome":
      return (
        <div className="space-y-2">
          <Input
            placeholder="Tab name"
            value={(value as any).tabName || ""}
            onChange={(e) =>
              onChange({
                ...value,
                tabName: e.target.value,
              })
            }
          />
          <Input
            placeholder="URL"
            value={(value as any).url || ""}
            onChange={(e) =>
              onChange({
                ...value,
                url: e.target.value,
              })
            }
          />
        </div>
      )

    case "custom":
      return (
        <Textarea
          placeholder="Custom AHK code"
          value={(value as any).code || ""}
          onChange={(e) =>
            onChange({
              code: e.target.value,
            })
          }
          className="min-h-[100px]"
        />
      )

    case "openConfig":
    case "lockWorkStation":
    case "turnMonitorsOff":
      return null

    default:
      return null
  }
} 