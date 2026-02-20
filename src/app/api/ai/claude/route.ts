import { NextRequest, NextResponse } from 'next/server';

const CLAUDE_API_KEY = 'sk-ant-your-api-key-here'; // Replace with your actual API key

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { prompt, context, gesture } = body as { prompt: string; context: string; gesture: string };

    // Build context-aware system message
    const systemMessage = getSystemMessage(context, gesture);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 300,
        system: systemMessage,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();
    const aiResponse = data.content[0]?.text || 'No response from AI';

    return NextResponse.json({ response: aiResponse, model: 'claude-3.5-haiku' });
  } catch (error) {
    console.error('Claude API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

function getSystemMessage(context: string, gesture: string): string {
  const contextMessages: Record<string, string> = {
    vscode: 'You are an expert coding assistant with deep knowledge of software architecture. Provide thoughtful, detailed insights.',
    cursor: 'You are an elite code reviewer and mentor. Focus on code quality, patterns, and best practices with clear explanations.',
    figma: 'You are a senior UX designer. Provide detailed feedback on design systems, accessibility, and user experience.',
    docs: 'You are a professional editor with expertise in technical writing. Improve clarity, structure, and flow.',
    browser: 'You are a research analyst. Provide comprehensive summaries and critical analysis of web content.'
  };

  const gestureContext: Record<string, string> = {
    rotate: 'Provide a comprehensive overview or summary.',
    'press-drag': 'Break this down with detailed explanations and examples.',
    'long-press': 'Analyze and suggest strategic next steps.',
    'double-tap': 'Identify issues and provide solutions.'
  };

  return `${contextMessages[context] || 'You are a helpful AI assistant.'} ${gestureContext[gesture] || ''}`;
}
