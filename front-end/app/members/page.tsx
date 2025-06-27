import { Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"

const members = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    memberSince: "2023-01-15",
    booksCheckedOut: 2,
    status: "Active",
  },
  {
    id: 2,
    name: "Michael Davis",
    email: "michael.davis@email.com",
    phone: "(555) 234-5678",
    memberSince: "2023-03-22",
    booksCheckedOut: 1,
    status: "Active",
  },
  {
    id: 3,
    name: "Emily Wilson",
    email: "emily.wilson@email.com",
    phone: "(555) 345-6789",
    memberSince: "2022-11-08",
    booksCheckedOut: 0,
    status: "Active",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "(555) 456-7890",
    memberSince: "2023-05-12",
    booksCheckedOut: 3,
    status: "Active",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "(555) 567-8901",
    memberSince: "2023-02-28",
    booksCheckedOut: 1,
    status: "Inactive",
  },
]

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Library Members" description="Manage your church library members">
        <Button asChild>
          <Link href="/members/add">
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search members by name or email..." className="pl-10" />
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden sm:table-cell">Member Since</TableHead>
                    <TableHead>Books Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
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
                        {new Date(member.memberSince).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.booksCheckedOut}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
