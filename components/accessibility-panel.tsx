"use client"

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { 
  Accessibility, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  MousePointer2, 
  Volume2, 
  VolumeX,
  Type, 
  Play, 
  Pause, 
  Square,
  Settings,
  Mic
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  reducedMotion: boolean
  focusHighlight: boolean
  underlineLinks: boolean
  voiceGuidance: boolean
  voiceSpeed: number
  voicePitch: number
  autoReadOnFocus: boolean
  readPageOnLoad: boolean
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  reducedMotion: false,
  focusHighlight: false,
  underlineLinks: false,
  voiceGuidance: false,
  voiceSpeed: 1,
  voicePitch: 1,
  autoReadOnFocus: false,
  readPageOnLoad: false,
}

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [isReading, setIsReading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"visual" | "audio">("visual")
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const announcerRef = useRef<HTMLDivElement>(null)

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices()
      setAvailableVoices(voices)
      // Default to first English voice
      const englishVoice = voices.find(v => v.lang.startsWith("en"))
      if (englishVoice) {
        setSelectedVoice(englishVoice.name)
      }
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("tnm-accessibility")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        applySettings(parsed)
      } catch {
        // Ignore parse errors
      }
    }
  }, [])

  // Announce to screen readers
  const announce = useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message
      // Clear after announcement
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = ""
        }
      }, 1000)
    }
  }, [])

  // Text-to-speech function
  const speak = useCallback((text: string, interrupt = true) => {
    if (!settings.voiceGuidance) return

    if (interrupt) {
      speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = settings.voiceSpeed ?? 1
    utterance.pitch = settings.voicePitch ?? 1
    
    const voice = availableVoices.find(v => v.name === selectedVoice)
    if (voice) {
      utterance.voice = voice
    }

    utterance.onstart = () => setIsReading(true)
    utterance.onend = () => {
      setIsReading(false)
      setIsPaused(false)
    }
    utterance.onerror = () => {
      setIsReading(false)
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }, [settings.voiceGuidance, settings.voiceSpeed, settings.voicePitch, availableVoices, selectedVoice])

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel()
    setIsReading(false)
    setIsPaused(false)
  }, [])

  // Pause/Resume speaking
  const togglePause = useCallback(() => {
    if (isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
    } else {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [isPaused])

  // Read entire page content
  const readPageContent = useCallback(() => {
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      // Get text content, cleaning up whitespace
      const text = mainContent.innerText
        .replace(/\s+/g, " ")
        .trim()
      speak(text)
    }
  }, [speak])

  // Read selected text
  const readSelection = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      speak(selection.toString())
    } else {
      speak("No text selected. Please select some text to read.")
    }
  }, [speak])

  // Auto-read on focus (for voice guidance)
  useEffect(() => {
    if (!settings.autoReadOnFocus || !settings.voiceGuidance) return

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target) {
        let textToRead = ""
        
        // Get aria-label first
        const ariaLabel = target.getAttribute("aria-label")
        if (ariaLabel) {
          textToRead = ariaLabel
        } else if (target.tagName === "BUTTON") {
          textToRead = `Button: ${target.textContent || "unnamed"}`
        } else if (target.tagName === "A") {
          textToRead = `Link: ${target.textContent || "unnamed"}`
        } else if (target.tagName === "INPUT") {
          const input = target as HTMLInputElement
          const label = document.querySelector(`label[for="${input.id}"]`)
          textToRead = `Input field: ${label?.textContent || input.placeholder || input.name || "unnamed"}`
        } else if (target.textContent) {
          textToRead = target.textContent.slice(0, 100)
        }

        if (textToRead) {
          speak(textToRead, true)
        }
      }
    }

    document.addEventListener("focusin", handleFocus)
    return () => document.removeEventListener("focusin", handleFocus)
  }, [settings.autoReadOnFocus, settings.voiceGuidance, speak])

  // Apply settings to the document
  const applySettings = (s: AccessibilitySettings) => {
    const root = document.documentElement

    // Font size
    root.style.fontSize = `${s.fontSize}%`

    // High contrast
    if (s.highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Reduced motion
    if (s.reducedMotion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // Focus highlight
    if (s.focusHighlight) {
      root.setAttribute("data-keyboard-nav", "true")
    } else {
      root.removeAttribute("data-keyboard-nav")
    }

    // Underline links
    if (s.underlineLinks) {
      root.classList.add("underline-links")
    } else {
      root.classList.remove("underline-links")
    }

    // Voice guidance attribute
    if (s.voiceGuidance) {
      root.setAttribute("data-voice-guidance", "true")
    } else {
      root.removeAttribute("data-voice-guidance")
    }
  }

  // Save and apply settings
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem("tnm-accessibility", JSON.stringify(updated))
    applySettings(updated)

    // Announce changes if voice guidance is on
    if (updated.voiceGuidance) {
      const key = Object.keys(newSettings)[0]
      const value = Object.values(newSettings)[0]
      if (typeof value === "boolean") {
        speak(`${key.replace(/([A-Z])/g, " $1").trim()} ${value ? "enabled" : "disabled"}`)
      }
    }

    announce(`Setting updated`)
  }

  // Reset to defaults
  const resetSettings = () => {
    stopSpeaking()
    setSettings(defaultSettings)
    localStorage.removeItem("tnm-accessibility")
    applySettings(defaultSettings)
    announce("Settings reset to defaults")
  }

  // Keyboard shortcut to open panel (Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "a") {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      // Alt + R to read page
      if (e.altKey && e.key === "r" && settings.voiceGuidance) {
        e.preventDefault()
        if (isReading) {
          stopSpeaking()
        } else {
          readPageContent()
        }
      }
      // Alt + S to read selection
      if (e.altKey && e.key === "s" && settings.voiceGuidance) {
        e.preventDefault()
        readSelection()
      }
      // Escape to stop reading
      if (e.key === "Escape" && isReading) {
        stopSpeaking()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [settings.voiceGuidance, isReading, stopSpeaking, readPageContent, readSelection])

  return (
    <>
      {/* Live region for screen reader announcements */}
      <div
        ref={announcerRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Accessibility Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(true)
          if (settings.voiceGuidance) {
            speak("Accessibility panel opened")
          }
        }}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Open accessibility settings (Alt + A)"
        title="Accessibility Settings (Alt + A)"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Voice Reading Controls - Floating */}
      {settings.voiceGuidance && isReading && (
        <div className="fixed bottom-6 left-24 z-50 flex items-center gap-2 bg-[#0d1117] border border-white/20 rounded-full px-4 py-2 shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={togglePause}
            aria-label={isPaused ? "Resume reading" : "Pause reading"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={stopSpeaking}
            aria-label="Stop reading"
          >
            <Square className="w-4 h-4" />
          </Button>
          <span className="text-sm text-white/70 px-2">Reading...</span>
        </div>
      )}

      {/* Accessibility Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setIsOpen(false)
            if (settings.voiceGuidance) {
              speak("Accessibility panel closed")
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-title"
        >
          <div
            className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:w-[420px] bg-[#0d1117] border border-white/10 rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0d1117] border-b border-white/10 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Accessibility className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 id="accessibility-title" className="text-lg font-semibold text-white">
                    Accessibility
                  </h2>
                  <p className="text-sm text-white/50">WCAG 2.1 AA Compliant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white hover:bg-white/10"
                aria-label="Close accessibility settings"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab("visual")}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "visual"
                    ? "text-blue-400 border-b-2 border-blue-400 bg-blue-400/5"
                    : "text-white/50 hover:text-white"
                }`}
                aria-selected={activeTab === "visual"}
                role="tab"
              >
                <Eye className="w-4 h-4" />
                Visual
              </button>
              <button
                onClick={() => setActiveTab("audio")}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "audio"
                    ? "text-blue-400 border-b-2 border-blue-400 bg-blue-400/5"
                    : "text-white/50 hover:text-white"
                }`}
                aria-selected={activeTab === "audio"}
                role="tab"
              >
                <Volume2 className="w-4 h-4" />
                Voice & Audio
              </button>
            </div>

            {/* Settings Content */}
            <div className="p-4 space-y-6">
              {activeTab === "visual" && (
                <>
                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-white">
                        <Type className="w-4 h-4 text-blue-400" />
                        Text Size
                      </Label>
                      <span className="text-sm text-white/50">{settings.fontSize}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-white/20 bg-transparent text-white hover:bg-white/10"
                        onClick={() => updateSettings({ fontSize: Math.max(80, settings.fontSize - 10) })}
                        aria-label="Decrease text size"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={([value]) => updateSettings({ fontSize: value })}
                        min={80}
                        max={150}
                        step={10}
                        className="flex-1"
                        aria-label="Text size slider"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-white/20 bg-transparent text-white hover:bg-white/10"
                        onClick={() => updateSettings({ fontSize: Math.min(150, settings.fontSize + 10) })}
                        aria-label="Increase text size"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Visual Toggle Options */}
                  <div className="space-y-3">
                    <ToggleOption
                      icon={<Eye className="w-5 h-5 text-yellow-400" />}
                      label="High Contrast"
                      description="Increase color contrast for better visibility"
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                    />

                    <ToggleOption
                      icon={<Settings className="w-5 h-5 text-green-400" />}
                      label="Reduced Motion"
                      description="Minimize animations and transitions"
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                    />

                    <ToggleOption
                      icon={<MousePointer2 className="w-5 h-5 text-purple-400" />}
                      label="Focus Indicators"
                      description="Show prominent outlines on focused elements"
                      checked={settings.focusHighlight}
                      onCheckedChange={(checked) => updateSettings({ focusHighlight: checked })}
                    />

                    <ToggleOption
                      icon={<Type className="w-5 h-5 text-blue-400" />}
                      label="Underline Links"
                      description="Make all links visually distinct"
                      checked={settings.underlineLinks}
                      onCheckedChange={(checked) => updateSettings({ underlineLinks: checked })}
                    />
                  </div>
                </>
              )}

              {activeTab === "audio" && (
                <>
                  {/* Voice Guidance Master Toggle */}
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {settings.voiceGuidance ? (
                          <Volume2 className="w-6 h-6 text-blue-400" />
                        ) : (
                          <VolumeX className="w-6 h-6 text-white/40" />
                        )}
                        <div>
                          <Label className="text-white font-medium text-base">Voice Guidance</Label>
                          <p className="text-xs text-white/50">Enable text-to-speech features</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.voiceGuidance}
                        onCheckedChange={(checked) => {
                          updateSettings({ voiceGuidance: checked })
                          if (checked) {
                            setTimeout(() => speak("Voice guidance enabled. I will read content aloud for you."), 100)
                          }
                        }}
                        aria-label="Toggle voice guidance"
                      />
                    </div>
                  </div>

                  {settings.voiceGuidance && (
                    <>
                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <Label className="text-white text-sm">Quick Actions</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent justify-start gap-2"
                            onClick={readPageContent}
                            disabled={isReading}
                          >
                            <Play className="w-4 h-4" />
                            Read Page
                          </Button>
                          <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent justify-start gap-2"
                            onClick={readSelection}
                          >
                            <Mic className="w-4 h-4" />
                            Read Selection
                          </Button>
                          {isReading && (
                            <>
                              <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent justify-start gap-2"
                                onClick={togglePause}
                              >
                                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                                {isPaused ? "Resume" : "Pause"}
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent justify-start gap-2"
                                onClick={stopSpeaking}
                              >
                                <Square className="w-4 h-4" />
                                Stop
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Voice Speed */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white text-sm">Voice Speed</Label>
                          <span className="text-sm text-white/50">{(settings.voiceSpeed ?? 1).toFixed(1)}x</span>
                        </div>
                        <Slider
                          value={[settings.voiceSpeed ?? 1]}
                          onValueChange={([value]) => updateSettings({ voiceSpeed: value })}
                          min={0.5}
                          max={2}
                          step={0.1}
                          aria-label="Voice speed slider"
                        />
                        <div className="flex justify-between text-xs text-white/40">
                          <span>Slower</span>
                          <span>Faster</span>
                        </div>
                      </div>

                      {/* Voice Pitch */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-white text-sm">Voice Pitch</Label>
                          <span className="text-sm text-white/50">{(settings.voicePitch ?? 1).toFixed(1)}</span>
                        </div>
                        <Slider
                          value={[settings.voicePitch ?? 1]}
                          onValueChange={([value]) => updateSettings({ voicePitch: value })}
                          min={0.5}
                          max={1.5}
                          step={0.1}
                          aria-label="Voice pitch slider"
                        />
                        <div className="flex justify-between text-xs text-white/40">
                          <span>Lower</span>
                          <span>Higher</span>
                        </div>
                      </div>

                      {/* Voice Selection */}
                      {availableVoices.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-white text-sm">Voice</Label>
                          <select
                            value={selectedVoice}
                            onChange={(e) => setSelectedVoice(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Select voice"
                          >
                            {availableVoices
                              .filter(v => v.lang.startsWith("en"))
                              .map((voice) => (
                                <option key={voice.name} value={voice.name} className="bg-[#0d1117]">
                                  {voice.name} ({voice.lang})
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      {/* Auto-read Options */}
                      <div className="space-y-3">
                        <ToggleOption
                          icon={<MousePointer2 className="w-5 h-5 text-cyan-400" />}
                          label="Read on Focus"
                          description="Automatically read elements when focused"
                          checked={settings.autoReadOnFocus}
                          onCheckedChange={(checked) => updateSettings({ autoReadOnFocus: checked })}
                        />
                      </div>
                    </>
                  )}

                  {/* Keyboard Shortcuts for Voice */}
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm text-blue-300 font-medium mb-2">Voice Shortcuts</p>
                    <ul className="text-xs text-white/60 space-y-1">
                      <li><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/80">Alt + R</kbd> Read entire page</li>
                      <li><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/80">Alt + S</kbd> Read selected text</li>
                      <li><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/80">Esc</kbd> Stop reading</li>
                    </ul>
                  </div>
                </>
              )}

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                onClick={resetSettings}
              >
                Reset to Defaults
              </Button>

              {/* General Keyboard Shortcuts */}
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-sm text-white/70 font-medium mb-2">Keyboard Navigation</p>
                <ul className="text-xs text-white/50 space-y-1">
                  <li><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">Alt + A</kbd> Open/close this panel</li>
                  <li><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">Tab</kbd> Navigate between elements</li>
                  <li><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/70">Enter / Space</kbd> Activate buttons</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Reusable Toggle Option Component
function ToggleOption({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/[0.07] transition-colors">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <Label className="text-white cursor-pointer">{label}</Label>
          <p className="text-xs text-white/50">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={`Toggle ${label}`}
      />
    </div>
  )
}
