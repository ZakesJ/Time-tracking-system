import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";
import type { Task } from "@/lib/types";
import {
  addMinutesToTime,
  convertTo24HourFormat,
  convertTo12HourFormat,
} from "@/helpers/date-helper";
import { getClientColor } from "@/helpers/static-data-helper";

// Insight item schema
const insightItemSchema = z.object({
  id: z.string(),
  type: z.enum(["risks-opportunities", "knowledge-skill-transfer", "improvements-value-add", "learning"]),
  content: z.string(),
});

// Form validation schema with conditional validation for repeat fields
const formSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  client: z.string().min(1, "Client is required"),
  taskType: z.array(z.string()).min(1, "At least one task type is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  startTimeDisplay: z.string(),
  endTimeDisplay: z.string(),
  repeat: z.boolean(),
  occurrence: z.string().optional(),
  customDays: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  kpiEntry: z.boolean(),
  showMoreDetails: z.boolean(),
  improvementInsights: z.array(insightItemSchema).optional().default([]),
}).refine((data) => {
  // If repeat is enabled, occurrence and startDate are required
  if (data.repeat) {
    if (!data.occurrence || data.occurrence === "") {
      return false;
    }
    if (!data.startDate) {
      return false;
    }
    // If custom is selected, at least one custom day is required
    if (data.occurrence === "custom" && (!data.customDays || data.customDays.length === 0)) {
      return false;
    }
  }
  return true;
}, {
  message: "Occurrence and start date are required when repeat is enabled",
  path: ["occurrence"], // This will show error on occurrence field
}).refine((data) => {
  // Custom days validation
  if (data.occurrence === "custom" && data.repeat) {
    if (!data.customDays || data.customDays.length === 0) {
      return false;
    }
  }
  return true;
}, {
  message: "At least one day must be selected for custom repeat",
  path: ["customDays"],
}).refine((data) => {
  // End date must be after start date if both are provided
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type FormValues = z.infer<typeof formSchema>;

// Helper function to generate dates based on occurrence pattern
function generateTaskDates(
  occurrence: string,
  startDate: Date,
  endDate: Date,
  customDays?: string[]
): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  // Mapping day names to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayNameToNumber: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  while (currentDate <= endDate) {
    // For custom, only add dates that match selected days
    if (occurrence === "custom" && customDays && customDays.length > 0) {
      const dayOfWeek = currentDate.getDay();
      const selectedDayNumbers = customDays.map(day => dayNameToNumber[day.toLowerCase()]);
      
      if (selectedDayNumbers.includes(dayOfWeek)) {
        dates.push(new Date(currentDate));
      }
    } else if (occurrence !== "custom") {
      dates.push(new Date(currentDate));
    }

    // Increment date based on occurrence
    switch (occurrence) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "yearly":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      case "custom":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      default:
        currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return dates;
}

interface UseTaskFormProps {
  selectedSlot: { date: Date; time: string } | null;
  editingTask: Task | null;
  onAddTask: (task: Omit<Task, "id">) => void;
  onClose: () => void;
  onDeleteTask?: (taskId: string) => void;
  onDuplicateTask?: (task: Task) => void;
}

export function useTaskForm({
  selectedSlot,
  editingTask,
  onAddTask,
  onClose,
  onDeleteTask,
  onDuplicateTask,
}: UseTaskFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      title: editingTask?.title || "",
      description: editingTask?.description || "",
      client: editingTask?.client || "",
      taskType: editingTask?.taskType || [],
      startTime: editingTask
        ? convertTo24HourFormat(editingTask.startTime)
        : selectedSlot
        ? convertTo24HourFormat(selectedSlot.time)
        : "09:00", // Default to 9 AM
      endTime: editingTask
        ? convertTo24HourFormat(editingTask.endTime)
        : selectedSlot
        ? addMinutesToTime(convertTo24HourFormat(selectedSlot.time), 15)
        : "09:15", // Default to 9:15 AM
      startTimeDisplay: editingTask
        ? editingTask.startTime
        : selectedSlot
        ? selectedSlot.time
        : "09:00 AM", // Default display time
      endTimeDisplay: editingTask
        ? editingTask.endTime
        : selectedSlot
        ? convertTo12HourFormat(
            addMinutesToTime(convertTo24HourFormat(selectedSlot.time), 15)
          )
        : "09:15 AM", // Default display time
      repeat: editingTask?.repeat || false,
      occurrence: editingTask?.occurrence || "",
      customDays: editingTask?.customDays || [],
      startDate: editingTask?.startDate 
        ? (typeof editingTask.startDate === 'string' ? new Date(editingTask.startDate) : editingTask.startDate)
        : editingTask && editingTask.repeat
        ? new Date(editingTask.year, editingTask.month, editingTask.day)
        : undefined,
      endDate: editingTask?.endDate 
        ? (typeof editingTask.endDate === 'string' ? new Date(editingTask.endDate) : editingTask.endDate)
        : undefined,
      kpiEntry: editingTask?.kpiEntry || false,
      showMoreDetails: false,
      improvementInsights: editingTask?.improvementInsights || [],
    },
  });

  // Update form values when editingTask changes
  useEffect(() => {
    if (editingTask) {
      form.reset({
        title: editingTask.title || "",
        description: editingTask.description || "",
        client: editingTask.client || "",
        taskType: editingTask.taskType || [],
        startTime: convertTo24HourFormat(editingTask.startTime),
        endTime: convertTo24HourFormat(editingTask.endTime),
        startTimeDisplay: editingTask.startTime,
        endTimeDisplay: editingTask.endTime,
        repeat: editingTask.repeat || false,
        occurrence: editingTask.occurrence || "",
        customDays: editingTask.customDays || [],
        startDate: editingTask.startDate 
          ? (typeof editingTask.startDate === 'string' ? new Date(editingTask.startDate) : editingTask.startDate)
          : editingTask.repeat
          ? new Date(editingTask.year, editingTask.month, editingTask.day)
          : undefined,
        endDate: editingTask.endDate 
          ? (typeof editingTask.endDate === 'string' ? new Date(editingTask.endDate) : editingTask.endDate)
          : undefined,
        kpiEntry: editingTask.kpiEntry || false,
        showMoreDetails: editingTask.repeat ? true : false, // Auto-show more details if repeat is enabled
        improvementInsights: editingTask.improvementInsights || [],
      });
    } else {
      // Reset to defaults when not editing
      form.reset({
        title: "",
        description: "",
        client: "",
        taskType: [],
        startTime: selectedSlot
          ? convertTo24HourFormat(selectedSlot.time)
          : "09:00",
        endTime: selectedSlot
          ? addMinutesToTime(convertTo24HourFormat(selectedSlot.time), 15)
          : "09:15",
        startTimeDisplay: selectedSlot ? selectedSlot.time : "09:00 AM",
        endTimeDisplay: selectedSlot
          ? convertTo12HourFormat(
              addMinutesToTime(convertTo24HourFormat(selectedSlot.time), 15)
            )
          : "09:15 AM",
        repeat: false,
        occurrence: "",
        customDays: [],
        startDate: undefined,
        endDate: undefined,
        kpiEntry: false,
        showMoreDetails: false,
        improvementInsights: [],
      });
    }
  }, [editingTask, selectedSlot, form]);

  const showMoreDetails = useWatch({
    control: form.control,
    name: "showMoreDetails",
  });
  const repeat = useWatch({ control: form.control, name: "repeat" });
  const startTime = useWatch({ control: form.control, name: "startTime" });
  const endTime = useWatch({ control: form.control, name: "endTime" });

  const onSubmit = (data: FormValues) => {
    // Use selectedSlot date if available, otherwise use editingTask date
    const taskDate = selectedSlot?.date || (editingTask ? new Date(editingTask.year, editingTask.month, editingTask.day) : null);
    if (!taskDate) return;

    const baseTaskData = {
      title: data.title,
      description: data.description || "",
      client: data.client,
      taskType: data.taskType,
      startTime: convertTo12HourFormat(data.startTime),
      endTime: convertTo12HourFormat(data.endTime),
      repeat: data.repeat,
      occurrence: data.occurrence,
      customDays: data.customDays,
      startDate: data.startDate,
      endDate: data.endDate,
      kpiEntry: data.kpiEntry,
      color: getClientColor(data.client), // Use client's assigned color
      improvementInsights: data.improvementInsights || [],
    };

    // If repeat is enabled, generate multiple tasks
    if (data.repeat && data.occurrence && data.startDate) {
      // Default end date to 1 year from start date if not provided
      const endDate = data.endDate || new Date(data.startDate.getFullYear() + 1, data.startDate.getMonth(), data.startDate.getDate());
      
      // Generate dates based on occurrence pattern
      const dates = generateTaskDates(data.occurrence, data.startDate, endDate, data.customDays);

      // Create a task for each generated date
      dates.forEach((date) => {
        const taskData = {
          ...baseTaskData,
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        };
        console.log("Saving repeated task:", taskData);
        onAddTask(taskData);
      });
    } else {
      // Create single task as before
      const taskData = {
        ...baseTaskData,
        day: taskDate.getDate(),
        month: taskDate.getMonth(),
        year: taskDate.getFullYear(),
      };

      console.log("Saving task:", taskData);
      onAddTask(taskData);
    }

    // Reset form
    form.reset();
    onClose();
  };

  const handleTimeBlur = (
    value: string,
    timeField: "startTime" | "endTime",
    displayField: "startTimeDisplay" | "endTimeDisplay"
  ) => {
    const trimmedValue = value.trim();

    // Try to convert to 24-hour format
    const converted24h = convertTo24HourFormat(trimmedValue);

    if (converted24h) {
      // Valid time, update both states with properly formatted values
      form.setValue(timeField, converted24h);
      form.setValue(displayField, convertTo12HourFormat(converted24h));
    } else if (trimmedValue && !trimmedValue.includes(":")) {
      // Handle partial input - just numbers
      if (trimmedValue.length <= 2) {
        const hour = parseInt(trimmedValue);
        if (!isNaN(hour) && hour >= 1 && hour <= 12) {
          const formattedTime = `${hour}:00 AM`;
          const converted = convertTo24HourFormat(formattedTime);
          form.setValue(timeField, converted);
          form.setValue(displayField, formattedTime);
        }
      } else if (trimmedValue.length <= 4) {
        const hour = parseInt(trimmedValue.substring(0, 2));
        const minute = trimmedValue.substring(2).padEnd(2, "0");
        if (!isNaN(hour) && hour >= 1 && hour <= 12) {
          const formattedTime = `${hour}:${minute} AM`;
          const converted = convertTo24HourFormat(formattedTime);
          form.setValue(timeField, converted);
          form.setValue(displayField, formattedTime);
        }
      }
    } else {
      // Invalid input, revert to stored value
      const currentTime = form.getValues(timeField);
      form.setValue(displayField, convertTo12HourFormat(currentTime));
    }
  };

  const handleDuplicate = () => {
    if (editingTask && onDuplicateTask) {
      onDuplicateTask(editingTask);
      onClose();
    }
  };

  const handleDelete = () => {
    if (editingTask && onDeleteTask) {
      onDeleteTask(editingTask.id);
      onClose();
    }
  };

  return {
    form,
    showMoreDetails,
    repeat,
    startTime,
    endTime,
    onSubmit,
    handleTimeBlur,
    handleDuplicate,
    handleDelete,
  };
}
