import { Trash2, Edit, Check, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'

interface Task {
  id: string
  title: string
  description: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

interface TaskCardProps {
  task: Task
  onToggle: (id: string, isCompleted: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <Card
        className={cn(
          'group border-none shadow-sm transition-all',
          task.isCompleted && 'bg-gray-50'
        )}
      >
        <CardBody className="p-4">
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <Button
              isIconOnly
              variant="light"
              onPress={() => onToggle(task.id, !task.isCompleted)}
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full transition-all',
                task.isCompleted
                  ? 'bg-green-500 text-white'
                  : 'border-2 border-gray-300 hover:border-green-500'
              )}
            >
              {task.isCompleted && <Check className="w-4 h-4" />}
            </Button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-medium text-gray-900 text-lg',
                  task.isCompleted && 'line-through text-gray-500'
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-2 text-gray-600 leading-relaxed">{task.description}</p>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {new Date(task.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                isIconOnly
                variant="light"
                onPress={() => onEdit(task)}
                className="text-gray-400 hover:text-blue-600"
                title="แก้ไข"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                variant="light"
                onPress={() => onDelete(task.id)}
                className="text-gray-400 hover:text-red-600"
                title="ลบ"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}