"use client"

import AddTaskDialogContent from "@/components/add-task-dialog/add-task-dialog-component";
import { CalendarGrid } from "@/components/data-display/calendar-view/calendar-grid-component";
import { CalendarHeader } from "@/components/data-display/calendar-view/calendar-header-component";
import { PageHeader } from "@/components/layout/header/header-component";
import { Task } from "@/lib/types";
import { useState, useEffect } from "react";
import { useTaskStore } from "@/stores/task-store";
import { Dialog } from "@/components/common/dialog";

export default function CalendarPage() {
  // Get tasks and actions from Zustand store
  const tasks = useTaskStore((state) => state.tasks)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const duplicateTask = useTaskStore((state) => state.duplicateTask)

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  // Initialize selectedDate on client side to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSelectedDate(new Date())
    }
  }, [])
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleAddTask = (task: Omit<Task, "id">) => {
    console.log("[v0] Adding task:", task)
    if (editingTask) {
      updateTask(editingTask.id, task)
      setEditingTask(null)
    } else {
      addTask(task)
      console.log("[v0] New task created")
    }
    setIsAddTaskOpen(false)
    setSelectedSlot(null)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    const taskDate = new Date(task.year, task.month, task.day)
    setSelectedSlot({ date: taskDate, time: task.startTime })
    setIsAddTaskOpen(true)
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTask(taskId, updates)
  }

  const handleDuplicateTask = (task: Task) => {
    duplicateTask(task.id)
  }

  const handleSlotClick = (date: Date, time: string) => {
    console.log("[v0] Slot clicked:", date.toDateString(), time)
    setSelectedSlot({ date, time })
    setEditingTask(null)
    setIsAddTaskOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setIsAddTaskOpen(open)
    if (!open) {
      setEditingTask(null)
      setSelectedSlot(null)
    }
  }
  return (
    <div className="flex flex-col h-screen">
      <PageHeader >
        <CalendarHeader selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </PageHeader>
      <div className="flex-1 overflow-hidden bg-white">
     
     <CalendarGrid
       selectedDate={selectedDate}
       tasks={tasks}
       onSlotClick={handleSlotClick}
       onEditTask={handleEditTask}
       onDeleteTask={handleDeleteTask}
       onDuplicateTask={handleDuplicateTask}
       onUpdateTask={handleUpdateTask}
     />
     <Dialog open={isAddTaskOpen} onOpenChange={handleDialogClose}>
       <AddTaskDialogContent
         onAddTask={handleAddTask}
         selectedSlot={selectedSlot}
         editingTask={editingTask}
         onDeleteTask={handleDeleteTask}
         onDuplicateTask={handleDuplicateTask}
       />
     </Dialog>
   </div>
    </div>
  );
}
