import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { PageHeader } from "../components/page-header";
import { Button } from "../components/ui/button";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="page">
      <PageHeader
        title="Your library profile"
        description="A familiar name in a community of readers."
      />
      <div className="page-content">
        <section className="profile-panel">
          <div className="profile-initials" aria-hidden="true">
            {(user?.name ?? "Berea")
              .split(/\s+/)
              .map((word) => word[0])
              .slice(0, 2)
              .join("")}
          </div>
          <h2>{user?.name}</h2>
          <p>
            <Mail size={16} />
            {user?.email}
          </p>
          <p>
            <ShieldCheck size={16} />
            {user?.role === "admin"
              ? "Library administrator"
              : user?.role === "librarian"
                ? "Librarian"
                : "Library member"}
          </p>
          <Button asChild variant="outline">
            <Link to="/admin/settings">
              Edit your details
              <ArrowRight size={15} />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
