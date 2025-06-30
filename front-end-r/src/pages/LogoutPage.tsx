"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, LogOut } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      // Simulate logout process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear authentication data
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("rememberMe");

      setIsLoggingOut(false);
      setIsLoggedOut(true);
    };

    handleLogout();
  }, []);

  const handleReturnToLogin = () => {
    navigate("/login");
  };

  const handleGoToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Berea-CMS
          </h2>
          <div className="mt-4 flex justify-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Logout Status */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isLoggingOut ? (
                <LogOut className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-pulse" />
              ) : (
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              )}
            </div>
            <CardTitle>
              {isLoggingOut ? "Signing Out..." : "Successfully Signed Out"}
            </CardTitle>
            <CardDescription>
              {isLoggingOut
                ? "Please wait while we securely sign you out of your account."
                : "You have been successfully signed out of the library management system."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoggingOut ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Clearing session data...
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Securing your account...
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Finalizing logout...
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Your session has been terminated securely.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleReturnToLogin} className="w-full">
                    Sign In Again
                  </Button>
                  <Button
                    onClick={handleGoToDashboard}
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Return to Dashboard
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Thank you for using the Church Library Management System
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        {isLoggedOut && (
          <Card className="border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Security Reminder
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  For your security, always sign out when using shared computers
                  or devices.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Grace Community Church. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
