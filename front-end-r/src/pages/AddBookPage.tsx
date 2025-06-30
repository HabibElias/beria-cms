import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { PageHeader } from "../components/page-header";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AddBookPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Book"
        description="Add a new book to your berea-cms collection"
      >
        <Button variant="outline" asChild>
          <Link to="/books">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </Button>
      </PageHeader>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Book Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" placeholder="Enter book title" />
                  </div>
                  <div>
                    <Label htmlFor="author">Author *</Label>
                    <Input id="author" placeholder="Enter author name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input id="isbn" placeholder="978-0000000000" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="christian-living">
                          Christian Living
                        </SelectItem>
                        <SelectItem value="devotional">Devotional</SelectItem>
                        <SelectItem value="apologetics">Apologetics</SelectItem>
                        <SelectItem value="theology">Theology</SelectItem>
                        <SelectItem value="biography">Biography</SelectItem>
                        <SelectItem value="youth">Youth</SelectItem>
                        <SelectItem value="children">Children</SelectItem>
                        <SelectItem value="marriage-family">
                          Marriage & Family
                        </SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="bible-study">Bible Study</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input id="publisher" placeholder="Publisher name" />
                  </div>
                  <div>
                    <Label htmlFor="publication-year">Publication Year</Label>
                    <Input
                      id="publication-year"
                      placeholder="2024"
                      type="number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pages">Pages</Label>
                    <Input
                      id="pages"
                      placeholder="Number of pages"
                      type="number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="location">Shelf Location *</Label>
                    <Input id="location" placeholder="e.g., A-12, B-05" />
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the book (optional)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any internal notes about the book (optional)"
                    rows={2}
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
                  <Button variant="outline" asChild>
                    <Link to="/books">Cancel</Link>
                  </Button>
                  <Button type="submit">Add Book</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
