import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function UserMenu() {
  const { user, logout } = useAuth();
  const initials = (user?.name ?? "Berea")
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="user-menu" aria-label="Open account menu">
          <span className="user-initials">{initials}</span>
          <span className="user-description">
            <strong>{user?.name ?? "Library member"}</strong>
            <span>
              {user?.role === "admin"
                ? "Administrator"
                : user?.role === "librarian"
                  ? "Librarian"
                  : "Member"}
            </span>
          </span>
          <ChevronsUpDown size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="truncate">
          {user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/admin/profile">
            <User size={16} />
            Your profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/admin/settings">
            <Settings size={16} />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void logout()}
          className="text-destructive"
        >
          <LogOut size={16} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
