import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, LoadError } from "../../components/empty-state";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import useMembers from "../../hooks/members/useMembers";
import useDeleteMember from "../../hooks/members/useDeleteMembers";
import { useCompactLayout } from "../../hooks/useCompactLayout";
import type Member from "../../models/Member";
import { useAuth } from "../../provider/AuthProvider";

export default function MembersPage() {
  const { data: members = [], isLoading, isError, refetch } = useMembers();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);
  const deletion = useDeleteMember();
  const compact = useCompactLayout();
  const filtered = members.filter((member) =>
    `${member.name} ${member.email} ${member.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="page">
      <PageHeader
        title="Our library members"
        description="The people behind every well-read book."
      >
        <Button asChild>
          <Link to="/admin/members/add">
            <Plus size={16} />
            Add a member
          </Link>
        </Button>
      </PageHeader>
      <div className="page-content">
        <div className="collection-toolbar">
          <div className="collection-search">
            <Search size={17} />
            <Input
              aria-label="Search members"
              placeholder="Find a name, email, or phone number…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="collection-summary">
          <p aria-live="polite">
            {isLoading
              ? "Finding your readers…"
              : `${filtered.length} ${filtered.length === 1 ? "member" : "members"}${search ? " found" : " on this page"}`}
          </p>
        </div>
        {isError ? (
          <LoadError onRetry={() => void refetch()} />
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : filtered.length ? (
          compact ? (
            <div className="member-list">
              {filtered.map((member) => (
                <article className="member-card" key={member.id}>
                  <div className="member-name">
                    <span className="user-initials" aria-hidden="true">
                      {member.name
                        .split(/\s+/)
                        .map((word) => word[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-bold">{member.name}</h2>
                      <p className="text-muted-foreground text-sm">
                        {member.email}
                      </p>
                      {member.phone && (
                        <p className="text-muted-foreground text-sm">
                          {member.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 text-sm">
                    <p>
                      <strong className="tabular-nums">
                        {member.checkouts?.length ?? 0}
                      </strong>{" "}
                      books out
                    </p>
                    <span className="status-label">
                      {member.role === "admin"
                        ? "Admin"
                        : member.role === "user"
                          ? "Member"
                          : "Librarian"}
                      {user?.id === member.id ? " · You" : ""}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                    {user?.id === member.id ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/admin/settings">
                          <Edit size={14} />
                          Edit profile
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          aria-label={`Edit ${member.name}`}
                        >
                          <Link to={`/admin/members/${member.id}/edit`}>
                            <Edit size={14} />
                            Edit member
                          </Link>
                        </Button>
                        {user?.role === "admin" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${member.name}`}
                            onClick={() => setSelected(member)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="table-frame">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Contact
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      Member since
                    </TableHead>
                    <TableHead className="text-right">Books out</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="member-name">
                          <span className="user-initials" aria-hidden="true">
                            {member.name
                              .split(/\s+/)
                              .map((word) => word[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <div>
                            <strong>{member.name}</strong>
                            <small className="md:hidden">{member.email}</small>
                            {user?.id === member.id && <small>You</small>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm">{member.email}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {member.phone || "—"}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden xl:table-cell">
                        {new Date(member.created_at).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {member.checkouts?.length ?? 0}
                      </TableCell>
                      <TableCell>
                        <span className="status-label">
                          {member.role === "admin"
                            ? "Admin"
                            : member.role === "user"
                              ? "Member"
                              : "Librarian"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {user?.id === member.id ? (
                            <Button variant="ghost" size="sm" asChild>
                              <Link to="/admin/settings">Edit profile</Link>
                            </Button>
                          ) : (
                            <>
                              <Button
                                asChild
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label={`Edit ${member.name}`}
                                title={`Edit ${member.name}`}
                              >
                                <Link to={`/admin/members/${member.id}/edit`}>
                                  <Edit size={15} />
                                </Link>
                              </Button>
                              {user?.role === "admin" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                  aria-label={`Delete ${member.name}`}
                                  title={`Delete ${member.name}`}
                                  onClick={() => setSelected(member)}
                                >
                                  <Trash2 size={15} />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <EmptyState
            title={
              search ? "No reader by that name" : "A library is a community"
            }
            description={
              search
                ? "Try another name, email address, or phone number."
                : "Welcome your first member so they can start borrowing."
            }
          >
            {search ? (
              <Button variant="outline" onClick={() => setSearch("")}>
                Clear search
              </Button>
            ) : (
              <Button asChild>
                <Link to="/admin/members/add">Add the first member</Link>
              </Button>
            )}
          </EmptyState>
        )}
        <Dialog
          open={!!selected}
          onOpenChange={(open) => {
            if (!open && !deletion.isPending) setSelected(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove {selected?.name}?</DialogTitle>
              <DialogDescription>
                This permanently removes this member’s account. Their checkout
                records may also be removed. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                disabled={deletion.isPending}
                onClick={() => setSelected(null)}
              >
                Keep member
              </Button>
              <Button
                variant="destructive"
                disabled={deletion.isPending}
                onClick={() =>
                  selected &&
                  deletion.mutate(
                    { id: selected.id },
                    { onSuccess: () => setSelected(null) },
                  )
                }
              >
                {deletion.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Delete member"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
