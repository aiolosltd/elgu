// src/services/api/openaiService.ts
export async function fetchOpenAIResponse(prompt: string, maxTokens = 50): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OpenAI API key is missing');
    return 'Error: API key not configured.';
  }

  try {
    // DIRECT CALL - no CORS proxy
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'No response from AI.';
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Check if it's a CORS error and provide specific message
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your connection or use the backend solution.';
    }
    
    return 'Error generating AI response. Using fallback content.';
  }
}