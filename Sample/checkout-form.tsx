// CheckoutForm v2.0 - Added createPaymentMethod support
import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { forwardRef, useImperativeHandle } from 'react';

interface CheckoutFormProps {
  onToken?: (token: string) => void;
  onPaymentMethod?: (paymentMethodId: string) => void;
}

export interface CheckoutFormRef {
  createToken: () => Promise<string | undefined>;
  createPaymentMethod: () => Promise<string | undefined>;
}

const CheckoutForm = forwardRef<CheckoutFormRef, CheckoutFormProps>(({ onToken, onPaymentMethod }, ref) => {
  const stripe = useStripe();
  const elements = useElements();

  // Force rebuild - exposes both createToken and createPaymentMethod methods
  useImperativeHandle(ref, () => {
    const methods = {
      createToken: async () => {
        if (!stripe || !elements) {
          console.error('Stripe.js has not yet loaded.');
          return undefined;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          console.error('CardElement not found.');
          return undefined;
        }

        const { token, error } = await stripe.createToken(cardElement);
        if (error) {
          console.error('[Stripe Token Error]:', error);
          return undefined;
        } else if (token) {
          if (onToken) onToken(token.id);
          return token.id;
        }
      },
      createPaymentMethod: async () => {
        if (!stripe || !elements) {
          console.error('Stripe.js has not yet loaded.');
          return undefined;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          console.error('CardElement not found.');
          return undefined;
        }

        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          console.error('[Stripe PaymentMethod Error]:', error);
          return undefined;
        } else if (paymentMethod) {
          if (onPaymentMethod) onPaymentMethod(paymentMethod.id);
          return paymentMethod.id;
        }
      },
    };
    console.log('CheckoutForm methods registered:', Object.keys(methods));
    return methods;
  }, [stripe, elements, onToken, onPaymentMethod]);

  const elementStyle = {
    base: {
      fontSize: '16px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      color: '#1a1a1a',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#6b7280',
      },
      iconColor: '#6366f1',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  };

  const elementClasses = {
    base: 'p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
    complete: 'border-green-500',
    invalid: 'border-red-500',
    focus: 'ring-2 ring-indigo-500',
  };
  useImperativeHandle(ref, () => ({
    createToken: async () => {
      if (!stripe || !elements) {
        console.error('Stripe.js has not yet loaded.');
        return undefined;
      }

      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) {
        console.error('Card elements not found.');
        return undefined;
      }

      const { token, error } = await stripe.createToken(cardNumber);
      if (error) {
        console.error('[Stripe Token Error]:', error);
        return undefined;
      } else if (token) {
        onToken(token.id);
        return token.id;
      }
    },
  }));
  return (
    <div className="p-6 mb-8 border border-gray-200 rounded-lg shadow-sm bg-white">
      <div className="space-y-6">
        {/* <div className="text-sm text-gray-600 mb-2">Enter your card details</div> */}

        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <CardNumberElement className="rounded-sm" options={{ style: elementStyle, classes: elementClasses }} />
          </div>

          <div className="grid grid-cols-2   gap-4">
            {/* Expiry */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <CardExpiryElement className="rounded-sm" options={{ style: elementStyle, classes: elementClasses }} />
            </div>

            {/* CVV */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <CardCvcElement className="rounded-sm" options={{ style: elementStyle, classes: elementClasses }} />
            </div>
          </div>
        </div>

        <div className="flex items-center mt-4 text-xs text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Your payment info is secure and encrypted
        </div>
      </div>
    </div>
  );
});

export default CheckoutForm;
