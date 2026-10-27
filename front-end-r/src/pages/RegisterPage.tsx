import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { AuthFrame } from "../components/auth-frame";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { authLink } from "../lib/auth-destination";
import { useAuth } from "../provider/AuthProvider";

const schema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Enter your full name (at least 3 characters).")
      .max(255),
    email: z.string().trim().email("Enter a valid email address.").max(255),
    phone: z
      .string()
      .trim()
      .min(10, "Enter a phone number with at least 10 characters.")
      .max(30),
    password: z
      .string()
      .min(12, "Use at least 12 characters.")
      .max(72, "Use at most 72 characters.")
      .refine(
        (value) => new TextEncoder().encode(value).length <= 72,
        "Password is too long. Please use a shorter password.",
      ),
    password_confirmation: z.string(),
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "Your passwords don’t match.",
    path: ["password_confirmation"],
  });

export default function RegisterPage() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { registerAccount, fetchState } = useAuth();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const pending = fetchState === "registering" || form.formState.isSubmitting;
  return (
    <AuthFrame
      title="A place for every reader."
      description="Create your account to request books and follow their journey with you."
    >
      <form
        className="auth-form registration-form"
        noValidate
        onSubmit={form.handleSubmit(registerAccount)}
      >
        {(
          [
            ["name", "Full name", "text", "name"],
            ["email", "Email address", "email", "email"],
            ["phone", "Phone number", "tel", "tel"],
          ] as const
        ).map(([name, label, type, autoComplete]) => (
          <div className="field" key={name}>
            <Label htmlFor={`register-${name}`}>{label}</Label>
            <Input
              id={`register-${name}`}
              type={type}
              autoComplete={autoComplete}
              aria-invalid={!!form.formState.errors[name]}
              aria-describedby={
                form.formState.errors[name]
                  ? `register-${name}-error`
                  : undefined
              }
              {...form.register(name)}
            />
            {form.formState.errors[name] && (
              <p
                role="alert"
                className="field-error"
                id={`register-${name}-error`}
              >
                {form.formState.errors[name].message}
              </p>
            )}
          </div>
        ))}
        <div className="field">
          <Label htmlFor="register-password">Password</Label>
          <div className="password-field">
            <Input
              id="register-password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={!!form.formState.errors.password}
              aria-describedby="register-password-help register-password-error"
              {...form.register("password")}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p
            id="register-password-help"
            className="text-muted-foreground text-xs"
          >
            Use 12–72 characters.
          </p>
          {form.formState.errors.password && (
            <p
              id="register-password-error"
              className="field-error"
              role="alert"
            >
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <div className="field">
          <Label htmlFor="register-confirmation">Confirm password</Label>
          <Input
            id="register-confirmation"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={!!form.formState.errors.password_confirmation}
            aria-describedby={
              form.formState.errors.password_confirmation
                ? "confirmation-error"
                : undefined
            }
            {...form.register("password_confirmation")}
          />
          {form.formState.errors.password_confirmation && (
            <p id="confirmation-error" className="field-error" role="alert">
              {form.formState.errors.password_confirmation.message}
            </p>
          )}
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
              Creating account…
              <Loader2 size={18} className="animate-spin" />
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      </form>
      <p className="auth-switch">
        Already a member?{" "}
        <Link to={authLink("/login", location.search)}>Sign in</Link>
      </p>
    </AuthFrame>
  );
}
