"use client";

import { Clock } from "lucide-react";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Checkbox } from "@/components/common/checkbox";
import { Switch } from "@/components/common/switch";
import { DatePicker } from "@/components/common/date-picker";
import { MultiSelect } from "@/components/common/multi-select";
import { Textarea } from "@/components/common/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/common/field";
import { AutoComplete } from "@/components/common/autocomplete";
import { calculateDuration } from "@/helpers/date-helper";
import { CLIENT_OPTIONS, TASK_TYPE_OPTIONS } from "@/helpers/static-data-helper";
import InlineSVG from "../inline-svg/inline-svg-component";
import { cn } from "@/lib/utils";
import { Activity } from "react";
import { type FormValues } from "../../hooks/use-task-form";
import type { Task } from "@/lib/types";
import { ImprovementInsights } from "./improvement-insights-form";
import { useTaskStore } from "@/stores/task-store";

export type FormType = UseFormReturn<FormValues>;

interface TaskFormProps {
  form: FormType;
  showMoreDetails: boolean;
  repeat: boolean;
  startTime: string;
  endTime: string;
  handleTimeBlur: (
    value: string,
    timeField: "startTime" | "endTime",
    displayField: "startTimeDisplay" | "endTimeDisplay"
  ) => void;
  onSubmit: (data: FormValues) => void;
  editingTask: Task | null;
}

