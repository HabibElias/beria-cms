"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, LayoutDashboard, Users, Calendar, BarChart3, Settings, Menu, X, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Members", href: "/members", icon: Users },
  { name: "Check-outs", href: "/checkouts", icon: Calendar },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

const quickActions = [
  { name: "Add Book", href: "/books/add", icon: Plus },
  { name: "New Checkout", href: "/checkouts/new", icon: Calendar },
  { name: "Find Member", href: "/members", icon: Search },
]

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-lg font-semibold">Church Library</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <SidebarContent pathname={pathname} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-background border-r shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-lg font-semibold">Church Library</span>
            </div>
            <ThemeToggle />
          </div>
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-background border-b shadow-sm">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="ml-2 text-lg font-semibold">Church Library</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-muted-foreground group-hover:text-accent-foreground",
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-2 py-4 border-t">
        <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Quick Actions
        </h3>
        <div className="space-y-1">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="group flex items-center px-2 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <action.icon className="mr-3 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-accent-foreground" />
              {action.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 border-t">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium">Grace Community Church</p>
          <p>Library Management System</p>
        </div>
      </div>
    </div>
  )
}
