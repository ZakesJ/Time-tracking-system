"use client";

import { useState } from "react";
import { useWatch } from "react-hook-form";
import { Button } from "@/components/common/button";
import { Textarea } from "@/components/common/textarea";
import FileUploadField from "@/components/common/file-upload";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/common/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/common/tooltip";
import { INSIGHT_TYPES, getInsightConfig, type InsightType } from "@/helpers/insight-types-helper";
import InlineSVG from "../inline-svg/inline-svg-component";
import { cn } from "@/lib/utils";
import { InfoIcon, ChevronDown } from "lucide-react";
import type { UseFormReturn, Control } from "react-hook-form";
import type { FormValues } from "../../hooks/use-task-form";

interface ImprovementInsight {
  id: string;
  type: InsightType;
  content: string;
}

interface ImprovementInsightsProps {
  control: Control<FormValues>;
  form: UseFormReturn<FormValues>;
}

export function ImprovementInsights({ control, form }: ImprovementInsightsProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [draftFieldsByType, setDraftFieldsByType] = useState<Record<InsightType, string[]>>({} as Record<InsightType, string[]>);
  const [openTypes, setOpenTypes] = useState<string[]>([]);
  const [activeDraftTypes, setActiveDraftTypes] = useState<Set<InsightType>>(new Set());

  const repeat = useWatch({
    control,
    name: "repeat",
  }) as boolean || false;

  const savedInsights = useWatch({
    control,
    name: "improvementInsights",
  }) as ImprovementInsight[] || [];

  // Don't show improvement insights if repeat is checked
  if (repeat) {
    return null;
  }

  const handleSelectType = (type: InsightType) => {
    setDraftFieldsByType((prev) => ({ ...prev, [type]: [""] }));
    setPopoverOpen(false);
    setOpenTypes((prev) => Array.from(new Set([...prev, type])));
    setActiveDraftTypes((prev) => new Set([...prev, type]));
  };

  const handleAddAnotherField = (type: InsightType) => {
    const currentFields = draftFieldsByType[type];
    if (!currentFields) {
      // If no draft fields exist, initialize with one empty field
      setDraftFieldsByType((prev) => ({ ...prev, [type]: [""] }));
      setActiveDraftTypes((prev) => new Set([...prev, type]));
    } else {
      // If draft fields exist, add one more
      setDraftFieldsByType((prev) => ({ ...prev, [type]: [...currentFields, ""] }));
    }
  };

  const handleDeleteDraftField = (type: InsightType, index: number) => {
    const currentFields = draftFieldsByType[type] || [""];
    const insights = form.getValues("improvementInsights") || [];
    const savedInsightsForType = insights.filter((insight: ImprovementInsight) => insight.type === type);
    
    if (currentFields.length > 1) {
      // If multiple fields, remove the one at index
      setDraftFieldsByType((prev) => ({
        ...prev,
        [type]: currentFields.filter((_, i) => i !== index),
      }));
    } else if (savedInsightsForType.length > 0) {
      // If only one field but there are saved items, remove the draft section completely
      setDraftFieldsByType((prev) => {
        const updated = { ...prev };
        delete updated[type];
        return updated;
      });
      setActiveDraftTypes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
    } else {
      // If only one field and no saved items, just clear it
      setDraftFieldsByType((prev) => ({ ...prev, [type]: [""] }));
    }
  };

  const handleDraftFieldChange = (type: InsightType, index: number, value: string) => {
    const currentFields = draftFieldsByType[type] || [""];
    const updated = [...currentFields];
    updated[index] = value;
    setDraftFieldsByType((prev) => ({ ...prev, [type]: updated }));
  };

  const handleCancel = (type: InsightType) => {
    // Clear draft fields and close accordion
    setDraftFieldsByType((prev) => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
    setActiveDraftTypes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
    setOpenTypes((prev) => prev.filter((t) => t !== type));
  };

  const handleSave = (type: InsightType) => {
    const draftFields = draftFieldsByType[type] || [""];
    const currentInsights = form.getValues("improvementInsights") || [];
    const newInsights: ImprovementInsight[] = draftFields
      .filter((field) => field.trim() !== "")
      .map((content) => ({
        id: `${Date.now()}-${Math.random()}`,
        type: type,
        content: content.trim(),
      }));

    form.setValue("improvementInsights", [...currentInsights, ...newInsights]);
    // Clear draft fields completely and close accordion
    setDraftFieldsByType((prev) => {
      const updated = { ...prev };
      delete updated[type];
      return updated;
    });
    setActiveDraftTypes((prev) => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
    setOpenTypes((prev) => prev.filter((t) => t !== type));
  };

  const handleDelete = (id: string) => {
    const currentInsights = form.getValues("improvementInsights") || [];
    form.setValue(
      "improvementInsights",
      currentInsights.filter((insight: ImprovementInsight) => insight.id !== id)
    );
  };

  const handleInsightChange = (id: string, content: string) => {
    const currentInsights = form.getValues("improvementInsights") || [];
    const updated = currentInsights.map((insight: ImprovementInsight) =>
      insight.id === id
        ? { ...insight, content }
        : insight
    );
    form.setValue("improvementInsights", updated);
  };

  // Group insights by type
  const insightsByType = savedInsights.reduce(
    (acc, insight) => {
      if (!acc[insight.type]) {
        acc[insight.type] = [];
      }
      acc[insight.type].push(insight);
      return acc;
    },
    {} as Record<InsightType, ImprovementInsight[]>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Add Improvement Insights Button with Popover */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            className="w-fit justify-between h-12 text-white font-bold"
          >
            <span>Add Improvement Insights</span>
            <ChevronDown
              className={cn(
                "h-6 w-6 transition-transform shrink-0",
                popoverOpen && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[274px] p-0"
          align="start"
          sideOffset={8}
        >
          <div className="flex flex-col">
            {INSIGHT_TYPES.map((type, index) => (
              <div key={type.value}>
                <button
                  type="button"
                  onClick={() => handleSelectType(type.value)}
                  className={cn(
                    "w-full text-left px-4 py-3 text-base font-normal hover:bg-accent transition-colors",
                    index < INSIGHT_TYPES.length - 1 && "border-b border-border"
                  )}
                >
                  {type.label}
                </button>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Insights Accordion (includes draft when selected) */}
      {(() => {
        const typesToRender = Array.from(
          new Set([
            ...Object.keys(insightsByType),
            ...Array.from(activeDraftTypes),
          ])
        ) as InsightType[];

        if (typesToRender.length === 0) return null;

        return (
          <Accordion
            type="multiple"
            value={openTypes}
            onValueChange={setOpenTypes}
            className="w-full flex flex-col gap-6"
          >
            {typesToRender.map((type) => {
              const insights = insightsByType[type as InsightType] || [];
            const typeConfig = getInsightConfig(type as InsightType);
            return (
              <AccordionItem key={type} value={type} className="border-none">
                <div className="bg-muted rounded-lg p-6 flex flex-col gap-4">
                  <AccordionTrigger className="hover:no-underline cursor-pointer py-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold font-gabarito">
                        {typeConfig.label}
                      </h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className=" inline-flex"
                            aria-label="More information"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <InfoIcon className="h-4 w-4" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          sideOffset={8}
                          className="bg-primary text-white text-xs font-normal leading-[1.2] max-w-[274px] px-4 py-4 rounded-lg [&>svg]:fill-[rgba(15,38,67,0.76)]"
                        >
                          <p className="whitespace-pre-wrap">{typeConfig.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-0">
                    <div className="flex flex-col gap-6">
                      {/* Saved insights - appear first */}
                      {insights.map((insight) => (
                        <div key={insight.id} className="flex gap-2 items-center ">
                          <Textarea
                            value={insight.content}
                            onChange={(e) =>
                              handleInsightChange(insight.id, e.target.value)
                            }
                            placeholder={typeConfig.placeholder}
                            className="flex-1 min-h-[80px] bg-card border-border"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleDelete(insight.id)}
                            title="Delete insight"
                             className="px-0 py-0 cursor-pointer [&_svg:not([class*=size-])]:size-5 opacity-100"
                          >
                            <InlineSVG
                              src="/icons/outlined/delete-icon.svg"
                              height={16}
                              width={16}
                              ariaHidden
                              className="text-destructive"
                              
                            />
                          </Button>
                        </div>
                      ))}

                      {/* Draft fields - appear after saved insights, always visible when accordion is open */}
                      {openTypes.includes(type) && (
                        <>
                          {(draftFieldsByType[type as InsightType] || (insights.length === 0 ? [""] : [])).map((field, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <Textarea
                                placeholder={typeConfig.placeholder}
                                value={field}
                                onChange={(e) => {
                                  // Initialize draft if it doesn't exist
                                  if (!draftFieldsByType[type as InsightType]) {
                                    setDraftFieldsByType((prev) => ({ ...prev, [type]: [""] }));
                                    setActiveDraftTypes((prev) => new Set([...prev, type as InsightType]));
                                  }
                                  handleDraftFieldChange(type as InsightType, index, e.target.value);
                                }}
                                className="flex-1 min-h-[80px] bg-card border-border"
                              />
                              {(draftFieldsByType[type as InsightType] || []).length > 1 || insights.length > 0 ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => handleDeleteDraftField(type as InsightType, index)}
                                  className="px-0 py-0 cursor-pointer [&_svg:not([class*=size-])]:size-5 opacity-100"
                                  aria-label="Delete field"
                                >
                                  <InlineSVG
                                    src="/icons/outlined/delete-icon.svg"
                                    height={24}
                                    width={24}
                                    ariaHidden
                                    className="text-destructive"
                                  />
                                </Button>
                              ) : null}
                            </div>
                          ))}

                          {/* Action buttons - appear after draft fields */}
                          <div className="flex items-center justify-between pt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleCancel(type as InsightType)}
                              className="text-base font-bold h-8 px-0"
                            >
                              Cancel
                            </Button>
                            <div className="flex items-center gap-4">
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleAddAnotherField(type as InsightType)}
                                className="font-bold pb-0 pt-0 hover:bg-transparent"
                              >
                                <InlineSVG
                                  src="/icons/outlined/add-circle-icon.svg"
                                  height={16}
                                  width={16}
                                  ariaHidden
                                  className="text-current"
                                />
                                Add another
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  // Initialize draft if it doesn't exist
                                  if (!draftFieldsByType[type as InsightType]) {
                                    setDraftFieldsByType((prev) => ({ ...prev, [type]: [""] }));
                                    setActiveDraftTypes((prev) => new Set([...prev, type as InsightType]));
                                  }
                                  handleSave(type as InsightType);
                                }}
                                className=""
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            );
            })}
          </Accordion>
        );
      })()}
    </div>
  );
}

