import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock, Mail, Store } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAuthStore } from "@/shared/store/useAuthStore";
import { useToast } from "@/shared/components/ui/toast";
import { useLoginMutation } from "@/features/auth/mutations";
import { ApiError } from "@/shared/types/api/response";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toast = useToast();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  React.useEffect(() => {
    if (isAuthenticated)
      navigate((location.state as { from?: string })?.from ?? "/", {
        replace: true,
      });
  }, [isAuthenticated, navigate, location]);

  const onSubmit = (values: LoginValues) => {
    loginMutation.mutate(values, {
      onSuccess: (res) => {
        setSession(res.user, res.access_token, res.refresh_token);
        toast({
          title: "Welcome back!",
          description: "You have signed in successfully.",
          variant: "success",
        });
        navigate((location.state as { from?: string })?.from ?? "/", {
          replace: true,
        });
      },
      onError: (err) => {
        console.log("🚀 ~ onSubmit ~ err:", err);
        const message =
          err instanceof ApiError
            ? err.message
            : "Login failed. Please try again.";
        console.log("🚀 ~ onSubmit ~ message:", message);
        toast({
          title: "Login failed",
          description: message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Store className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">StorePro</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                autoComplete="username"
                {...register("username")}
                className="pl-9"
                placeholder="you@example.com"
              />
            </div>
            {errors.username && (
              <p className="text-xs text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="pl-9"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
