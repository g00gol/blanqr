import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Payment() {
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const createCheckout = async () => {
    const res = await fetch("http://localhost:8000/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ amount: 500 }),
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
