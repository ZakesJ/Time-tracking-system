import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Task } from '@/lib/types'

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  duplicateTask: (taskId: string) => void
  clearTasks: () => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      
      addTask: (task) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            ...task,
            id: `task-${state.tasks.length + 1}-${Date.now()}`,
          }
        ]
      })),
      
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),
      
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId)
      })),
      
      duplicateTask: (taskId) => set((state) => {
        const taskToDuplicate = state.tasks.find(task => task.id === taskId)
        if (!taskToDuplicate) return state
        
        const duplicatedTask = {
          ...taskToDuplicate,
          id: `task-${state.tasks.length + 1}-${Date.now()}`,
        }
        
        return { tasks: [...state.tasks, duplicatedTask] }
      }),
      
      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'task-storage', // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

