const synth = window.speechSynthesis

export function speak(text, lang = 'en') {
  // Cancel any ongoing speech
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
  utterance.rate = 0.9   // slightly slower for clarity
  utterance.pitch = 1
  utterance.volume = 1

  synth.speak(utterance)
}

export function stopSpeaking() {
  synth.cancel()
}

export function isSpeaking() {
  return synth.speaking
}