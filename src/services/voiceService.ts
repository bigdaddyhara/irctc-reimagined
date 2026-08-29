import type { Language } from '../domain/types'
import { speechLocales } from './languageCatalog'

export type VoiceRecognitionOptions = { language: Language; onTranscript: (transcript: string) => void; onStart?: () => void; onEnd?: () => void; onError?: (error: unknown) => void }
export type VoiceController = { isSupported: boolean; start: () => void; stop: () => void }

export const createVoiceRecognition = (options: VoiceRecognitionOptions): VoiceController => {
  const Recognition = typeof window === 'undefined' ? undefined : window.SpeechRecognition ?? window.webkitSpeechRecognition
  if (!Recognition) return { isSupported: false, start: () => options.onError?.(new Error('Speech recognition is not supported')), stop: () => undefined }
  const recognition = new Recognition()
  recognition.lang = speechLocales[options.language]
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.onstart = options.onStart ?? null
  recognition.onend = options.onEnd ?? null
  recognition.onerror = () => options.onError?.(new Error('Speech recognition failed'))
  recognition.onresult = (event) => options.onTranscript(event.results[0]?.[0]?.transcript ?? '')
  return { isSupported: true, start: () => recognition.start(), stop: () => (recognition as unknown as { stop?: () => void }).stop?.() }
}
