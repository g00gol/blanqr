import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
      return (
        regex.test(val) ||
        "Password must contain at least one letter, one number, and one special character"
      );
    }),
});

const fields: {
  name: keyof z.infer<typeof formSchema>;
  label: string;
  type?: string;
  description?: string;
}[] = [
  { name: "email", label: "Email" },
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  {
    name: "password",
    label: "Password",
    type: "password",
    description:
      "Password must be at least 8 characters long, contain at least one letter, one number, and one special character",
  },
];

function TextInputField({
  name,
  label,
  type = "text",
  description,
  control,
}: {
  name: string;
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

export default function SignUpCard() {
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  async function handleSignUp(data: any) {
    try {
      const res = await fetch("http://localhost:8000/merchant/signup", {
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

      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      // set error on form
      form.setError("email", {
        message: "An error occurred. Please try again.",
      });
    }
  }

  return (
    <Card className="w-1/2 mx-auto bg-white/50 backdrop-blur-md border border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle>Join BLANQR</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className="flex flex-col space-y-4"
          >
            {fields.map((field) => (
              <TextInputField
                key={field.name}
                {...field}
                control={form.control}
              />
            ))}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Log In
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
