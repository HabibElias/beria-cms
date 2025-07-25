import {
  Edit,
  Loader2Icon,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/page-header";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import useMembers from "../../hooks/members/useMembers";
import { useAuth } from "../../provider/AuthProvider";
import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";
import { DialogHeader, DialogFooter } from "../../components/ui/dialog";
import useDeleteMember from "../../hooks/members/useDeleteMembers";

export default function MembersPage() {
  const { data: members, isLoading } = useMembers();
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending } = useDeleteMember();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library Members"
        description="Manage your berea-cms members"
      >
        <Button asChild>
          <Link to="/members/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Link>
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3/5   transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members by name or email..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              {isLoading ? (
                <div className="w-full">
                  <div>
                    <Skeleton className="h-10 rounded mb-4" />
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-8 rounded mb-2" />
                    ))}
                  </div>
                </div>
              ) : (
                <Table className="overflow-hidden">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Contact
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Member Since
                      </TableHead>
                      <TableHead>Books Out</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members &&
                      members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500 md:hidden">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1" />
                                {member.email}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="h-3 w-3 mr-1" />
                                {member.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {new Date(member.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {member.checkouts.length}
                            </Badge>
                          </TableCell>
                        <TableCell>{member.role[0].toUpperCase()+member.role.slice(1)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="" />
                              </Button>
                              {user?.id !== member.id && (
                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="w-fit justify-start"
                                      variant="ghost"
                                      onClick={() => setOpen(true)}
                                      title="Delete book"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="font-[poppins] w-fit">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Are you absolutely sure?
                                      </DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete member data from our
                                        servers.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose
                                        onClick={() => {
                                          setOpen(false);
                                        }}
                                        asChild
                                      >
                                        <Button
                                          variant={"ghost"}
                                          disabled={isPending}
                                        >
                                          Cancel
                                        </Button>
                                      </DialogClose>
                                      <Button
                                        variant={"destructive"}
                                        disabled={isPending}
                                        onClick={() => {
                                          mutate({ id: member.id });
                                          setOpen(false);
                                        }}
                                      >
                                        {isPending ? (
                                          <Loader2Icon className="animate-spin" />
                                        ) : (
                                          "Continue"
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
