import { NextRequest, NextResponse } from 'next/server'
import { analyzeConversation } from '@/lib/claude'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, screenshot, personContext } = body as { text?: string; screenshot?: string; personContext?: string }

    if (!text && !screenshot) {
      return NextResponse.json(
        { error: 'Please provide either text or a screenshot to analyze.' },
        { status: 400 }
      )
    }

    // Validate text length
    if (text && text.length > 5000) {
      return NextResponse.json(
        { error: 'Text is too long. Please keep it under 5,000 characters.' },
        { status: 400 }
      )
    }

    // Validate screenshot size (max ~10MB base64)
    if (screenshot && screenshot.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Screenshot is too large. Please use a smaller image.' },
        { status: 400 }
      )
    }

    const analysis = await analyzeConversation({ text, screenshot, personContext })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)

    const rawMessage =
      error instanceof Error ? error.message : ''

    // Map technical errors to user-friendly messages
    let userMessage: string
    let status: number

    if (rawMessage.includes('temporarily busy') || rawMessage.includes('529') || rawMessage.includes('Overloaded') || rawMessage.includes('Internal server error') || rawMessage.includes('500')) {
      userMessage = 'Our analysis service is busy right now. Please try again in a few seconds.'
      status = 503
    } else if (rawMessage.includes('Rate limited') || rawMessage.includes('429')) {
      userMessage = 'Too many requests. Please wait a moment and try again.'
      status = 429
    } else if (rawMessage.includes('credit balance') || rawMessage.includes('billing')) {
      userMessage = 'Service temporarily unavailable. Please try again later.'
      status = 503
    } else if (rawMessage.includes('ANTHROPIC_API_KEY')) {
      userMessage = 'Service not configured. Please contact support.'
      status = 500
    } else {
      userMessage = 'Something went wrong. Please try again.'
      status = 500
    }

    return NextResponse.json({ error: userMessage }, { status })
  }
}
