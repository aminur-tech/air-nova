import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!stripeSecretKey) console.error("STRIPE_SECRET_KEY is not defined in environment variables.");

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export const StripeService = {
  async createPaymentIntent(amount: number, bookingId?: string) {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { booking_id: bookingId || '' },
    });
  },

  verifyWebhookSignature(body: string, signature: string) {
    try {
      if (!webhookSecret) throw new Error("Stripe webhook secret is missing.");
      
      const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      return { success: true, event };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Webhook Signature Verification Failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }
};