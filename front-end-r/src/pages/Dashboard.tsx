import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { PageHeader } from "../components/page-header";
import { Link } from "react-router-dom";
// import useCategories from "../hooks/useCategories";

export default function Dashboard() {

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your church library system"
      />

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                +8 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Books Checked Out
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">-3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Books
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">7</div>
              <p className="text-xs text-muted-foreground">2 need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Activity - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest book check-outs and returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {"'The Purpose Driven Life'"} returned
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by Sarah Johnson • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {"'Jesus Calling'"} checked out
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by Michael Davis • 4 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {"'Mere Christianity'"} returned
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by Emily Wilson • 6 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {"'The Case for Christ'"} checked out
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by David Brown • 1 day ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-destructive rounded-full mr-3"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {"'Crazy Love'"} is overdue
                      </p>
                      <p className="text-xs text-muted-foreground">
                        by Lisa Anderson • 1 day overdue
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link to="/checkouts">View All Activity</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Popular Books */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Books</CardTitle>
                <CardDescription>Most borrowed this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        The Purpose Driven Life
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rick Warren
                      </p>
                    </div>
                    <Badge variant="secondary">23</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        Jesus Calling
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sarah Young
                      </p>
                    </div>
                    <Badge variant="secondary">19</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        Mere Christianity
                      </p>
                      <p className="text-xs text-muted-foreground">
                        C.S. Lewis
                      </p>
                    </div>
                    <Badge variant="secondary">16</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        The Case for Christ
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Lee Strobel
                      </p>
                    </div>
                    <Badge variant="secondary">14</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Overdue Alert */}
            <Card className="border-destructive/50 dark:border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Overdue Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <p className="font-medium">7 books are overdue</p>
                    <p className="text-muted-foreground">
                      2 members need to be contacted
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link to="/checkouts?filter=overdue">
                      View Overdue Books
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Button asChild className="h-20 flex-col">
                  <Link to="/books/add">
                    <BookOpen className="h-6 w-6 mb-2" />
                    Add Book
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-20 flex-col bg-transparent"
                >
                  <Link to="/checkouts/new">
                    <Calendar className="h-6 w-6 mb-2" />
                    Check Out
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-20 flex-col bg-transparent"
                >
                  <Link to="/members/add">
                    <Users className="h-6 w-6 mb-2" />
                    Add Member
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-20 flex-col bg-transparent"
                >
                  <Link to="/reports">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Reports
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
