import type User from "../models/User";

export function authDestination(user: User, search: string) {
  const next = new URLSearchParams(search).get("next");
  if (
    user.role === "admin" &&
    next &&
    /^\/admin(?:\/[a-z0-9/-]+)?(?:\?[^#]*)?$/.test(next)
  )
    return next;
  // Only local reader destinations can be carried through authentication.
  if (next && /^\/(?:books(?:\/\d+)?|my-loans|account)(?:\?[^#]*)?$/.test(next))
    return next;
  return user.role === "admin" ? "/admin" : "/my-loans";
}

export function authLink(path: "/login" | "/register", search: string) {
  const next = new URLSearchParams(search).get("next");
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}
