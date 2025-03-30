import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function StripeLinkedPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const account_id = searchParams.get("account_id");

  useEffect(() => {
    if (!account_id) {
      navigate("/dashboard");
    }

    (async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        const res = await fetch("http://localhost:8000/merchant/link_stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({ account_id }),
        });

        if (res.ok) {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [account_id, navigate]);

  return (
    <>
      <h1>Stripe Linked</h1>
    </>
  );
}
