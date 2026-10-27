import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { AuthFrame } from "../components/auth-frame";
import { authLink } from "../lib/auth-destination";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../provider/AuthProvider";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(6, "Enter your password (at least 6 characters).")
    .max(255),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const { login, fetchState } = useAuth();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const pending = fetchState === "logging" || isSubmitting;
  return (
    <AuthFrame
      title="Welcome back."
      description="Sign in to request a book or care for the library."
    >
      <form
        onSubmit={handleSubmit(async ({ email, password }) => {
          await login(email, password);
        })}
        className="auth-form"
        noValidate
      >
        <div className="field">
          <Label htmlFor="email">Email address</Label>
          <div className="input-with-icon">
            <Mail size={17} aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="field-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="field">
          <Label htmlFor="password">Password</Label>
          <div className="password-field">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="field-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="auth-help">
          <Link to="/forgot-password">Need help signing in?</Link>
        </div>
        <Button
          type="submit"
          size="lg"
          className="auth-submit"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      </form>

      <p className="auth-switch">
        New to the library?{" "}
        <Link to={authLink("/register", location.search)}>
          Create an account
        </Link>
      </p>
    </AuthFrame>
  );
}
