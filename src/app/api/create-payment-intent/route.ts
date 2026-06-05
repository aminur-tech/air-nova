import { NextResponse } from 'next/server';
import { StripeService } from '@/services/stripe'; // Adjust this import path to match your StripeService file location

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, bookingId } = body;

    // 1. Basic Validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid currency allocation amount contexts." },
        { status: 400 }
      );
    }

    // 2. Interact with your StripeService to generate the PaymentIntent
    // Note: StripeService already handles multiplying the amount by 100 for cents
    const paymentIntent = await StripeService.createPaymentIntent(amount, bookingId);

    // 3. Return the client secret to your frontend page
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Gate Array Processing Failure";
    console.error("Payment Intent Generation Route Error:", error);
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}