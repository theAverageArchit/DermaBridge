// const SYSTEM_PROMPT = `You are a medical translator. Translate the following clinical text from English to Hindi. Return only the translated text, nothing else. Keep medical terms accurate and use simple Hindi that patients can understand.`

// export async function translateToHindi(text) {
//   const response = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
//       'anthropic-version': '2023-06-01',
//       'anthropic-dangerous-direct-browser-access': 'true',
//     },
//     body: JSON.stringify({
//       model: 'claude-sonnet-4-20250514',
//       max_tokens: 1024,
//       system: SYSTEM_PROMPT,
//       messages: [
//         { role: 'user', content: text }
//       ]
//     })
//   })

//   if (!response.ok) {
//     const err = await response.json()
//     throw new Error(err?.error?.message || 'Translation failed')
//   }

//   const data = await response.json()
//   return data.content[0].text
// }


export async function translateToHindi(text) {
    const encoded = encodeURIComponent(text)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|hi`
    )
  
    if (!response.ok) {
      throw new Error('Translation failed')
    }
  
    const data = await response.json()
  
    if (data.responseStatus !== 200) {
      throw new Error(data.responseMessage || 'Translation failed')
    }
  
    return data.responseData.translatedText
  }