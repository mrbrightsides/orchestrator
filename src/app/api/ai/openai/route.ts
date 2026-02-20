import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = 'sk-proj-your-api-key-here'; // Replace with your actual OpenAI API key

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { prompt, context, gesture } = body as { prompt: string; context: string; gesture: string };

    // Build context-aware system message
    const systemMessage = getSystemMessage(context, gesture);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'No response from AI';

    return NextResponse.json({ response: aiResponse, model: 'openai-gpt4' });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

function getSystemMessage(context: string, gesture: string): string {
  const contextMessages: Record<string, string> = {
    vscode: 'You are an expert coding assistant helping developers in VS Code. Provide clear, concise, and actionable insights.',
    cursor: 'You are an AI pair programmer working in Cursor IDE. Focus on code quality, best practices, and thoughtful suggestions.',
    figma: 'You are a design assistant helping with Figma projects. Provide UX feedback and design recommendations.',
    docs: 'You are a writing assistant for document editing. Help improve clarity, grammar, and structure.',
    browser: 'You are a research assistant helping users browse the web. Summarize content and provide insights.'
  };

  const gestureContext: Record<string, string> = {
    rotate: 'Summarize or provide an overview.',
    'press-drag': 'Explain in simple terms.',
    'long-press': 'Suggest next actions or improvements.',
    'double-tap': 'Fix or optimize.'
  };

  return `${contextMessages[context] || 'You are a helpful AI assistant.'} ${gestureContext[gesture] || ''}`;
}
