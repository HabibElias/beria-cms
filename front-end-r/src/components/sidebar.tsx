import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Plus,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import type Book from "../models/Book";
import { BrandMark } from "./brand-mark";
import { CheckoutForm } from "./BooksPage/CheckoutForm";
import { UserMenu } from "./user-menu";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Book collection", href: "/books", icon: BookOpen },
  { name: "Members", href: "/members", icon: Users },
  { name: "Checkouts & returns", href: "/checkouts", icon: CalendarDays },
  { name: "Categories", href: "/categories", icon: FolderOpen },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

function SidebarContent({ close }: { close?: () => void }) {
  const { user } = useAuth();
  return (
    <>
      <Link to="/" className="sidebar-brand" onClick={close}>
        <BrandMark size={45} />
        <span>
          <strong>Berea</strong>
          <span>Community library</span>
        </span>
      </Link>
      <div className="sidebar-body">
        <p className="nav-heading">Your library</p>
        <nav aria-label="Main navigation" className="sidebar-nav">
          {navigation.map(({ name, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              end={href === "/"}
              onClick={close}
              className={({ isActive }) =>
                isActive ? "nav-link is-active" : "nav-link"
              }
            >
              <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
        {user?.role === "admin" && (
          <div className="sidebar-shortcut">
            <p className="nav-heading">A little library care</p>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link to="/books/add" onClick={close}>
                <Plus size={16} />
                Add a book
              </Link>
            </Button>
          </div>
        )}
        <div className="sidebar-message">
          <span className="brand-rule" />
          <p>
            The Word,
            <br />
            held open.
          </p>
          <span>Berea Church · Addis Ababa</span>
        </div>
      </div>
      <div className="sidebar-footer">
        <NavLink
          to="/settings"
          onClick={close}
          className={({ isActive }) =>
            isActive ? "nav-link is-active" : "nav-link"
          }
        >
          <Settings size={18} strokeWidth={1.7} />
          Settings
        </NavLink>
        <UserMenu />
      </div>
    </>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <>
      <aside className="desktop-sidebar">
        <SidebarContent />
      </aside>
      <div className="mobile-navigation">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <Menu size={22} />
            </Button>
          </DialogTrigger>
          <DialogContent className="mobile-sidebar" showCloseButton={false}>
            <DialogHeader className="sr-only">
              <DialogTitle>Library navigation</DialogTitle>
              <DialogDescription>
                Find your way around the Berea library.
              </DialogDescription>
            </DialogHeader>
            <Button
              className="mobile-close"
              variant="ghost"
              size="icon"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </Button>
            <SidebarContent close={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export function CheckoutBookDialog({
  book,
  childButton,
}: {
  book?: Book;
  childButton?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {childButton ?? (
          <Button>
            <Plus size={16} />
            New checkout
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Find a book its next reader</DialogTitle>
          <DialogDescription>
            Choose a book, its reader, and when it should come home.
          </DialogDescription>
        </DialogHeader>
        <CheckoutForm
          bookId={book?.id}
          bookTittle={book?.title}
          userId={user?.id}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
