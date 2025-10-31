import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Textarea } from '@heroui/input'
import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'

interface Task {
  id: string
  title: string
  description: string | null
  isCompleted: boolean
}

interface TaskFormProps {
  task?: Task | null
  onSubmit: (data: { title: string; description: string }) => void
  onClose: () => void
  isLoading?: boolean
}

export function TaskForm({ task, onSubmit, onClose, isLoading }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
    } else {
      setTitle('')
      setDescription('')
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit({ title: title.trim(), description: description.trim() })
    }
  }

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose}
      size="md"
      placement="center"
    >
      <ModalContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              {task ? 'แก้ไขงาน' : 'เพิ่มงานใหม่'}
            </ModalHeader>
            <ModalBody>
              <Input
                label="ชื่องาน"
                placeholder="เช่น ทำรายงาน, ซื้อของ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                isRequired
                autoFocus
                variant="bordered"
              />
              <Textarea
                label="รายละเอียด"
                placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="bordered"
                minRows={3}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                ยกเลิก
              </Button>
              <Button 
                color="primary" 
                type="submit"
                isDisabled={isLoading || !title.trim()}
                isLoading={isLoading}
              >
                {task ? 'บันทึก' : 'เพิ่มงาน'}
              </Button>
            </ModalFooter>
          </form>
        </motion.div>
      </ModalContent>
    </Modal>
  )
}