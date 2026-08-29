import { describe, expect, it, vi } from 'vitest'
import { createVoiceRecognition } from './voiceService'

describe('voice recognition adapter', () => {
  it('uses the selected language locale and returns a final transcript', () => {
    class FakeRecognition { static latest: FakeRecognition; lang = ''; onresult?: (event: unknown) => void; start = vi.fn(); constructor() { FakeRecognition.latest = this } }
    vi.stubGlobal('SpeechRecognition', FakeRecognition)
    const transcript = vi.fn()
    const controller = createVoiceRecognition({ language: 'hindi', onTranscript: transcript })
    expect(controller.isSupported).toBe(true)
    controller.start()
    expect(FakeRecognition.latest.lang).toBe('hi-IN')
    FakeRecognition.latest.onresult?.({ results: [[{ transcript: 'Mumbai se Pune' }]] })
    expect(transcript).toHaveBeenCalledWith('Mumbai se Pune')
    vi.unstubAllGlobals()
  })
})
