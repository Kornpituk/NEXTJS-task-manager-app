"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Github,
  Chrome,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Divider } from "@heroui/divider";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      } else {
        // Success animation before redirect
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-2xl">
          <CardBody className="p-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg"
              >
                <LogIn className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                เข้าสู่ระบบ
              </h1>
              <p className="text-gray-600 text-sm">
                ยินดีต้อนรับกลับมา! กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-danger-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Login Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 mb-6"
            >
              <Button
                disabled
                variant="bordered"
                className="w-full h-12 font-medium"
                onPress={() => handleSocialLogin("github")}
                startContent={<Github className="w-5 h-5" />}
                isDisabled={isLoading}
              >
                เข้าสู่ระบบด้วย GitHub
              </Button>

              <Button
                disabled
                variant="bordered"
                className="w-full h-12 font-medium"
                onPress={() => handleSocialLogin("google")}
                startContent={<Chrome className="w-5 h-5" />}
                isDisabled={isLoading}
              >
                เข้าสู่ระบบด้วย Google
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <Divider className="flex-1" />
              <span className="px-4 text-sm text-gray-500">หรือ</span>
              <Divider className="flex-1" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  type="email"
                  label="อีเมล"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startContent={<Mail className="w-5 h-5 text-gray-400" />}
                  isRequired
                  className="w-full"
                  variant="bordered"
                  size="lg"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  label="รหัสผ่าน"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startContent={<Lock className="w-5 h-5 text-gray-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none transition-colors hover:text-blue-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  }
                  isRequired
                  className="w-full"
                  variant="bordered"
                  size="lg"
                />
              </motion.div>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-right"
              >
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  ลืมรหัสผ่าน?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                <Button
                  type="submit"
                  color="primary"
                  isDisabled={isLoading || !email || !password}
                  className="w-full h-12 font-medium text-base"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" color="white" />
                      กำลังเข้าสู่ระบบ...
                    </div>
                  ) : (
                    "เข้าสู่ระบบ"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600 text-sm">
                ยังไม่มีบัญชี?{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.span
                    animate={{ color: isHovered ? "#2563eb" : "#2563eb" }}
                    className="relative"
                  >
                    สมัครสมาชิก
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.span>
                </Link>
              </p>
            </motion.div>
          </CardBody>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-gray-500">
            © 2024 Your Company. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
