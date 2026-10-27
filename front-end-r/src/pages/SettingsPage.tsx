import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { PageHeader } from "../components/page-header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ThemeToggle } from "../components/theme-toggle";
import { useAuth } from "../provider/AuthProvider";
import {
  UserProfileSchema,
  UserPasswordSchema,
  type UserProfileFormData,
  type UserPasswordFormData,
} from "../models/UserSchema";
import useUpdateProfile from "../hooks/user/useUpdateProfile";
import useUpdatePassword from "../hooks/user/useUpdatePassword";

export default function SettingsPage() {
  const { user } = useAuth();
  const profile = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  });
  const password = useForm<UserPasswordFormData>({
    resolver: zodResolver(UserPasswordSchema),
  });
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const { reset } = profile;
  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email });
  }, [user, reset]);
  return (
    <div className="page">
      <PageHeader
        title="Your account, your space"
        description="Keep your details up to date and make yourself at home."
      />
      <div className="page-content settings-layout">
        <section className="settings-section">
          <div className="settings-description">
            <h2>Profile details</h2>
            <p>Your name helps the library team put a face to a book.</p>
            <span className="status-label mt-4">
              {user?.role === "admin"
                ? "Administrator"
                : user?.role === "librarian"
                  ? "Librarian"
                  : "Member"}
            </span>
          </div>
          <form
            className="settings-panel"
            onSubmit={profile.handleSubmit((data) =>
              updateProfile.mutate(data),
            )}
            noValidate
          >
            <div className="field">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                autoComplete="name"
                aria-invalid={!!profile.formState.errors.name}
                {...profile.register("name")}
              />
              {profile.formState.errors.name && (
                <p className="field-error" role="alert">
                  {profile.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="field">
              <Label htmlFor="profile-email">Email address</Label>
              <Input
                id="profile-email"
                type="email"
                autoComplete="email"
                aria-invalid={!!profile.formState.errors.email}
                {...profile.register("email")}
              />
              {profile.formState.errors.email && (
                <p className="field-error" role="alert">
                  {profile.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="settings-save">
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </form>
        </section>
        <section className="settings-section">
          <div className="settings-description">
            <h2>Password & access</h2>
            <p>
              A password just for your library account. Choose 12–72 characters
              you can keep safe.
            </p>
          </div>
          <form
            className="settings-panel"
            onSubmit={password.handleSubmit((data) =>
              updatePassword.mutate(data, {
                onSuccess: () => password.reset(),
              }),
            )}
            noValidate
          >
            <div className="field">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!password.formState.errors.current_password}
                {...password.register("current_password")}
              />
              {password.formState.errors.current_password && (
                <p className="field-error" role="alert">
                  {password.formState.errors.current_password.message}
                </p>
              )}
            </div>
            <div className="field">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!password.formState.errors.new_password}
                {...password.register("new_password")}
              />
              {password.formState.errors.new_password && (
                <p className="field-error" role="alert">
                  {password.formState.errors.new_password.message}
                </p>
              )}
            </div>
            <div className="field">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={
                  !!password.formState.errors.new_password_confirmation
                }
                {...password.register("new_password_confirmation")}
              />
              {password.formState.errors.new_password_confirmation && (
                <p className="field-error" role="alert">
                  {password.formState.errors.new_password_confirmation.message}
                </p>
              )}
            </div>
            <div className="settings-save">
              <Button type="submit" disabled={updatePassword.isPending}>
                {updatePassword.isPending && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {updatePassword.isPending ? "Updating…" : "Update password"}
              </Button>
            </div>
          </form>
        </section>
        <section className="settings-section">
          <div className="settings-description">
            <h2>A comfortable view</h2>
            <p>
              Switch between light and dark whenever you need a gentler light.
            </p>
          </div>
          <div className="settings-panel">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold">Library appearance</span>
              <ThemeToggle />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
