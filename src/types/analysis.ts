export interface DecodedPair {
  speaker?: string
  said: string
  meant: string
  confidence: 'very_likely' | 'likely' | 'possible'
}

export interface EmotionalSignal {
  signal: string
  emoji: string
  explanation: string
}

export interface SuggestedResponse {
  tone: 'Direct' | 'Warm' | 'Playful' | 'Professional' | 'Cautious'
  message: string
  why: string
}

export interface AnalysisResult {
  language: 'es' | 'en'
  decoded_pairs: DecodedPair[]
  emotional_signals: EmotionalSignal[]
  suggested_responses: SuggestedResponse[]
  overall_read: string
}

export interface SavedAnalysis {
  id: string
  user_id: string
  input_text: string
  input_type: 'text' | 'screenshot'
  analysis_json: AnalysisResult
  contact_label?: string
  person_id?: string
  language: string
  created_at: string
  updated_at: string
}

export interface Person {
  id: string
  user_id: string
  name: string
  avatar_emoji: string
  notes?: string
  created_at: string
  updated_at: string
}
