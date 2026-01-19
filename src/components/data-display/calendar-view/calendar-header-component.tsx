"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/common/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/common/popover"
import { Calendar } from "@/components/common/calendar"
import { format } from "date-fns"
import InlineSVG from "../../inline-svg/inline-svg-component"

interface CalendarHeaderProps {
  selectedDate: Date | null
  setSelectedDate: (date: Date) => void
}

export function CalendarHeader({ selectedDate, setSelectedDate }: CalendarHeaderProps) {
  if (!selectedDate) {
    return <div className="h-10" /> // Placeholder while loading
  }

  const monthYear = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const startOfWeek = new Date(selectedDate)
  const day = startOfWeek.getDay()
  const diff = day === 0 ? -6 : 1 - day // If Sunday (0), go back 6 days, otherwise go to Monday
  startOfWeek.setDate(selectedDate.getDate() + diff)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  const dateRange = `${format(startOfWeek, "MM/dd/yy")} - ${format(endOfWeek, "MM/dd/yy")}`

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  return (
    <>
      <h1 className="text-[28px] font-bold">{monthYear}</h1>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevWeek}
          className="h-10 w-10 rounded-xl  bg-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 border  rounded-xl min-w-[200px] justify-center h-10 bg-white"
            >
              <span className=" text-navy-300 text-sm self-start">{dateRange}</span>
              <InlineSVG src="/icons/outlined/calendar-icon.svg" height={16} width={16} ariaHidden className="text-current" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextWeek}
          className="h-10 w-10 rounded-xl  bg-white"
        >
          <ChevronRight className="h-6 w-6 text-current" />
        </Button>
      </div>
    </>
  )
}
