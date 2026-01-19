"use client";

import type React from "react";

import { useState, useRef, useEffect, Activity } from "react";

import type { Task, ColorFamily } from "@/lib/types";
import { cn } from "@/lib/utils";

import { calculateDuration, formatTimeRange } from "@/helpers/date-helper";
import { getClientLabel } from "@/helpers/static-data-helper";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/common/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as ConfirmDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/common/alert-dialog";
import { buttonVariants } from "@/components/common/button";
import InlineSVG from "../../inline-svg/inline-svg-component";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onDuplicateTask?: (task: Task) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  timeSlots: string[];
  column?: number;
  totalColumns?: number;
  hasOverlappingTasks?: boolean;
}

// Color system for task cards
const getColorClasses = (
  color: ColorFamily
): { background: string; border: string; clientText: string } => {
  const colorMap: Record<
    ColorFamily,
    { background: string; border: string; clientText: string }
  > = {
    navy: {
      background: "bg-navy-100",
      border: "border-navy-600",
      clientText: "text-navy-600",
    },
    blue: {
      background: "bg-blue-100",
      border: "border-blue-600",
      clientText: "text-blue-600",
    },
    cyan: {
      background: "bg-cyan-100",
      border: "border-cyan-600",
      clientText: "text-cyan-600",
    },
    green: {
      background: "bg-green-100",
      border: "border-green-600",
      clientText: "text-green-600",
    },
    info: {
      background: "bg-info-100",
      border: "border-info-600",
      clientText: "text-info-600",
    },
    yellow: {
      background: "bg-yellow-100",
      border: "border-yellow-600",
      clientText: "text-yellow-600",
    },
    red: {
      background: "bg-red-100",
      border: "border-red-600",
      clientText: "text-red-600",
    },
    gray: {
      background: "bg-gray-100",
      border: "border-gray-600",
      clientText: "text-gray-600",
    },
  };
  return colorMap[color];
};

