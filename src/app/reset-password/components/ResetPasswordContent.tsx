"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { CheckCircle, AlertCircle, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const passwordsMatch = password === confirmPassword;
  const isFormValid = password && confirmPassword && passwordsMatch && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsSuccess(true);
        addToast({
          title: "Password Reset Successful!",
          description: "Your password has been successfully updated.",
          color: "success",
          icon: <CheckCircle className="w-5 h-5" />,
        });
        
        // Redirect after 3s
        setTimeout(() => router.push("/login"), 3000);
      } else {
        addToast({
          title: "Reset Failed",
          description: data.message || "Failed to reset password. The link may have expired.",
          color: "danger",
          icon: <AlertCircle className="w-5 h-5" />,
        });
      }
    } catch (error) {
      addToast({
        title: "Network Error",
        description: "Please check your internet connection and try again.",
        color: "warning",
        icon: <AlertCircle className="w-5 h-5" />,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl">
            <CardBody className="text-center p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-success-600" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-3"
              >
                Password Updated!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                Your password has been successfully reset. Redirecting you to login...
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-full bg-gray-200 rounded-full h-2"
              >
                <motion.div
                  className="bg-success-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </motion.div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-xl">
          <CardBody className="p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create New Password
              </h1>
              <p className="text-gray-600 text-sm">
                Enter your new password below
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  label="New Password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  }
                  isRequired
                  description="Password must be at least 8 characters long"
                  className="w-full"
                />

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  }
                  isRequired
                  className="w-full"
                  color={confirmPassword ? (passwordsMatch ? "success" : "danger") : "default"}
                  description={
                    confirmPassword && !passwordsMatch ? (
                      <span className="text-danger-500">Passwords do not match</span>
                    ) : confirmPassword && passwordsMatch ? (
                      <span className="text-success-500">Passwords match</span>
                    ) : null
                  }
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <Button
                  type="submit"
                  color="primary"
                  isDisabled={!isFormValid || loading}
                  className="w-full font-medium h-12 text-base"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" color="white" />
                      Updating Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <Button
                  variant="light"
                  onPress={() => router.push("/login")}
                  className="w-full"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                >
                  Back to Login
                </Button>
              </motion.div>
            </form>

            {/* Password Requirements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Password Requirements:
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-success-500' : 'bg-gray-300'}`} />
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordsMatch && confirmPassword ? 'bg-success-500' : 'bg-gray-300'}`} />
                  Passwords must match
                </li>
              </ul>
            </motion.div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}