export function TaskForm({
  form,
  showMoreDetails,
  repeat,
  startTime,
  endTime,
  handleTimeBlur,
  onSubmit,
  editingTask,
}: TaskFormProps) {
  // Get tasks from store to extract unique titles
  const tasks = useTaskStore((state) => state.tasks);
  
  // Get unique task titles with their associated data (excluding current editing task)
  const taskTitles = useMemo(() => {
    const taskMap = new Map<string, { title: string; client: string; taskType: string[] }>();
    tasks.forEach((task) => {
      if (task.title.trim() && task.id !== editingTask?.id) {
        const titleKey = task.title.trim();
        // Store the most recent task data for each unique title
        if (!taskMap.has(titleKey)) {
          taskMap.set(titleKey, {
            title: titleKey,
            client: task.client,
            taskType: task.taskType,
          });
        }
      }
    });
    return Array.from(taskMap.values())
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((taskData) => ({
        value: taskData.title,
        label: taskData.title,
        client: taskData.client,
        taskType: taskData.taskType,
      }));
  }, [tasks, editingTask?.id]);

  // Manage search value separately for autocomplete
  const [titleSearchValue, setTitleSearchValue] = useState("");

  // Watch the occurrence value for reactive updates
  const occurrence = useWatch({
    control: form.control,
    name: "occurrence",
  });

  // Watch title value to sync with search value
  const titleValue = useWatch({
    control: form.control,
    name: "title",
  });

  // Sync search value with form value when editing or when form value changes externally
  useEffect(() => {
    // Initialize search value from form value on mount or when form value changes externally
    // This handles both initialization and reset scenarios
    if (titleValue !== titleSearchValue) {
      setTitleSearchValue(titleValue || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue]); // Only sync when form value changes externally, not when user types

  // Filter task titles based on search value
  const filteredTitles = useMemo(() => {
    if (!titleSearchValue.trim()) {
      return taskTitles;
    }
    const searchLower = titleSearchValue.toLowerCase();
    return taskTitles.filter((item) =>
      item.label.toLowerCase().includes(searchLower)
    );
  }, [taskTitles, titleSearchValue]);

  // Format date for display
  const formatDateDisplay = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <form
      id="add-task-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn(
        "p-6  flex flex-col gap-6 overflow-y-auto no-scrollbar flex-1",
        showMoreDetails ? "pt-6" : "pt-0"
      )}
    >
      <FieldGroup>
        {/* Title field with AutoComplete */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <AutoComplete
                id="title"
                selectedValue={field.value || ""}
                onSelectedValueChange={(value, metadata) => {
                  field.onChange(value);
                  setTitleSearchValue(value);
                  
                  // Populate client and task type if metadata is provided
                  if (metadata) {
                    if (metadata.client) {
                      form.setValue("client", metadata.client);
                    }
                    if (metadata.taskType && metadata.taskType.length > 0) {
                      form.setValue("taskType", metadata.taskType);
                    }
                  }
                }}
                searchValue={titleSearchValue}
                onSearchValueChange={(value) => {
                  setTitleSearchValue(value);
                  // Update form value when user types (allows free text entry)
                  field.onChange(value);
                }}
                items={filteredTitles}
                placeholder="Enter your task title"
                title="PREVIOUSLY TRACKED TIME ENTRIES"
                className="h-12 bg-transparent"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Description field - shown when showMoreDetails is true */}
        {showMoreDetails && (
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Enter your Description"
                  aria-invalid={fieldState.invalid}
                  className="min-h-[80px] bg-card border-border"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        {/* Client dropdown */}
        <Controller
          name="client"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Select label="Client" value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="client"
                  className="h-12 bg-white"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent className="flex flex-col gap-4">
                  {CLIENT_OPTIONS.map((clientOption) => (
                    <SelectItem
                      key={clientOption.value}
                      value={clientOption.value}
                      className="text-base font-normal p-3 border-b border-border"
                    >
                      {clientOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Task Type multi-select */}
        <Controller
          name="taskType"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="taskType">Task Type</FieldLabel>
              <MultiSelect
                id="taskType"
                options={TASK_TYPE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Task type"
                className="h-auto bg-card"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="startTimeDisplay"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="startTime"
                    type="text"
                    placeholder="HH:MM AM/PM"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow typing and validate time format with AM/PM
                      if (
                        /^[0-9:\sAPMapm]*$/.test(value) &&
                        value.length <= 11
                      ) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) =>
                      handleTimeBlur(
                        e.target.value,
                        "startTime",
                        "startTimeDisplay"
                      )
                    }
                    className="h-12 bg-card pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <InlineSVG
                      src="/icons/outlined/calendar-icon.svg"
                      height={16}
                      width={16}
                      ariaHidden
                      className=""
                    />
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="endTimeDisplay"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="endTime">End</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="endTime"
                    type="text"
                    placeholder="HH:MM AM/PM"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow typing and validate time format with AM/PM
                      if (
                        /^[0-9:\sAPMapm]*$/.test(value) &&
                        value.length <= 11
                      ) {
                        field.onChange(value);
                      }
                    }}
                    onBlur={(e) =>
                      handleTimeBlur(e.target.value, "endTime", "endTimeDisplay")
                    }
                    className="h-12 bg-card pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <InlineSVG
                      src="/icons/outlined/calendar-icon.svg"
                      height={16}
                      width={16}
                      ariaHidden
                      className=""
                    />
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <Activity mode={showMoreDetails ? "hidden" : "visible"}>
        <div className="flex flex-col gap-2">
          <div className="pt-0">
            <Button
              type="submit"
              variant="primary"
              className="w-full text-base h-12"
            >
              {editingTask ? "Save" : "Add task"}
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.setValue("showMoreDetails", true)}
              className="font-bold text-secondary pb-0 pt-0 hover:bg-transparent hover:text-secondary"
            >
              <InlineSVG
                src="/icons/outlined/add-circle-icon.svg"
                height={16}
                width={16}
                ariaHidden
                className="text-secondary"
              />
              More details
            </Button>
          </div>
        </div>
      </Activity>

      {/* Advanced Options (shown when More Details is clicked) */}
      <Activity mode={showMoreDetails ? "visible" : "hidden"}>
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-base font-medium">
            <Clock className="h-4 w-4" />
            <span>Duration: {calculateDuration(startTime, endTime)}</span>
          </div>

          <Controller
            name="repeat"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="repeat"
                  size="sm"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label
                  htmlFor="repeat"
                  className="text-sm font-medium cursor-pointer"
                >
                  Repeat
                </Label>
              </div>
            )}
          />

          {/* Repeat fields - only show when repeat is checked */}

          <Activity mode={repeat ? "visible" : "hidden"}>
            <div className="flex flex-col gap-4">
              <Controller
                name="occurrence"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Select 
                      label="Occurrence" 
                      value={field.value || undefined} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="occurrence"
                        className="h-12 bg-card text-foreground"
                      >
                        <SelectValue
                          placeholder="Select an option"
                          className="text-base font-normal"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily" className="py-2 border-b border-border">Daily</SelectItem>
                       
                        <SelectItem value="weekly" className="py-2 border-b border-border">Weekly</SelectItem>
                       
                        <SelectItem value="monthly" className="py-2 border-b border-border">Monthly</SelectItem>
                        
                        
                        
                        <SelectItem value="custom" className="py-2 border-b border-border">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Custom days selection - shown when "custom" is selected */}
              <Activity mode={occurrence === "custom" ? "visible" : "hidden"}>
                <div className="flex flex-col gap-4">
                  <p className="text-base font-medium">Repeat on:</p>
                  <Controller
                    name="customDays"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="flex flex-col gap-2.5">
                          {/* First row: Monday - Friday */}
                          <div className="flex gap-2.5">
                            {["monday", "tuesday", "wednesday", "thursday", "friday"].map((day) => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`custom-day-${day}`}
                                  size="sm"
                                  checked={field.value?.includes(day) || false}
                                  onCheckedChange={(checked) => {
                                    const currentDays = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentDays, day]);
                                    } else {
                                      field.onChange(currentDays.filter(d => d !== day));
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`custom-day-${day}`}
                                  className="text-sm font-normal  cursor-pointer whitespace-nowrap"
                                >
                                  {day.charAt(0).toUpperCase() + day.slice(1)}
                                </Label>
                              </div>
                            ))}
                          </div>
                          {/* Second row: Saturday - Sunday */}
                          <div className="flex gap-2.5">
                            {["saturday", "sunday"].map((day) => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`custom-day-${day}`}
                                  size="sm"
                                  checked={field.value?.includes(day) || false}
                                  onCheckedChange={(checked) => {
                                    const currentDays = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentDays, day]);
                                    } else {
                                      field.onChange(currentDays.filter(d => d !== day));
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`custom-day-${day}`}
                                  className="text-sm font-normal cursor-pointer whitespace-nowrap"
                                >
                                  {day.charAt(0).toUpperCase() + day.slice(1)}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </Activity>

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <DatePicker
                        id="startDate"
                        label="Start Date"
                        value={field.value}
                        onChange={field.onChange}
                        displayValue={formatDateDisplay(field.value)}
                        placeholder="Select start date"
                        className="bg-card"
                        variant="input"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <DatePicker
                        id="endDate"
                        
                        label="End Date"
                        value={field.value}
                        onChange={field.onChange}
                        displayValue={formatDateDisplay(field.value)}
                        placeholder="Select end date"
                        className="bg-card"
                        variant="input"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          </Activity>


{/* add improvements insights section */}
          <Controller
            name="improvementInsights"
            control={form.control}
            render={() => (
              <ImprovementInsights control={form.control} form={form} />
            )}
          />
        </div>
      </Activity>
    </form>
  );
}

interface TaskFormFooterProps {
  showMoreDetails: boolean;
  onClose: () => void;
  form: FormType;
}

export function TaskFormFooter({ showMoreDetails, onClose, form }: TaskFormFooterProps) {
  return (
    <Activity mode={showMoreDetails ? "visible" : "hidden"}>
      {/* Footer - Fixed at bottom */}
      <div
        className={cn(
          "flex-shrink-0 px-6 pb-6 pt-4",
          showMoreDetails ? "bg-card" : "bg-muted"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:items-center">
          <Controller
            name="kpiEntry"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center gap-4 col-span-1">
                <Switch
                  id="kpiEntry"
                  size="sm"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="kpiEntry" className="text-sm font-medium">
                  KPI Entry
                </Label>
              </div>
            )}
          />
          <div className="flex gap-3 col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="add-task-form"
              className="flex-1 h-12"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Activity>
  );
}

