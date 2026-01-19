"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
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
import { Button, buttonVariants } from "@/components/common/button";
import type { Task } from "@/lib/types";
import InlineSVG from "../inline-svg/inline-svg-component";
import { cn } from "@/lib/utils";
import { Activity } from "react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../common/popover";
import { useTaskForm } from "../../hooks/use-task-form";
import { TaskForm, TaskFormFooter, type FormType } from "../forms/task-form";
// import FileUpload from "@/components/ui/file-upload";

interface AddTaskDialogContentProps {
  onAddTask: (task: Omit<Task, "id">) => void;
  selectedSlot: { date: Date; time: string } | null;
  editingTask: Task | null;
  onClose: () => void;
  onDeleteTask?: (taskId: string) => void;
  onDuplicateTask?: (task: Task) => void;
}

export default function AddTaskDialogContent({
  onAddTask,
  selectedSlot,
  editingTask,
  onClose,
  onDeleteTask,
  onDuplicateTask,
}: AddTaskDialogContentProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    form,
    showMoreDetails,
    repeat,
    startTime,
    endTime,
    onSubmit,
    handleTimeBlur,
    handleDuplicate,
    handleDelete,
  } = useTaskForm({
    selectedSlot,
    editingTask,
    onAddTask,
    onClose,
    onDeleteTask,
    onDuplicateTask,
  });

  // Wrap original submit to include files
  const handleSubmitWithFiles = (data: any) => {
    onSubmit({ ...data, attachments: uploadedFiles });
  };

  return (
    <DialogContent
      className={cn(
        "p-2 gap-0 max-h-[90vh] border flex flex-col overflow-hidden",
        showMoreDetails
          ? "sm:max-w-[560px] bg-white"
          : "sm:max-w-[360px] bg-muted"
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      {/* Header */}
      <DialogHeader
        className={cn(
          "bg-muted px-6 rounded-tr-2xl rounded-tl-2xl flex-shrink-0",
          showMoreDetails ? "py-4 pb-2" : "py-2"
        )}
      >
        <DialogTitle
          className={cn(
            "text-2xl font-bold",
            editingTask ? "hidden" : "visible",
            showMoreDetails ? "block -mt-2" : "invisible"
          )}
        >
          {editingTask ? "Edit Task" : "Add Task"}
        </DialogTitle>

        <Activity mode={(!editingTask || showMoreDetails) ? "hidden" : "visible"}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="p-0 [&_svg]:size-6 justify-start [&_svg:not([class*=size-])]:size-6"
              >
                <InlineSVG
                  src="/icons/outlined/more-circle-icon.svg"
                  height={24}
                  width={24}
                  ariaHidden
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="flex flex-col gap-1">
                {/* Duplicate Menu Item */}
                <div
                  className="flex items-center gap-2 h-9 px-4 py-3 border-b border-muted hover:bg-accent rounded cursor-pointer"
                  onClick={handleDuplicate}
                >
                  <InlineSVG
                    src="/icons/outlined/copy-icon.svg"
                    height={16}
                    width={16}
                    ariaHidden
                  />
                  <span className="text-base font-normal">Duplicate</span>
                </div>

                {/* Delete Menu Item */}
                <div
                  className="flex items-center gap-2 h-9 px-4 py-3 hover:bg-accent rounded cursor-pointer"
                  onClick={() => setIsDeleteConfirmOpen(true)}
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
        </Activity>
      </DialogHeader>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <ConfirmDialogContent className="sm:max-w-[420px] p-12 gap-6">
          <AlertDialogHeader className="text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <InlineSVG
                src="/icons/outlined/delete-icon-lg.svg"
                height={64}
                width={64}
                ariaHidden
              />
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <AlertDialogTitle className="text-4xl font-bold font-gabarito">
                  Confirm delete?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task?
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="w-full gap-4 justify-center!">
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive", className: "w-full" })}
              onClick={() => {
                handleDelete();
                setIsDeleteConfirmOpen(false);
              }}
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </ConfirmDialogContent>
      </AlertDialog>

      {/* Task Form */}
      <TaskForm
        form={form as FormType}
        showMoreDetails={showMoreDetails}
        repeat={repeat}
        startTime={startTime}
        endTime={endTime}
        handleTimeBlur={handleTimeBlur}
        onSubmit={handleSubmitWithFiles}
        editingTask={editingTask}
      />

      {/* File Upload Section */}
      <div className="mt-4">
        {/* <FileUpload
          className={cn(
            "border-2 border-dashed rounded-lg p-4 transition-colors duration-200",
            "hover:border-blue-500",
            showMoreDetails ? "bg-white" : "bg-muted"
          )}
          accept="image/png, image/jpeg, application/pdf"
          maxFiles={2}
          maxSize={2 * 1024 * 1024}
          onChange={(files) => setUploadedFiles(files)}
          showPreview
          previewClassName="flex flex-wrap gap-2 mt-2"
        /> */}
      </div>

      {/* Task Form Footer */}
      <TaskFormFooter
        showMoreDetails={showMoreDetails}
        onClose={onClose}
        form={form as FormType}
      />
    </DialogContent>
  );
}
