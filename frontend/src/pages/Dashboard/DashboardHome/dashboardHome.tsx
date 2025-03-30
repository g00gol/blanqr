import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);

  async function handleStripeConnect() {
    setLoading(true);
    const access_token = localStorage.getItem("access_token");

    const res = await fetch(`http://localhost:8000/merchant/link_stripe`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const result = await res.json();
    window.location.href = result.url;
  }

  return (
    <Button disabled={loading} variant="default" onClick={handleStripeConnect}>
      {loading && <Loader2 className="animate-spin" />}
      Connect to Stripe
    </Button>
  );
}
