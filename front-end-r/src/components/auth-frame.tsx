import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";

export function AuthFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="auth-layout">
      <section className="auth-brand" aria-label="Berea community library">
        <Link to="/" className="auth-brand-name">
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
          <Link
            to="/"
            className="text-muted-foreground text-sm hover:underline"
          >
            Browse books
          </Link>
          <ThemeToggle />
        </div>
        <div className="auth-form-content">
          <Link to="/" className="mobile-auth-brand">
            <BrandMark size={52} />
            <span>Berea library</span>
          </Link>
          <h1>{title}</h1>
          <p className="auth-intro">{description}</p>
          {children}
        </div>
        <footer className="auth-footer">
          Made for our community. Cared for together.
        </footer>
      </section>
    </main>
  );
}
