"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Progress } from "@heroui/progress";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!formData.password) return 0;
    
    let strength = 0;
    if (formData.password.length >= 6) strength += 25;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.email && formData.password && formData.confirmPassword && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!passwordsMatch) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
        return;
      }

      // Success - redirect to login
      router.push("/login?registered=true");
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
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
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg"
              >
                <UserPlus className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                สมัครสมาชิก
              </h1>
              <p className="text-gray-600 text-sm">
                สร้างบัญชีเพื่อเริ่มต้นใช้งาน
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Input
                  type="text"
                  name="name"
                  label="ชื่อผู้ใช้ (ไม่บังคับ)"
                  placeholder="กรอกชื่อของคุณ"
                  value={formData.name}
                  onChange={handleChange}
                  startContent={<User className="w-5 h-5 text-gray-400" />}
                  className="w-full"
                  variant="bordered"
                  size="lg"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Input
                  type="email"
                  name="email"
                  label="อีเมล"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  startContent={<Mail className="w-5 h-5 text-gray-400" />}
                  isRequired
                  className="w-full"
                  variant="bordered"
                  size="lg"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  label="รหัสผ่าน"
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  value={formData.password}
                  onChange={handleChange}
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

                {/* Password Strength Meter */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">ความแข็งแกร่งของรหัสผ่าน:</span>
                      <span className={`font-medium ${
                        passwordStrength < 50 ? "text-danger-500" :
                        passwordStrength < 75 ? "text-warning-500" : "text-success-500"
                      }`}>
                        {passwordStrength < 50 ? "อ่อน" : passwordStrength < 75 ? "ปานกลาง" : "แข็งแกร่ง"}
                      </span>
                    </div>
                    <Progress 
                      value={passwordStrength} 
                      className="h-2"
                      color={
                        passwordStrength < 50 ? "danger" :
                        passwordStrength < 75 ? "warning" : "success"
                      }
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  label="ยืนยันรหัสผ่าน"
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  startContent={<Lock className="w-5 h-5 text-gray-400" />}
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="focus:outline-none transition-colors hover:text-blue-600"
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
                  variant="bordered"
                  size="lg"
                  color={formData.confirmPassword ? (passwordsMatch ? "success" : "danger") : "default"}
                  description={
                    formData.confirmPassword && !passwordsMatch ? (
                      <span className="text-danger-500 text-xs">รหัสผ่านไม่ตรงกัน</span>
                    ) : formData.confirmPassword && passwordsMatch ? (
                      <span className="text-success-500 text-xs flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        รหัสผ่านตรงกัน
                      </span>
                    ) : null
                  }
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="space-y-4"
              >
                <Button
                  type="submit"
                  color="success"
                  isDisabled={!isFormValid || isLoading}
                  className="w-full h-12 font-medium text-base"
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" color="white" />
                      กำลังสมัครสมาชิก...
                    </div>
                  ) : (
                    "สมัครสมาชิก"
                  )}
                </Button>

                <Button
                  variant="light"
                  onPress={() => router.push("/login")}
                  className="w-full"
                  startContent={<ArrowLeft className="w-4 h-4" />}
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </Button>
              </motion.div>
            </form>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600 text-sm">
                มีบัญชีอยู่แล้ว?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.span
                    animate={{ color: isHovered ? "#2563eb" : "#2563eb" }}
                    className="relative"
                  >
                    เข้าสู่ระบบ
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