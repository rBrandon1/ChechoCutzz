import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import * as z from "zod";

const FormSchema = z.object({
  email: z
    .string()
    .email()
    .refine(
      (email) =>
        /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net|org)$/.test(
          email
        ),
      {
        message: "Email must have a valid domain.",
      }
    ),
  password: z.string().min(6, {
    message: "Password is required.",
  }),
});

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast({
          title: "Successfully signed in.",
          description: `Welcome, ${responseData.user.firstName}!`,
        });
        window.location.href = response.headers.get("Location") || "/";
      } else {
        toast({
          title: "Sign in failed.",
          variant: "destructive",
          description: responseData.error || "An unexpected error occurred.",
        });
      }
    } catch (error) {
      toast({
        title: "Sign in failed.",
        variant: "destructive",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="example@gmail.com"
                  {...field}
                  type="email"
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="password"
                    {...field}
                    type={showPassword ? "text" : "password"}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeIcon
                      className={
                        showPassword ? "text-white" : "text-muted-foreground"
                      }
                    />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full flex gap-2 text-secondary"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
          <AiOutlineLoading3Quarters
            className={cn("animate-spin", { hidden: !isLoading })}
          />
        </Button>
      </form>
    </Form>
  );
}
