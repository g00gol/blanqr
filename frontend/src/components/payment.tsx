import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

import { Button } from "./ui/button";

import PriceInput from "./priceInput";

export default function Payment() {
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [stripeAccountId, setStripeAccountId] = useState("");
  const [showSTatic, setShowStatic] = useState(false);

  useEffect(() => {
    (async () => {
      const access_token = localStorage.getItem("access_token");
      const res = await fetch("http://localhost:8000/merchant/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.stripe_user_id) {
          setStripeAccountId(result.stripe_user_id);
        } else {
          console.log("Stripe account not linked");
        }
      }
    })();
  }, []);

  const createCheckout = async (amount: number) => {
    const access_token = localStorage.getItem("access_token");
    const res = await fetch(`http://localhost:8000/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        amount: amount,
        stripe_id: stripeAccountId,
      }),
    });
    const data = await res.json();
    setCheckoutUrl(data.url);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      <PriceInput onSubmit={(amount: number) => createCheckout(amount)} />
      <Button
        onClick={() => {
          setShowStatic(!showSTatic);
        }}
      >
        Show static QR
      </Button>
      {showSTatic && (
        <div className="mt-4">
          <QRCodeCanvas
            value="https://buy.stripe.com/test_00geWl3rr9Yv8Ew4gg"
            size={200}
          />
        </div>
      )}
      {checkoutUrl && (
        <div className="mt-4">
          <QRCodeCanvas value={checkoutUrl} size={200} />
          <p className="text-sm text-gray-500 mt-2">
            Scan to pay with GPay / Apple Pay / Card
          </p>
        </div>
      )}
    </div>
  );
}
