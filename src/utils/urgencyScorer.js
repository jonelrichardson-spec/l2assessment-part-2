/**
 * Urgency Scorer - Signal-based urgency calculation
 * Operates independently of the LLM so results are consistent
 * even when the API is unavailable.
 */

// Normalize message: lowercase, strip punctuation, fix common typos
function normalizeMessage(message) {
  return message
    .toLowerCase()
    .replace(/['']/g, '') // remove apostrophes so "can't" becomes "cant"
    .replace(/[^a-z0-9\s]/g, ' ') // replace remaining punctuation with space
    .replace(/\bacess\b/g, 'access')
    .replace(/\baccont\b/g, 'account')
    .replace(/\brecieve\b/g, 'receive')
    .replace(/\bpayement\b/g, 'payment')
    .replace(/\bpaymnet\b/g, 'payment')
    .replace(/\bloged\b/g, 'logged')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check if message contains any of the given phrases
function containsAny(normalized, phrases) {
  return phrases.some(phrase => normalized.includes(phrase));
}

// Check if message contains ALL of the given phrases
function containsAll(normalized, phrases) {
  return phrases.every(phrase => normalized.includes(phrase));
}

const CRITICAL_SIGNALS = [
  'compromised', 'hacked', 'unauthorized access', 'security breach',
  'data loss', 'data corrupt', 'corrupted', 'breach',
  'outage', 'down for everyone', 'system wide', 'complete outage'
];

const HIGH_ACCESS_SIGNALS = [
  'locked out', 'lock out', 'cant access', 'cannot access',
  'unable to access', 'lost access', 'no access', 'cant log in',
  'cannot log in', 'cant login', 'cant get in', 'blocked from',
  'inaccessible', 'cant get into', 'wont let me in',
  'cant use', 'cannot use', 'unable to use', 'nothing works',
  'completely broken', 'cant do anything'
];

const HIGH_PAYMENT_SIGNALS = [
  'payment failed', 'payment not going through', 'payment didnt go through',
  'charge failed', 'transaction failed', 'card declined',
  'payment not working', 'couldnt charge', 'billing failed',
  'payment unsuccessful', 'payment error'
];

const MEDIUM_BILLING_SIGNALS = [
  'payment', 'billing', 'invoice', 'charge', 'subscription',
  'refund', 'overcharged', 'renewal', 'upgrade', 'pro plan',
  'pricing', 'plan', 'charged twice', 'wrong amount'
];

const MEDIUM_BROKEN_SIGNALS = [
  'not loading', 'keeps loading', 'loading forever', 'wont load',
  'page loading', 'slow', 'error', 'bug', 'broken', 'not working',
  'keeps crashing', 'crash', 'page wont load', 'spinning', 'freezing',
  'frozen', 'not responding', 'taking forever', 'stuck'
];

const LOW_POSITIVE_SIGNALS = [
  'thank you', 'thanks', 'appreciate', 'happy with',
  'love the product', 'great service', 'amazing', 'wonderful',
  'excellent', 'fantastic', 'really happy', 'love your'
];

const LOW_REQUEST_SIGNALS = [
  'feature request', 'would love', 'would like to see', 'suggestion',
  'dark mode', 'wish you had', 'could you add', 'would be great',
  'enhancement', 'idea for', 'requesting a feature'
];

const LOW_INQUIRY_SIGNALS = [
  'how do i', 'how can i', 'what is', 'where can i',
  'is there a way', 'can you help me understand', 'just wanted to ask',
  'quick question', 'wondering if'
];

const NEGATION_CONTEXT = [
  'no problem', 'not a problem', 'no issue', 'not an issue',
  'no longer', 'not broken', 'not slow', 'working now',
  'resolved', 'fixed', 'all good', 'nevermind'
];

/**
 * Calculate urgency based on message content and intent signals.
 * Caps, punctuation, and send time have no bearing on urgency.
 *
 * @param {string} message - The raw customer message
 * @returns {string} - "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
 */
export function calculateUrgency(message) {
  const normalized = normalizeMessage(message);

  // CRITICAL — security or data integrity at risk
  if (containsAny(normalized, CRITICAL_SIGNALS)) {
    return "CRITICAL";
  }

  // HIGH — access blocked OR payment failure (payment failure alone = HIGH for Relay AI)
  if (containsAny(normalized, HIGH_ACCESS_SIGNALS)) {
    return "HIGH";
  }

  if (containsAny(normalized, HIGH_PAYMENT_SIGNALS)) {
    return "HIGH";
  }

  // MEDIUM — billing issue without lockout, or broken feature still accessible
  // Negation acts as tiebreaker: downgrades MEDIUM to LOW if present
  if (containsAny(normalized, MEDIUM_BILLING_SIGNALS)) {
    if (containsAny(normalized, NEGATION_CONTEXT)) {
      return "LOW";
    }
    return "MEDIUM";
  }

  if (containsAny(normalized, MEDIUM_BROKEN_SIGNALS)) {
    if (containsAny(normalized, NEGATION_CONTEXT)) {
      return "LOW";
    }
    return "MEDIUM";
  }

  // LOW — positive feedback, feature requests, general questions
  return "LOW";
}
