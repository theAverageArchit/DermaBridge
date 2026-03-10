export async function translateToHindi(text) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You are a medical translator for a dermatology clinic. A doctor is communicating with a patient via a screen.
  
  Translate the given English text to Hindi. Follow these rules:
  - Return ONLY the translated Hindi text, nothing else
  - Keep medical terms accurate and use simple Hindi patients can understand
  - For greetings and simple conversational phrases (like "Hi", "Hello", "How are you", "Please sit"), translate them naturally and warmly
  - For clinical sentences, use clear and reassuring language
  - Never add explanations, notes, or anything beyond the translation itself`,
        messages: [{ role: 'user', content: text }]
      })
    })
  
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err?.error?.message || 'Translation failed')
    }
  
    const data = await response.json()
    return data.content[0].text
  }