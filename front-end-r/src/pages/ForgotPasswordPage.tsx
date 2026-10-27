import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "../components/brand-mark";
import { ThemeToggle } from "../components/theme-toggle";
import { Button } from "../components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <main className="account-help">
      <div className="account-help-theme">
        <ThemeToggle />
      </div>
      <div>
        <BrandMark size={64} />
        <h1>A little help getting back in.</h1>
        <p>
          If you’ve forgotten your password, contact your Berea library
          administrator. They can help you restore access to your account.
        </p>
        <p>
          Already signed in on another device? You can change your password in
          account settings.
        </p>
        <Button asChild>
          <Link to="/login">
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </Button>
      </div>
    </main>
  );
}
