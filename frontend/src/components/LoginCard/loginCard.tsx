import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function TextInputField({
  name,
  label,
  type = "text",
  description,
  control,
}: {
  name: keyof LoginFormData;
  label: string;
  type?: string;
  description?: string;
  control: any;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={label} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function LoginCard() {
  const { setIsAuthenticated } = useAuthStore((state) => state);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginFormData) {
    try {
      const res = await fetch("http://localhost:8000/merchant/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        return form.setError("email", {
          message: result.detail,
        });
      }

      console.log("Login success:", result);
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("user", JSON.stringify(result.user));
      setIsAuthenticated();
    } catch (error) {
      console.error("Login error:", error);
      form.setError("root", {
        message: "An error occurred, please try again",
      });
    }
  }

  return (
    <Card className="w-1/2 mx-auto bg-white/50 backdrop-blur-md border border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle>Login to BLANQR</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="flex flex-col space-y-4"
          >
            <TextInputField name="email" label="Email" control={form.control} />
            <TextInputField
              name="password"
              label="Password"
              type="password"
              control={form.control}
            />
            <Button type="submit" className="w-full">
              Log In
            </Button>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
