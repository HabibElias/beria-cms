import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { BrandMark } from "../components/brand-mark";
import { ThemeToggle } from "../components/theme-toggle";
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
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const { login, fetchState } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const pending = fetchState === "logging" || isSubmitting;
  return (
    <main className="auth-layout">
      <section className="auth-brand" aria-label="Berea community library">
        <Link to="/login" className="auth-brand-name">
          <BrandMark size={50} />
          <span>
            Berea<span>Community library</span>
          </span>
        </Link>
        <div className="auth-brand-story">
          <span className="brand-rule" />
          <h2>
            The Word,
            <br />
            held open.
          </h2>
          <p>
            A shared collection.
            <br />A community of readers.
            <br />A little care that goes a long way.
          </p>
          <div className="auth-brand-note">
            <span>
              Rooted in the Word.
              <br />
              Shared with everyone.
            </span>
          </div>
        </div>
        <p className="auth-place">
          Berea Church <span>·</span> Addis Ababa
        </p>
      </section>
      <section className="auth-form-panel">
        <div className="auth-tools">
          <ThemeToggle />
        </div>
        <div className="auth-form-content">
          <div className="mobile-auth-brand">
            <BrandMark size={52} />
            <span>Berea library</span>
          </div>
          <h1>Welcome back.</h1>
          <p className="auth-intro">
            A new chapter starts here. Sign in to your library.
          </p>
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
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
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
          <details className="demo-credentials">
            <summary>
              Demo credentials
              <ChevronDown size={14} />
            </summary>
            <div>
              <p>
                <span>Email</span>
                <strong>admin@church.com</strong>
              </p>
              <p>
                <span>Password</span>
                <strong>password1234</strong>
              </p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={pending}
                onClick={() => {
                  setValue("email", "admin@church.com");
                  setValue("password", "password1234");
                  setFocus("email");
                }}
              >
                Use demo details
                <ArrowRight size={14} />
              </Button>
            </div>
          </details>
        </div>
        <footer className="auth-footer">
          Made for our community. Cared for together.
        </footer>
      </section>
    </main>
  );
}
