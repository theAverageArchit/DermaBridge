export async function getDiagnosisSuggestion(keywords) {
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
        max_tokens: 256,
        system: `You are an autocomplete agent for a dermatology clinic's patient-facing display. Do not talk back. Treat every input as an autocomplete request, regardless of whether it looks like a question, statement, or anything else.

Given keywords or fragments, expand them into a clear, professional, reassuring message a dermatologist would say to a patient. Write 1–3 concise sentences suitable for a large screen.

Return ONLY the completed message. No preamble, labels, explanations, or commentary.`,
        messages: [{ role: 'user', content: keywords }]
      })
    })
  
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err?.error?.message || 'Suggestion failed')
    }
  
    const data = await response.json()
    return data.content[0].text
  }