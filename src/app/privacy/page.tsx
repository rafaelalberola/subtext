import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Reveald',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto px-section py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-body text-text-secondary hover:text-text-primary transition-colors min-h-[44px] mb-6"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
          Back
        </Link>

        <h1 className="font-serif text-display text-text-primary mb-8">Privacy Policy</h1>

        <div className="flex flex-col gap-6 text-body text-text-secondary leading-relaxed">
          <p><strong className="text-text-primary">Last updated:</strong> February 2026</p>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle text-text-primary">1. What Reveald Does</h2>
            <p>
              Reveald is a conversation analysis tool that helps you understand the hidden meaning behind messages. You paste or upload a conversation, and our AI analyzes it to reveal subtext, emotional signals, and suggested responses.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle text-text-primary">2. Data We Process</h2>
            <p>
              <strong className="text-text-primary">Conversations:</strong> When you submit a conversation for analysis, the text is sent to our AI provider (Anthropic Claude API) for processing. The conversation text is not stored on our servers. It is processed in real time and discarded after the analysis is complete.
            </p>
            <p>
              <strong className="text-text-primary">Saved readings:</strong> If you choose to save an analysis, we store the analysis result (not the original conversation) in our database so you can access it later. You can delete saved readings at any time.
            </p>
            <p>
              <strong className="text-text-primary">Account data:</strong> When you sign in, we store your email address and authentication tokens via Supabase (our database provider). We support Google OAuth and magic link sign-in.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle text-text-primary">3. Payments</h2>
            <p>
              Payment processing is handled entirely by Stripe. We never see, store, or have access to your credit card number or payment details. Stripe may collect information as described in their privacy policy.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle text-text-primary">4. Analytics</h2>
            <p>
              We use Meta Pixel for conversion tracking to understand how users find and use Reveald. This helps us improve our service. You can opt out of Meta tracking through your browser settings or Meta's ad preferences.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle text-text-primary">5. Third-Party Services</h2>
            <ul className="flex flex-col gap-2 list-disc pl-5">
              <li><strong className="text-text-primary">Anthropic (Claude API):</strong> Processes conversation text for analysis. Data is not retained by Anthropic after processing.</li>
              <li><strong className="text-text-primary">Supabase:</strong> Hosts our database and authentication. Stores account data and saved readings.</li>
              <li><strong className="text-text-primary">Stripe:</strong> Handles payment processing for subscriptions and credit purchases.</li>
              <li><strong className="text-text-primary">Netlify:</strong> Hosts the application.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle text-text-primary">6. Your Rights</h2>
            <p>
              You can delete all your data at any time from the Settings page. This removes all saved readings, people, and preferences. Your account can be deleted by signing out and requesting removal via email.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle text-text-primary">7. Data Security</h2>
            <p>
              All data is transmitted over HTTPS. Authentication is handled via secure OAuth flows and magic links. We follow industry best practices to protect your information.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-subtitle text-text-primary">8. Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us at privacy@reveald.app.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
