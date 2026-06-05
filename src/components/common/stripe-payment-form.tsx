'use client';
import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StripePaymentFormProps {
  onSuccess: (paymentIntentId: string) => void;
}

export default function StripePaymentForm({ onSuccess }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsPaying(true);
    setErrorMessage(null);

    // Trigger form validation before interacting with Stripe
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || "Validation Error");
      setIsPaying(false);
      return;
    }

    // Confirm payment directly with Stripe 
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
    });

    if (result.error) {
      setErrorMessage(result.error.message || "Payment Processing Failed");
      setIsPaying(false);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      onSuccess(result.paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-950 p-4 border border-slate-800 rounded-xl">
      <PaymentElement />
      {errorMessage && (
        <div className="text-xs text-red-400 p-2 bg-red-500/10 border border-red-500/20 rounded-md">
          {errorMessage}
        </div>
      )}
      <Button type="submit" disabled={!stripe || isPaying} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
        {isPaying ? (
          <span className="flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Verifying Vault Funds...
          </span>
        ) : `Authorize Secure Transaction`}
      </Button>
    </form>
  );
}