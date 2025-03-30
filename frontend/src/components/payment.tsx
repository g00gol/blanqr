import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Payment() {
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [stripeAccountId, setStripeAccountId] = useState("");

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

  const createCheckout = async () => {
    const access_token = localStorage.getItem("access_token");
    const res = await fetch(`http://localhost:8000/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ amount: 500, stripe_id: stripeAccountId }),
    });
    const data = await res.json();
    setCheckoutUrl(data.url);
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      <button
        onClick={createCheckout}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate QR
      </button>

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
