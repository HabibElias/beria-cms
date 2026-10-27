import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";
import { BrandMark } from "./brand-mark";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Sidebar />
      <header className="workspace-header">
        <Link to="/" className="mobile-workspace-brand" aria-label="Berea Library home"><BrandMark size={32} /></Link>
        <p className="workspace-name">
          Berea <span>/</span> <span>Library workspace</span>
        </p>
        <form
          className="global-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/books?q=${encodeURIComponent(query.trim())}`);
          }}
        >
          <Search size={17} aria-hidden="true" />
          <input
            ref={search}
            aria-label="Search the library"
            placeholder="Find a book…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd>Ctrl K</kbd>
        </form>
        <div className="header-tools">
          <ThemeToggle />
        </div>
      </header>
      <main id="main-content" className="workspace" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
