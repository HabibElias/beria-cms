import { BookOpen, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function PublicLayout() {
  const { user, logout, fetchState } = useAuth();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);
  return (
    <div className="public-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="public-masthead">
        <Link to="/" className="public-brand" aria-label="Berea library home">
          <BrandMark size={42} />
          <span>
            <strong>Berea</strong>
            <small>Community library</small>
          </span>
        </Link>
        <nav className="public-nav" aria-label="Library navigation">
          <NavLink
            to="/books"
            className={({ isActive }) =>
              isActive || pathname === "/" ? "is-active" : ""
            }
          >
            Book collection
          </NavLink>
          {user && <NavLink to="/my-loans">My loans & requests</NavLink>}
        </nav>
        <div className="public-tools">
          <ThemeToggle />
          {fetchState === "notReady" ? (
            <span className="text-muted-foreground text-sm">
              Loading account…
            </span>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open reader account menu"
                >
                  <UserRound size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="truncate">
                  {user.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/my-loans">
                    <BookOpen size={16} />
                    My loans & requests
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <UserRound size={16} />
                    My account
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">
                      <LayoutDashboard size={16} />
                      Admin workspace
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void logout()}>
                  <LogOut size={16} />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="public-signin">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Join the library</Link>
              </Button>
            </>
          )}
        </div>
      </header>
      <main className="public-main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="public-footer">
        <span>Berea Church · Addis Ababa</span>
        <span>The Word, held open to everyone.</span>
      </footer>
    </div>
  );
}
