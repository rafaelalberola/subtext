import { AnalysisResult } from '@/types/analysis'
import { SUBTEXT_SYSTEM_PROMPT, TEXT_USER_PROMPT, SCREENSHOT_USER_PROMPT } from './prompts'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const PRIMARY_MODEL = 'claude-sonnet-4-20250514'
const FALLBACK_MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 1500
const TEMPERATURE = 0.7
const MAX_RETRIES = 3
const RETRY_DELAYS = [1000, 3000, 6000] // exponential-ish backoff

interface AnalyzeParams {
  text?: string
  screenshot?: string // base64 data URL
  personContext?: string // context from previous analyses of this person
}

interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: Array<
    | { type: 'text'; text: string }
    | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }
  >
}

export async function analyzeConversation(params: AnalyzeParams): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }

  const userContent: AnthropicMessage['content'] = []

  // Add screenshot if provided
  if (params.screenshot) {
    const [header, data] = params.screenshot.split(',')
    const mediaType = header.match(/data:(.*?);/)?.[1] || 'image/png'

    userContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType,
        data,
      },
    })
    const contextPrefix = params.personContext || ''
    userContent.push({
      type: 'text',
      text: params.text
        ? `${contextPrefix}${SCREENSHOT_USER_PROMPT}\n\nAdditional context from the user: ${params.text}`
        : `${contextPrefix}${SCREENSHOT_USER_PROMPT}`,
    })
  } else if (params.text) {
    userContent.push({
      type: 'text',
      text: `${params.personContext || ''}${TEXT_USER_PROMPT(params.text)}`,
    })
  } else {
    throw new Error('Either text or screenshot must be provided')
  }

  const messages = [{ role: 'user', content: userContent }]

  // Try primary model first, fall back if overloaded
  const response = await fetchWithRetryAndFallback(apiKey, messages)

  // Extract text content from response
  const textContent = response.content.find(
    (block: { type: string }) => block.type === 'text'
  )

  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in API response')
  }

  // Parse JSON from response, handling potential markdown wrapping
  let jsonText = textContent.text.trim()
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }

  const analysis: AnalysisResult = JSON.parse(jsonText)

  // Validate structure
  if (!analysis.decoded_pairs || !analysis.emotional_signals || !analysis.suggested_responses) {
    throw new Error('Invalid analysis structure returned from API')
  }

  return analysis
}

async function fetchWithRetryAndFallback(
  apiKey: string,
  messages: Array<{ role: string; content: AnthropicMessage['content'] }>
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL]

  for (const model of models) {
    const body = {
      model,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: SUBTEXT_SYSTEM_PROMPT,
      messages,
    }

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(ANTHROPIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify(body),
        })

        // Success
        if (res.ok) {
          return res.json()
        }

        // Overloaded, rate limited, or internal server error — retry with backoff, then try fallback model
        if (res.status === 529 || res.status === 429 || res.status === 500) {
          const delay = RETRY_DELAYS[attempt] || 6000
          console.log(`[Subtext] ${model} returned ${res.status}, retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        // Other API error — don't retry, throw immediately
        const errorBody = await res.text()
        throw new Error(`API error (${res.status}): ${errorBody}`)
      } catch (error) {
        // Network error — retry
        if (error instanceof TypeError && attempt < MAX_RETRIES - 1) {
          const delay = RETRY_DELAYS[attempt] || 6000
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
        // Re-throw non-retryable errors
        if (!(error instanceof TypeError)) {
          throw error
        }
      }
    }

    // All retries exhausted for this model, try fallback
    console.log(`[Subtext] All retries exhausted for ${model}, trying next model...`)
  }

  throw new Error('The analysis service is temporarily busy. Please try again in a moment.')
}
