"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  ListTodo, 
  CheckCircle2, 
  Circle, 
  LogOut,
  User,
  Settings,
  Bell
} from "lucide-react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
  Card,
  CardBody,
  Tabs,
  Tab,
  Badge,
  Spinner,
} from "@heroui/react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

type FilterType = "all" | "active" | "completed";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Redirect ถ้ายังไม่ Login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ดึงข้อมูล Tasks
  const fetchTasks = async () => {
    setIsFetching(true);
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  // สร้าง/แก้ไข Task
  const handleSubmit = async (data: { title: string; description: string }) => {
    setIsLoading(true);
    try {
      if (editingTask) {
        // แก้ไข
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const updated = await res.json();
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        // สร้างใหม่
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const newTask = await res.json();
        setTasks([newTask, ...tasks]);
      }
      setIsFormOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle สถานะ
  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  // ลบ Task
  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบงานนี้ใช่หรือไม่?")) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // เปิด Form แก้ไข
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true;
  });

  const stats = {
    all: tasks.length,
    active: tasks.filter((t) => !t.isCompleted).length,
    completed: tasks.filter((t) => t.isCompleted).length,
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <ListTodo className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
                <p className="text-gray-600">จัดการงานของคุณอย่างมีประสิทธิภาพ</p>
              </div>
            </motion.div>
          </div>

          {/* User Menu */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" className="p-2 min-w-0 h-auto">
                <Avatar
                  isBordered
                  color="primary"
                  src={session?.user?.image || undefined}
                  name={session?.user?.name || session?.user?.email}
                  className="transition-transform hover:scale-105"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold text-blue-600">{session?.user?.email}</p>
              </DropdownItem>
              <DropdownItem key="settings" startContent={<Settings className="w-4 h-4" />}>
                Settings
              </DropdownItem>
              <DropdownItem key="notifications" startContent={<Bell className="w-4 h-4" />}>
                Notifications
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger"
                startContent={<LogOut className="w-4 h-4" />}
                onPress={() => signOut({ callbackUrl: "/login" })}
                className="text-danger"
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardBody className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.all}</div>
              <div className="text-blue-100">ทั้งหมด</div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardBody className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.active}</div>
              <div className="text-amber-100">กำลังทำ</div>
            </CardBody>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardBody className="p-6 text-center">
              <div className="text-3xl font-bold">{stats.completed}</div>
              <div className="text-green-100">เสร็จแล้ว</div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Card className="shadow-lg border-none">
          <CardBody className="p-6">
            {/* Header with Filter and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <Tabs 
                selectedKey={filter}
                onSelectionChange={(key) => setFilter(key as FilterType)}
                color="primary"
                variant="underlined"
              >
                <Tab 
                  key="all" 
                  title={
                    <div className="flex items-center gap-2">
                      <span>ทั้งหมด</span>
                      <Badge color="primary" variant="flat">{stats.all}</Badge>
                    </div>
                  } 
                />
                <Tab 
                  key="active" 
                  title={
                    <div className="flex items-center gap-2">
                      <span>กำลังทำ</span>
                      <Badge color="warning" variant="flat">{stats.active}</Badge>
                    </div>
                  } 
                />
                <Tab 
                  key="completed" 
                  title={
                    <div className="flex items-center gap-2">
                      <span>เสร็จแล้ว</span>
                      <Badge color="success" variant="flat">{stats.completed}</Badge>
                    </div>
                  } 
                />
              </Tabs>

              <Button
                color="primary"
                size="lg"
                startContent={<Plus className="w-5 h-5" />}
                onPress={() => {
                  setEditingTask(null);
                  setIsFormOpen(true);
                }}
                className="font-medium"
              >
                เพิ่มงานใหม่
              </Button>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {isFetching ? (
                <div className="text-center py-12">
                  <Spinner size="lg" color="primary" />
                  <p className="mt-4 text-gray-600">กำลังโหลดงาน...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl"
                >
                  {filter === "all" && (
                    <>
                      <Circle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีงาน</h3>
                      <p className="text-gray-500 mb-4">เริ่มเพิ่มงานแรกของคุณ!</p>
                      <Button
                        color="primary"
                        startContent={<Plus className="w-4 h-4" />}
                        onPress={() => setIsFormOpen(true)}
                      >
                        สร้างงานแรก
                      </Button>
                    </>
                  )}
                  {filter === "active" && (
                    <>
                      <CheckCircle2 className="w-20 h-20 text-green-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีงานที่ค้างอยู่</h3>
                      <p className="text-gray-500">เก่งมาก! คุณจัดการทุกอย่างเรียบร้อยแล้ว 🎉</p>
                    </>
                  )}
                  {filter === "completed" && (
                    <>
                      <Circle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีงานที่เสร็จ</h3>
                      <p className="text-gray-500">เริ่มทำงานและทำเครื่องหมายว่าเสร็จแล้ว!</p>
                    </>
                  )}
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TaskCard
                        task={task}
                        onToggle={handleToggle}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <TaskForm
            task={editingTask}
            onSubmit={handleSubmit}
            onClose={() => {
              setIsFormOpen(false);
              setEditingTask(null);
            }}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}