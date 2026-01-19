"use client"

interface TimeSlotHoverOverlayProps {
  isVisible: boolean
  position: { top: number; left: number; width: number; height: number }
  onAddTask: () => void
}

export function TimeSlotHoverOverlay({
  isVisible,
  position,
  onAddTask,
}: TimeSlotHoverOverlayProps) {
  console.log("Overlay render:", { isVisible, position })
  if (!isVisible) return null

  return (
    <div
      className="absolute pointer-events-none z-1 transition-opacity duration-200"
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
      }}
      data-slot-overlay
    >
      <div
        className="w-full h-10 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center cursor-pointer pointer-events-auto  transition-all duration-200 shadow-lg"
        onClick={onAddTask}
        data-slot-overlay
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-current"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
