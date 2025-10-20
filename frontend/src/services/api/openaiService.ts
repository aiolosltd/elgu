export async function fetchOpenAIResponse(prompt: string, maxTokens = 50): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) return 'Missing API key.';

  try {
    // Use CORS proxy
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://api.openai.com/v1/chat/completions';
    
    const res = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || 'No response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Error generating response.';
  }
}