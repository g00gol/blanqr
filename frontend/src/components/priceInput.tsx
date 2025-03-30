import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PriceInput({
  onSubmit,
}: {
  onSubmit: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");

  const presets = [5, 10, 20];

  const handleSelect = (value: number) => {
    setAmount(value.toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    console.log(val);
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setAmount(val);
    }
  };

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      onSubmit(value * 100);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-xl">Enter Amount</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2 justify-center">
          {presets.map((val) => (
            <Button
              key={val}
              variant="outline"
              onClick={() => handleSelect(val)}
              className="flex-1"
            >
              ${val}
            </Button>
          ))}
        </div>

        <Input
          type="number"
          placeholder="Or enter custom amount"
          value={amount}
          onChange={handleChange}
          className="text-center text-lg"
        />

        <Button
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
