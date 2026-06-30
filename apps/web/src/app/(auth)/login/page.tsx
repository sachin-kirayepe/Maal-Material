"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  ShieldAlert as ShieldAlertIcon,
  CheckCircle as CheckCircleIcon,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";
const Mail = MailIcon as any;
const Lock = LockIcon as any;
const ShieldAlert = ShieldAlertIcon as any;
const CheckCircle = CheckCircleIcon as any;
const ArrowRight = ArrowRightIcon as any;
import { useAuthStore } from "../../../stores/authStore";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@constructos/ui";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid business email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@constructos.com",
      password: "Admin123!",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      // Connect to secure back-end authentication controller
      await login(data.email, data.password);
      setServerSuccess(true);

      // Phase 1 & 2: Role-Based Routing
      // The authStore.login returns user object or we can get it from state shortly after
      // We will read from the updated authStore state using a small timeout or returning it from login()
      // Let's assume login() populates the store immediately
      setTimeout(() => {
        const currentUser = useAuthStore.getState().user;
        const roleName = currentUser?.role?.name || "";
        
        if (roleName === "LOCAL_BUYER") {
          router.push("/marketplace");
        } else if (roleName === "SHOP_OWNER" || roleName === "SUPPLIER") {
          router.push("/smb-dashboard");
        } else if (roleName === "CONTRACTOR") {
          router.push("/projects");
        } else if (roleName === "MACHINE_OWNER") {
          router.push("/equipment");
        } else {
          // Default Enterprise/Admin routing
          router.push("/");
        }
      }, 100);

    } catch (err: any) {
      setServerError(err.message || "Authentication failed. Contact system administrator.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-slate-800/80 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-1.5 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Secure Terminal Sign In
        </CardTitle>
        <CardDescription className="text-slate-400">
          Enter credentials to authorize Maal-Material operations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Status Alerts */}
        {serverError && (
          <div className="flex items-start gap-3 p-3.5 mb-6 text-sm rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authorization Denied</p>
              <p className="text-xs text-rose-400/90 mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {serverSuccess && (
          <div className="flex items-start gap-3 p-3.5 mb-6 text-sm rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Terminal Authorized</p>
              <p className="text-xs text-emerald-400/90 mt-0.5">Hydrating session profiles...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Business Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                {...register("email")}
                type="email"
                placeholder="name@constructos.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.email && (
              <span className="text-xs font-medium text-rose-500">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Security Access Key
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.password && (
              <span className="text-xs font-medium text-rose-500">{errors.password.message}</span>
            )}
          </div>

          {/* Seed hint box */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] leading-relaxed text-slate-400/90 font-mono">
            <span className="text-amber-500 font-bold block mb-0.5">DEV WORKSPACE HYDRATION:</span>
            Default seed credentials pre-filled for immediate architectural review.
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || serverSuccess}
            className="w-full py-6 mt-4 flex items-center justify-center gap-2 group"
          >
            {isSubmitting
              ? "Authenticating..."
              : serverSuccess
                ? "Redirecting..."
                : "Access Control Gate"}
            {!isSubmitting && !serverSuccess && (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
