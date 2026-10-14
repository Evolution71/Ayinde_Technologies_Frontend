import { loadStripe } from '@stripe/stripe-js';

const publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY?.trim();

if (!publishableKey) {
  console.error('REACT_APP_STRIPE_PUBLISHABLE_KEY is not set. Card payments are disabled.');
}

// Resolves to null when the key is missing, which disables the card form
export const stripePromise = publishableKey ? loadStripe(publishableKey) : Promise.resolve(null);