import { HotkeyConfig } from "@/types/hotkey"

export function generateAHKScript(hotkeys: HotkeyConfig[]): string {
  const scriptLines: string[] = [
    "#NoEnv",
    "SendMode Input",
    "SetWorkingDir %A_ScriptDir%",
    "setTitleMatchMode, 2",
    "",
  ]

  // Add hotkey definitions
  hotkeys.forEach((hotkey) => {
    const trigger = hotkey.type === "hotkey" 
      ? generateHotkeyTrigger(hotkey.trigger)
      : `::${hotkey.trigger.text}::`

    const action = generateActionCode(hotkey.action)
    scriptLines.push(`${trigger}${action}`)
  })

  // Add helper functions
  scriptLines.push(...[
    "",
    "OpenConfig()",
    "{",
    "    Run, \"https://www.ahkgen.com/?indexes=0&comment0=&func0=KEY&skey0`%5B`%5D=CTRL&skeyValue0=a&Window0=pornhub&Program0=https`%3A`%2F`%2Fwww.pornhub.com`%2Fview_video.php`%3Fviewkey`%3Dph62f8524a3b886&option0=ActivateOrOpenChrome\"",
    "}",
    "",
    "LockWorkStation()",
    "{",
    "    DllCall(\"LockWorkStation\")",
    "}",
    "",
    "TurnMonitorsOff()",
    "{",
    "    SendMessage,0x112,0xF170,2,,Program Manager",
    "}",
    "",
    "ActivateOrOpen(window, program)",
    "{",
    "    if WinExist(window)",
    "    {",
    "        WinActivate",
    "    }",
    "    else",
    "    {",
    "        Run cmd /c \"start ^\"^\" ^\"%program%^\"\",, Hide",
    "        WinWait, %window%,,5",
    "        IfWinNotActive, %window%, , WinActivate, %window%",
    "        {",
    "            WinActivate",
    "        }",
    "    }",
    "    return",
    "}",
    "",
    "ActivateOrOpenChrome(tab, url)",
    "{",
    "    Transform, url, Deref, \"%url%\"",
    "    Transform, tab, Deref, \"%tab%\"",
    "    chrome := \"- Google Chrome\"",
    "    found := \"false\"",
    "    tabSearch := tab",
    "    curWinNum := 0",
    "",
    "    SetTitleMatchMode, 2",
    "    if WinExist(Chrome)",
    "    {",
    "        WinGet, numOfChrome, Count, %chrome%",
    "        WinActivateBottom, %chrome%",
    "        WinWaitActive %chrome%",
    "        ControlFocus, Chrome_RenderWidgetHostHWND1",
    "",
    "        while (curWinNum < numOfChrome and found = \"false\") {",
    "            WinGetTitle, firstTabTitle, A",
    "            title := firstTabTitle",
    "            Loop",
    "            {",
    "                if(InStr(title, tabSearch)>0){",
    "                    found := \"true\"",
    "                    break",
    "                }",
    "                Send {Ctrl down}{Tab}{Ctrl up}",
    "                Sleep, 50",
    "                WinGetTitle, title, A",
    "                if(title = firstTabTitle){",
    "                    break",
    "                }",
    "            }",
    "            WinActivateBottom, %chrome%",
    "            curWinNum := curWinNum + 1",
    "        }",
    "    }",
    "",
    "    if(found = \"false\"){",
    "        Run chrome.exe \"%url%\"",
    "    }",
    "    return",
    "}",
    "",
    "SendUnicodeChar(charCode)",
    "{",
    "    if A_IsUnicode = 1",
    "    {",
    "        Send, {u+%charCode%}",
    "    }",
    "    else",
    "    {",
    "        VarSetCapacity(ki, 28 * 2, 0)",
    "        EncodeInteger(&ki + 0, 1)",
    "        EncodeInteger(&ki + 6, charCode)",
    "        EncodeInteger(&ki + 8, 4)",
    "        EncodeInteger(&ki +28, 1)",
    "        EncodeInteger(&ki +34, charCode)",
    "        EncodeInteger(&ki +36, 4|2)",
    "        DllCall(\"SendInput\", \"UInt\", 2, \"UInt\", &ki, \"Int\", 28)",
    "    }",
    "}",
    "",
    "EncodeInteger(ref, val)",
    "{",
    "    DllCall(\"ntdll\\RtlFillMemoryUlong\", \"Uint\", ref, \"Uint\", 4, \"Uint\", val)",
    "}",
  ])

  return scriptLines.join("\n")
}

function generateHotkeyTrigger(trigger: { ctrl: boolean; shift: boolean; alt: boolean; win: boolean; key: string }): string {
  const modifiers: string[] = []
  if (trigger.ctrl) modifiers.push("^")
  if (trigger.shift) modifiers.push("+")
  if (trigger.alt) modifiers.push("!")
  if (trigger.win) modifiers.push("#")
  return `${modifiers.join("")}${trigger.key}::`
}

function generateActionCode(action: { type: string; params: any }): string {
  switch (action.type) {
    case "send":
      return `Send, ${action.params.input}`
    case "replace":
      return `Send, ${action.params.input}`
    case "activateOrOpen":
      return `ActivateOrOpen("${action.params.window}", "${action.params.program}")`
    case "activateOrOpenChrome":
      return `ActivateOrOpenChrome("${action.params.tabName}", "${action.params.url}")`
    case "sendUnicodeChar":
      return `SendUnicodeChar(${action.params.charCode})`
    case "lockWorkStation":
      return "LockWorkStation()"
    case "turnMonitorsOff":
      return "TurnMonitorsOff()"
    case "custom":
      return action.params.code
    default:
      return ""
  }
} 