'use client'

import { useState, useEffect } from 'react'
import { Plus, ListTodo, CheckCircle2, Circle } from 'lucide-react'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskForm } from '@/components/tasks/TaskForm'

interface Task {
  id: string
  title: string
  description: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

type FilterType = 'all' | 'active' | 'completed'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ดึงข้อมูล Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // สร้าง/แก้ไข Task
  const handleSubmit = async (data: { title: string; description: string }) => {
    setIsLoading(true)
    try {
      if (editingTask) {
        // แก้ไข
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        const updated = await res.json()
        setTasks(tasks.map(t => t.id === updated.id ? updated : t))
      } else {
        // สร้างใหม่
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        const newTask = await res.json()
        setTasks([newTask, ...tasks])
      }
      setIsFormOpen(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle สถานะ
  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted })
      })
      const updated = await res.json()
      setTasks(tasks.map(t => t.id === updated.id ? updated : t))
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  // ลบ Task
  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบงานนี้ใช่หรือไม่?')) return
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      setTasks(tasks.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  // เปิด Form แก้ไข
  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted
    if (filter === 'completed') return task.isCompleted
    return true
  })

  const stats = {
    all: tasks.length,
    active: tasks.filter(t => !t.isCompleted).length,
    completed: tasks.filter(t => t.isCompleted).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ListTodo className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Task Manager</h1>
          </div>
          <p className="text-gray-600">จัดการงานของคุณอย่างมีประสิทธิภาพ</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.all}</div>
            <div className="text-sm text-gray-600">ทั้งหมด</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
            <div className="text-sm text-gray-600">กำลังทำ</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">เสร็จแล้ว</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2">
          {(['all', 'active', 'completed'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'all' && 'ทั้งหมด'}
              {f === 'active' && 'กำลังทำ'}
              {f === 'completed' && 'เสร็จแล้ว'}
            </button>
          ))}
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => {
            setEditingTask(null)
            setIsFormOpen(true)
          }}
          className="w-full mb-6 p-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          เพิ่มงานใหม่
        </button>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              {filter === 'all' && (
                <>
                  <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">ยังไม่มีงาน เริ่มเพิ่มงานแรกของคุณ!</p>
                </>
              )}
              {filter === 'active' && (
                <>
                  <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
                  <p className="text-gray-500">ไม่มีงานที่ค้างอยู่ เก่งมาก! 🎉</p>
                </>
              )}
              {filter === 'completed' && (
                <>
                  <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">ยังไม่มีงานที่เสร็จ</p>
                </>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false)
            setEditingTask(null)
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}