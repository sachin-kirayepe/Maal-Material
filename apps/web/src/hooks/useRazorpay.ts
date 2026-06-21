import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount if needed
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async (planName: string, amount: number) => {
    if (!isLoaded) {
      alert('Razorpay SDK is not loaded yet. Please wait.');
      return;
    }

    // Normally you would fetch the Order ID from the backend:
    // const res = await fetch('/api/subscriptions/subscribe', { method: 'POST', body: JSON.stringify({ planName }) });
    // const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_dummy_key', // Replace with your actual Test Key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'ConstructOS',
      description: `Upgrade to ${planName} Plan`,
      image: '/logo.png', // Update with your actual logo
      // order_id: order.id, // Uncomment when connecting to actual backend
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // Optionally send a manual callback to backend or wait for webhook
      },
      prefill: {
        name: 'Demo User',
        email: 'demo@constructos.com',
        contact: '9999999999'
      },
      theme: {
        color: '#2563eb' // Tailwind blue-600
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      alert(`Payment Failed. Reason: ${response.error.description}`);
    });
    rzp.open();
  };

  return { handleCheckout, isLoaded };
}