export function TaskCard(props: TaskCardProps) {
  const { task, onEdit, onUpdate, onDelete, onDuplicateTask, timeSlots, column = 0, totalColumns = 1, hasOverlappingTasks = false } = props;
  const [isDragging, setIsDragging] = useState(false);
  const [isPotentialDrag, setIsPotentialDrag] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragDirection, setDragDirection] = useState<"up" | "down" | null>(
    null
  );
  const [dragHandle, setDragHandle] = useState<
    "top" | "bottom" | "middle" | null
  >(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [resizeOffset, setResizeOffset] = useState(0);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuJustClosedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragOccurredRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);
  const accumulatedDragRef = useRef(0);
  const DRAG_THRESHOLD = 2; // pixels to move before starting drag
  const UPDATE_THROTTLE = 16; // ~60fps throttling

  const handleDragStart = (
    e: React.MouseEvent,
    handle: "top" | "bottom" | "middle"
  ) => {
    // Don't start drag if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }

    e.stopPropagation();
    // Don't immediately set dragging - wait for movement
    setIsPotentialDrag(true);
    setDragStartY(e.clientY);
    setDragDirection(null);
    setDragHandle(handle);
    dragOccurredRef.current = false;
    accumulatedDragRef.current = 0;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartY;
      const now = performance.now();

      // Check if we should start dragging based on movement threshold
      if (isPotentialDrag && !isDragging && Math.abs(deltaY) > DRAG_THRESHOLD) {
        setIsDragging(true);
        setIsPotentialDrag(false);
        dragOccurredRef.current = true;
      }

      // Update visual feedback based on drag handle type
      if (isDragging || isPotentialDrag) {
        if (dragHandle === "middle") {
          // For middle handle, move the entire card
          setDragOffset(deltaY);
          setResizeOffset(0);
        } else {
          // For top/bottom handles, resize the card
          setDragOffset(0);
          setResizeOffset(deltaY);
        }
      }

      // Throttle actual updates to prevent excessive re-renders
      if (isDragging && dragHandle && now - lastUpdateTimeRef.current > UPDATE_THROTTLE) {
        const slotHeight = 80; // Height of each time slot
        
        // Accumulate the drag movement
        accumulatedDragRef.current += deltaY;
        const totalSlotsChanged = Math.floor(accumulatedDragRef.current / slotHeight);
        
        // Only update if we've moved at least one full slot
        if (Math.abs(totalSlotsChanged) > 0) {
          // Determine drag direction if not set
          if (!dragDirection && deltaY !== 0) {
            setDragDirection(deltaY > 0 ? "down" : "up");
          }

          // Handle dragging from the top - adjust start time
          if (dragHandle === "top") {
            const currentStartIndex = timeSlots.indexOf(task.startTime);
            const newStartIndex = currentStartIndex + totalSlotsChanged;

            // Ensure new start time is before end time and within bounds
            if (
              newStartIndex >= 0 &&
              newStartIndex < timeSlots.indexOf(task.endTime)
            ) {
              const newStartTime = timeSlots[newStartIndex];
              onUpdate(task.id, { startTime: newStartTime });
              // Reset accumulated drag and update start position
              accumulatedDragRef.current = accumulatedDragRef.current % slotHeight;
              setDragStartY(e.clientY);
              lastUpdateTimeRef.current = now;
            }
          }
          // Handle dragging from bottom or middle - adjust end time
          else {
            // Dragging down extends the end time (makes task longer)
            if (deltaY > 0) {
              const currentEndIndex = timeSlots.indexOf(task.endTime);
              const newEndIndex = currentEndIndex + totalSlotsChanged;

              // Ensure new end time is after start time and within bounds
              if (
                newEndIndex > timeSlots.indexOf(task.startTime) &&
                newEndIndex < timeSlots.length
              ) {
                const newEndTime = timeSlots[newEndIndex];
                onUpdate(task.id, { endTime: newEndTime });
                // Reset accumulated drag and update start position
                accumulatedDragRef.current = accumulatedDragRef.current % slotHeight;
                setDragStartY(e.clientY);
                lastUpdateTimeRef.current = now;
              }
            }
            // Dragging up reduces the end time (makes task shorter)
            else if (deltaY < 0) {
              const currentEndIndex = timeSlots.indexOf(task.endTime);
              const newEndIndex = currentEndIndex + totalSlotsChanged;

              // Ensure new end time is still after start time (at least one slot)
              if (newEndIndex > timeSlots.indexOf(task.startTime)) {
                const newEndTime = timeSlots[newEndIndex];
                onUpdate(task.id, { endTime: newEndTime });
                // Reset accumulated drag and update start position
                accumulatedDragRef.current = accumulatedDragRef.current % slotHeight;
                setDragStartY(e.clientY);
                lastUpdateTimeRef.current = now;
              }
            }
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsPotentialDrag(false);
      setDragDirection(null);
      setDragHandle(null);
      setDragOffset(0);
      setResizeOffset(0);
      accumulatedDragRef.current = 0;
    };

    if (isDragging || isPotentialDrag) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isPotentialDrag,
    dragStartY,
    dragDirection,
    dragHandle,
    task,
    timeSlots,
    onUpdate,
    DRAG_THRESHOLD,
    UPDATE_THROTTLE,
  ]);

  // Calculate the height based on task duration
  const calculateCardHeight = () => {
    const startIndex = timeSlots.indexOf(task.startTime);
    const endIndex = timeSlots.indexOf(task.endTime);
    const slotCount = endIndex - startIndex;
    const slotHeight = 80; // Height of each time slot in pixels
    return slotCount * slotHeight;
  };

  const baseCardHeight = calculateCardHeight();
  const colorClasses = getColorClasses(task.color);
  
  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuOpen(true);
  };

  // Handle duplicate action
  const handleDuplicate = () => {
    contextMenuJustClosedRef.current = true;
    if (onDuplicateTask) {
      onDuplicateTask(task);
    }
    setContextMenuOpen(false);
    // Reset flag after a short delay
    setTimeout(() => {
      contextMenuJustClosedRef.current = false;
    }, 100);
  };

  // Handle delete action
  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
    setIsDeleteConfirmOpen(false);
    setContextMenuOpen(false);
  };
  
  // Calculate dynamic height and position based on drag handle
  const getCardStyle = () => {
    const slotHeight = 80;
    let height = baseCardHeight;
    let topOffset = 0;
    
    if (isDragging || isPotentialDrag) {
      if (dragHandle === "top") {
        // Top handle: move down and reduce height
        const heightChange = resizeOffset;
        height = Math.max(slotHeight, baseCardHeight - heightChange);
        topOffset = resizeOffset;
      } else if (dragHandle === "bottom") {
        // Bottom handle: increase height
        height = Math.max(slotHeight, baseCardHeight + resizeOffset);
      } else if (dragHandle === "middle") {
        // Middle handle: move the entire card
        topOffset = dragOffset;
      }
    }
    
    // Calculate column positioning
    const columnWidth = totalColumns ? 100 / totalColumns : 100;
    const leftPosition = column * columnWidth;
    
    return {
      height: `${height}px`,
      width: `calc(${columnWidth}% - 0.5rem)`,
      left: `${leftPosition}%`,
      transform: `translateY(${topOffset}px)`,
      transition: isDragging || isPotentialDrag ? 'none' : 'transform 0.2s ease-out, height 0.2s ease-out',
      willChange: isDragging || isPotentialDrag ? 'transform, height' : 'auto'
    };
  };

  return (
    <>
      <article
        ref={cardRef}
        className={cn(
          `absolute z-2 top-0 m-1`,
          isDragging ? "opacity-80 shadow-lg" : ""
        )}
        style={getCardStyle()}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={handleContextMenu}
      >
            <div
              className={`${colorClasses.background} rounded-[4px] shadow-sm overflow-hidden group relative select-none h-full flex border-l-4 ${colorClasses.border}`}
            >
              {/* Main content area */}
              <div
                className="flex-1 flex flex-col justify-between p-2 min-w-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // Only trigger edit if no drag occurred, context menu wasn't just interacted with, and delete dialog isn't open
                  if (!dragOccurredRef.current && !contextMenuJustClosedRef.current && !isDeleteConfirmOpen) {
                    onEdit(task);
                  }
                }}
              >
                {/* Top drag handle */}
                <div
                  className={`absolute top-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-opacity-20 transition-all duration-200 z-10 group-hover:bg-opacity-10`}
                  style={{ backgroundColor: isDragging && dragHandle === 'top' ? colorClasses.border.replace('border', '') : 'transparent' }}
                  onMouseDown={(e) => handleDragStart(e, "top")}
                />

                {/* Bottom drag handle */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize hover:bg-opacity-20 transition-all duration-200 z-10 group-hover:bg-opacity-10`}
                  style={{ backgroundColor: isDragging && dragHandle === 'bottom' ? colorClasses.border.replace('border', '') : 'transparent' }}
                  onMouseDown={(e) => handleDragStart(e, "bottom")}
                />

                {/* Header section - aligned to top */}
                <div
                  className={`flex flex-col gap-2 cursor-pointer relative transition-all duration-200 ${
                    isDragging && dragHandle === 'middle' ? 'cursor-grabbing' : 'cursor-grab'
                  }`}
                  onMouseDown={(e) => handleDragStart(e, "middle")}
                >
                  <p className="text-xs capitalize font-normal truncate  text-navy-400">
                    {task.taskType.join(", ")}
                  </p>
                  <h3 title={task.title} className="text-base capitalize font-bold   truncate">
                    {task.title}
                  </h3>
                </div>

                {/* Footer section - aligned to bottom */}
                <div className="flex flex-col justify-between  gap-1 mt-auto">
                  <p
                    className={`text-xs font-medium  ${colorClasses.clientText}`}
                  >
                    {getClientLabel(task.client)}
                  </p>
                  <div className="flex  w-full items-center justify-between gap-4 text-xs  text-navy-400">
                    <span className="font-bold w-full">
                      {calculateDuration(task.startTime, task.endTime)}
                    </span>
                    {!hasOverlappingTasks && (
                      <span className="font-normal w-full text-right self-end whitespace-nowrap">
                        {formatTimeRange(task.startTime, task.endTime)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Visual indicator for dragging */}
              <Activity mode={isDragging ? "visible" : "hidden"}>
                <div
                  className={`absolute inset-0 ${colorClasses.border.replace(
                    "border",
                    "bg"
                  )} bg-opacity-5 pointer-events-none transition-opacity duration-200`}
                />
        </Activity>
      </div>
    </article>

    {/* Context Menu Popover */}
    <Popover open={contextMenuOpen} onOpenChange={(open) => {
      setContextMenuOpen(open);
      // If closing without menu interaction, reset the flag
      if (!open && !contextMenuJustClosedRef.current) {
        // Small delay to prevent card click from firing
        setTimeout(() => {
          contextMenuJustClosedRef.current = false;
        }, 100);
      }
    }}>
      <PopoverAnchor asChild>
        <div
          className="fixed pointer-events-none"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            width: 1,
            height: 1,
          }}
        />
      </PopoverAnchor>
      <PopoverContent className="w-48 p-2" align="start" side="right" onOpenAutoFocus={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <div className="flex flex-col gap-1">
            {/* Duplicate Menu Item */}
            <div
              className="flex items-center gap-2 h-9 px-4 py-3 border-b border-muted hover:bg-accent rounded cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <InlineSVG
                src="/icons/outlined/copy-icon.svg"
                height={16}
                width={16}
                ariaHidden
                className=""
              />
              <span className="text-base font-normal">Duplicate</span>
            </div>

            {/* Delete Menu Item */}
            <div
              className="flex items-center gap-2 h-9 px-4 py-3 hover:bg-accent rounded cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                contextMenuJustClosedRef.current = true;
                setContextMenuOpen(false);
                setIsDeleteConfirmOpen(true);
                // Reset flag after a short delay
                setTimeout(() => {
                  contextMenuJustClosedRef.current = false;
                }, 100);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <InlineSVG
                src="/icons/outlined/delete-icon.svg"
                height={16}
                width={16}
                ariaHidden
                className="text-destructive"
              />
              <span className="text-base font-normal text-destructive">
                Delete
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
      <ConfirmDialogContent className="sm:max-w-[420px] p-12 gap-6" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
        <AlertDialogHeader className="text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <InlineSVG
              src="/icons/outlined/delete-icon-lg.svg"
              height={64}
              width={64}
              ariaHidden
              className=""
            />
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <AlertDialogTitle className="text-4xl font-bold font-gabarito ">Confirm delete?</AlertDialogTitle>
              <AlertDialogDescription className="">
                Are you sure you want to delete this task?
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full gap-4 justify-center!">
          <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive", className: "w-full" })}
            onClick={(e) => {
              e.stopPropagation();
              contextMenuJustClosedRef.current = true;
              handleDelete();
              // Reset flag after a longer delay to ensure card click doesn't fire
              setTimeout(() => {
                contextMenuJustClosedRef.current = false;
              }, 200);
            }}
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </ConfirmDialogContent>
    </AlertDialog>
    </>
  );
}
