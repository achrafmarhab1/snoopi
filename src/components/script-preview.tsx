"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ScriptPreviewProps {
  script: string
}

export function ScriptPreview({ script }: ScriptPreviewProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <pre className="whitespace-pre-wrap break-all font-mono text-sm">
          {script}
        </pre>
      </CardContent>
    </Card>
  )
} 