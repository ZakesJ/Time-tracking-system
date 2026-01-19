"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import type { Task } from "@/lib/types"
import { TaskCard } from "../task-card/task-card-component"
import { TimeSlotHoverOverlay } from "./time-slot-hover-overlay"
import { Activity } from "react"

interface CalendarGridProps {
  selectedDate: Date | null
  tasks: Task[]
  onSlotClick: (date: Date, time: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onDuplicateTask?: (task: Task) => void
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}

// Skeleton Loader Component
function CalendarGridSkeleton() {
  // Predefined skeleton task configurations to avoid hydration errors
  const skeletonTasks = [
    { day: 0, time: 0, top: 15, height: 80 },
    { day: 1, time: 0, top: 10, height: 120 },
    { day: 2, time: 0, top: 25, height: 90 },
    { day: 3, time: 0, top: 5, height: 100 },
    { day: 1, time: 1, top: 20, height: 70 },
    { day: 4, time: 1, top: 12, height: 110 },
    { day: 5, time: 2, top: 18, height: 85 },
    { day: 2, time: 3, top: 8, height: 95 },
    { day: 6, time: 3, top: 22, height: 75 },
  ]

  return (
    <div className="h-full overflow-auto no-scrollbar px-8 bg-white relative">
      <div className="min-w-full">
        {/* Header Row */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-border sticky top-0 z-10">
          <div className="p-4 font-medium bg-white flex items-center justify-center">
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="p-4 text-left bg-white">
              <div className="flex items-center justify-start gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-muted rounded animate-pulse mb-1" />
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="relative">
          {timeSlots.filter((_, index) => index % 4 === 0).map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-[100px_repeat(7,1fr)] min-h-[320px]">
              <div className="py-2 text-sm border-r border-border font-medium flex items-center">
                <div className="h-4 w-16 bg-muted rounded animate-pulse ml-2" />
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                // Find tasks for this specific time slot and day
                const task = skeletonTasks.find(t => t.day === dayIndex && t.time === timeIndex)
                
                return (
                  <div
                    key={dayIndex}
                    className="border-r border-b border-border relative"
                  >
                    {task && (
                      <div
                        className="absolute left-1 right-1 rounded-md bg-muted animate-pulse"
                        style={{
                          top: `${task.top}%`,
                          height: `${task.height}px`,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const timeSlots = [
  "12:00 AM",
  "12:15 AM",
  "12:30 AM",
  "12:45 AM",
  "01:00 AM",
  "01:15 AM",
  "01:30 AM",
  "01:45 AM",
  "02:00 AM",
  "02:15 AM",
  "02:30 AM",
  "02:45 AM",
  "03:00 AM",
  "03:15 AM",
  "03:30 AM",
  "03:45 AM",
  "04:00 AM",
  "04:15 AM",
  "04:30 AM",
  "04:45 AM",
  "05:00 AM",
  "05:15 AM",
  "05:30 AM",
  "05:45 AM",
  "06:00 AM",
  "06:15 AM",
  "06:30 AM",
  "06:45 AM",
  "07:00 AM",
  "07:15 AM",
  "07:30 AM",
  "07:45 AM",
  "08:00 AM",
  "08:15 AM",
  "08:30 AM",
  "08:45 AM",
  "09:00 AM",
  "09:15 AM",
  "09:30 AM",
  "09:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
  "12:00 PM",
  "12:15 PM",
  "12:30 PM",
  "12:45 PM",
  "01:00 PM",
  "01:15 PM",
  "01:30 PM",
  "01:45 PM",
  "02:00 PM",
  "02:15 PM",
  "02:30 PM",
  "02:45 PM",
  "03:00 PM",
  "03:15 PM",
  "03:30 PM",
  "03:45 PM",
  "04:00 PM",
  "04:15 PM",
  "04:30 PM",
  "04:45 PM",
  "05:00 PM",
  "05:15 PM",
  "05:30 PM",
  "05:45 PM",
  "06:00 PM",
  "06:15 PM",
  "06:30 PM",
  "06:45 PM",
  "07:00 PM",
  "07:15 PM",
  "07:30 PM",
  "07:45 PM",
  "08:00 PM",
  "08:15 PM",
  "08:30 PM",
  "08:45 PM",
  "09:00 PM",
  "09:15 PM",
  "09:30 PM",
  "09:45 PM",
  "10:00 PM",
  "10:15 PM",
  "10:30 PM",
  "10:45 PM",
  "11:00 PM",
]

export function CalendarGrid({
  selectedDate,
  tasks,
  onSlotClick,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onUpdateTask,
}: CalendarGridProps) {
  // State for clicked slot overlay (to show where task will be added)
  const [clickedSlot, setClickedSlot] = useState<{
    dayIndex: number
    timeIndex: number
    element: HTMLElement
  } | null>(null)
  
  // State for overlay position
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  
  // Get the week starting from Monday
  const weekDays = useMemo(() => {
    if (!selectedDate) return []
    const startOfWeek = new Date(selectedDate)
    const day = startOfWeek.getDay()
    const diff = day === 0 ? -6 : 1 - day // If Sunday (0), go back 6 days, otherwise go to Monday
    startOfWeek.setDate(selectedDate.getDate() + diff)

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return day
    })
  }, [selectedDate])

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Calculate total hours for each day
  const getDayHours = (dayIndex: number) => {
    const dayTasks = tasks.filter((task) => task.day === weekDays[dayIndex].getDate())
    const totalMinutes = dayTasks.reduce((acc, task) => {
      const start = new Date(`2000-01-01 ${task.startTime}`)
      const end = new Date(`2000-01-01 ${task.endTime}`)
      return acc + (end.getTime() - start.getTime()) / 60000
    }, 0)
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    return `${hours} hrs ${mins} mins`
  }

  // State for current time to update the indicator
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    // Only set current time on client side to avoid hydration mismatch
    setCurrentTime(new Date())
    
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])




  const isToday = (day: Date) => {
    const today = new Date()
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
  }

  const getCurrentTimePosition = useCallback(() => {
    if (!currentTime) return 0
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const totalMinutes = hours * 60 + minutes
    const slotHeight = 80 // Height of each 15-minute slot
    const minutesPerSlot = 15
    const position = (totalMinutes / minutesPerSlot) * slotHeight
    return position
  }, [currentTime])


  const getCurrentTimeSlot = useCallback(() => {
    if (!currentTime) return ''
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const roundedMinutes = Math.floor(minutes / 15) * 15
    const ampm = hours >= 12 ? "PM" : "AM"
    const displayHours = (hours % 12 || 12).toString().padStart(2, "0")
    const displayMinutes = roundedMinutes.toString().padStart(2, "0")
    return `${displayHours}:${displayMinutes} ${ampm}`
  }, [currentTime])

  const isExactTimeInterval = useCallback(() => {
    if (!currentTime) return false
    const minutes = currentTime.getMinutes()
    return minutes % 15 === 0 // Only true when minutes are 0, 15, 30, or 45
  }, [currentTime])

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hasScrolled = useRef(false)

  useEffect(() => {
    // Auto-scroll to current time when component mounts or when week changes
    if (scrollContainerRef.current && !hasScrolled.current && currentTime && weekDays.some((day) => isToday(day))) {
      // Add a small delay to ensure DOM is fully rendered
      setTimeout(() => {
        const currentTimePosition = getCurrentTimePosition()
        const scrollContainer = scrollContainerRef.current
        
        if (scrollContainer && currentTimePosition > 0) {
          
          // Scroll to current time position, centered in view
          const scrollTop = currentTimePosition - (scrollContainer.clientHeight / 2)
          scrollContainer.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: "smooth"
          })
          
          hasScrolled.current = true
        }
      }, 100)
    }
  }, [getCurrentTimePosition, weekDays, currentTime])

  // Reset scroll flag when week changes
  useEffect(() => {
    hasScrolled.current = false
  }, [selectedDate])

  // Helper function to check if two tasks overlap
  const tasksOverlap = (task1: Task, task2: Task) => {
    const start1 = timeSlots.indexOf(task1.startTime)
    const end1 = timeSlots.indexOf(task1.endTime)
    const start2 = timeSlots.indexOf(task2.startTime)
    const end2 = timeSlots.indexOf(task2.endTime)
    return start1 < end2 && start2 < end1
  }

  // Function to calculate task layout for overlapping tasks
  const getTaskLayout = (dayTasks: Task[]) => {
    // Sort tasks by start time, then by duration (longer first)
    const sorted = [...dayTasks].sort((a, b) => {
      const aStart = timeSlots.indexOf(a.startTime)
      const bStart = timeSlots.indexOf(b.startTime)
      if (aStart !== bStart) return aStart - bStart
      const aDuration = timeSlots.indexOf(a.endTime) - aStart
      const bDuration = timeSlots.indexOf(b.endTime) - bStart
      return bDuration - aDuration
    })

    // Track columns and assign tasks
    const columns: Task[][] = []
    const taskLayouts = new Map<string, { column: number; totalColumns: number }>()

    sorted.forEach(task => {
      // Find first available column
      let columnIndex = 0
      while (columnIndex < columns.length) {
        const column = columns[columnIndex]
        const hasOverlap = column.some(existingTask => 
          tasksOverlap(task, existingTask)
        )
        if (!hasOverlap) break
        columnIndex++
      }

      // Create new column if needed
      if (columnIndex === columns.length) {
        columns.push([])
      }
      columns[columnIndex].push(task)
    })

    // Calculate total columns for each task (max overlapping at any point)
    sorted.forEach(task => {
      const overlappingTasks = sorted.filter(t => tasksOverlap(task, t))
      const maxColumns = overlappingTasks.length
      const column = columns.findIndex(col => col.includes(task))
      taskLayouts.set(task.id, { column, totalColumns: maxColumns })
    })

    return taskLayouts
  }

  // Check if a time slot has any task
  const hasTaskInSlot = useCallback((dayIndex: number, timeIndex: number) => {
    const day = weekDays[dayIndex]
    
    return tasks.some((task) => {
      const taskMatches =
        task.day === day.getDate() &&
        task.month === day.getMonth() &&
        task.year === day.getFullYear()

      if (taskMatches) {
        const startIndex = timeSlots.indexOf(task.startTime)
        const endIndex = timeSlots.indexOf(task.endTime)
        const currentIndex = timeIndex
        
        // Check if current time slot is within the task's time range
        return currentIndex >= startIndex && currentIndex < endIndex
      }

      return false
    })
  }, [tasks, weekDays])

  // Handle slot click - show overlay if empty, open dialog if has task
  const handleSlotClick = useCallback((dayIndex: number, timeIndex: number, day: Date, time: string, element: HTMLElement) => {
    // Check if this slot already has a task
    if (hasTaskInSlot(dayIndex, timeIndex)) {
      // If it has a task, don't show overlay, just call the original handler
      onSlotClick(day, time)
      return
    }

    // Calculate overlay position in the event handler
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      const rect = element.getBoundingClientRect()
      const containerRect = scrollContainer.getBoundingClientRect()
      
      const position = {
        top: rect.top - containerRect.top + scrollContainer.scrollTop,
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height,
      }
      
      console.log("Overlay position:", position)
      setOverlayPosition(position)
    }

    // If no task, show overlay at this slot AND open the dialog
    setClickedSlot({
      dayIndex,
      timeIndex,
      element,
    })
    
    // Open dialog immediately
    onSlotClick(day, time)
  }, [hasTaskInSlot, onSlotClick])

  // Handle adding task from clicked overlay
  const handleAddTaskFromOverlay = useCallback(() => {
    if (clickedSlot) {
      const day = weekDays[clickedSlot.dayIndex]
      const time = timeSlots[clickedSlot.timeIndex]
      onSlotClick(day, time)
      setClickedSlot(null)
    }
  }, [clickedSlot, weekDays, onSlotClick])

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clickedSlot && !(event.target as Element).closest('[data-slot-overlay]')) {
        setClickedSlot(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [clickedSlot])

  if (!selectedDate) {
    return <CalendarGridSkeleton />
  }

  return (
    <div ref={scrollContainerRef} className="h-full overflow-auto no-scrollbar px-8 bg-white relative">
      <div className="min-w-full">
        {/* Header Row */}
        <div className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-border sticky top-0  z-10 ">
          <p className="p-4  font-medium   bg-white flex items-center justify-center">Time</p>
          {weekDays.map((day, index) => (
            <div key={index} className="p-4 text-left  bg-white">
               <div className="flex items-center justify-start gap-2 mb-1">
                 <p className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                   isToday(day) 
                     ? 'bg-primary text-white' 
                     : ''
                 }`}>
                   {day.getDate()}
                 </p>
               </div>
              <p className="text-navy-300  mb-1">{dayNames[index]}</p>
              <p className="font-bold">{getDayHours(index)}</p>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="relative">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-[100px_repeat(7,1fr)] min-h-[80px]">
              <span className=" py-2 text-sm border-r border-border font-medium">
                 <span className={`inline-block w-full ${
                  currentTime && weekDays.some((day) => isToday(day)) && time === getCurrentTimeSlot() && isExactTimeInterval()
                    ? 'bg-primary text-white px-2 py-1 rounded' 
                    : 'text-navy-300'
                }`}>{time}</span>
              </span>
              {weekDays.map((day, dayIndex) => {
                // Get all tasks for this day
                const allDayTasks = tasks.filter((task) =>
                  task.day === day.getDate() &&
                  task.month === day.getMonth() &&
                  task.year === day.getFullYear()
                )
                
                // Calculate layout for all tasks
                const taskLayout = getTaskLayout(allDayTasks)
                
                // Find tasks that should be rendered in this time slot
                const dayTasks = allDayTasks.filter((task) => {
                  const startIndex = timeSlots.indexOf(task.startTime)
                  const endIndex = timeSlots.indexOf(task.endTime)
                  const currentIndex = timeSlots.indexOf(time)
                  return currentIndex >= startIndex && currentIndex < endIndex
                })

                return (
                  <div
                    key={dayIndex}
                    className="border-r border-b border-border relative hover:bg-accent cursor-pointer transition-colors h-full group"
                    onClick={(e) => handleSlotClick(dayIndex, timeIndex, day, time, e.currentTarget)}
                    data-slot-overlay
                  >
                    {dayTasks.map((task) => {
                      const isFirstSlot = time === task.startTime
                      if (isFirstSlot) {
                        const layout = taskLayout.get(task.id)
                        const hasOverlappingTasks = (layout?.totalColumns ?? 1) > 1
                        return (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                            onDuplicateTask={onDuplicateTask}
                            onUpdate={onUpdateTask}
                            timeSlots={timeSlots}
                            column={layout?.column ?? 0}
                            totalColumns={layout?.totalColumns ?? 1}
                            hasOverlappingTasks={hasOverlappingTasks}
                          />
                        )
                      }
                      return null
                    })}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Current Time Line */}
          <Activity mode={currentTime && weekDays.some((day) => isToday(day)) ? 'visible' : 'hidden'}>
            <div
              className="absolute left-0 right-0 pointer-events-none z-1"
              style={{ top: `${getCurrentTimePosition()}px` }}
            >
              <div className="grid grid-cols-[100px_repeat(7,1fr)]">
                <div></div>
                {weekDays.map((day, index) => (
                  <div key={index} className="relative">
                    <Activity mode={isToday(day) ? 'visible' : 'hidden'}>
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                        <div className="h-0.5 bg-primary shadow-sm" />
                      </div>
                    </Activity>
                  </div>
                ))}
              </div>
            </div>
          </Activity>

        </div>
      </div>
      
      {/* Click Overlay - Shows where task will be added */}
      <TimeSlotHoverOverlay
        isVisible={clickedSlot !== null}
        position={overlayPosition}
        onAddTask={handleAddTaskFromOverlay}
      />
      
    </div>
  )
}
