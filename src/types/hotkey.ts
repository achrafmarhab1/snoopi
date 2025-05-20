export type HotkeyType = "hotkey" | "hotstring"

export type ActionType =
  | "activateOrOpen"
  | "send"
  | "replace"
  | "sendUnicodeChar"
  | "activateOrOpenChrome"
  | "openConfig"
  | "lockWorkStation"
  | "turnMonitorsOff"
  | "custom"

export interface Trigger {
  ctrl: boolean
  shift: boolean
  alt: boolean
  win: boolean
  key: string
}

export interface ActionParams {
  activateOrOpen?: {
    window: string
    program: string
  }
  send?: {
    input: string
  }
  replace?: {
    input: string
  }
  sendUnicodeChar?: {
    charCode: string
  }
  activateOrOpenChrome?: {
    tabName: string
    url: string
  }
  custom?: {
    code: string
  }
}

export interface Action {
  type: ActionType
  params: ActionParams[keyof ActionParams]
}

export interface HotkeyConfig {
  id: string
  type: HotkeyType
  trigger: Trigger
  action: Action
} 