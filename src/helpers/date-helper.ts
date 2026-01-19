// Helper function to round minutes to nearest 15-minute interval
export const roundToNearest15 = (minutes: number): number => {
  return Math.round(minutes / 15) * 15
}

// Helper function to get current time rounded to nearest 15-minute interval in 24-hour format
// This function should only be called on the client side to avoid hydration mismatches
export const getCurrentTime = (): string => {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    // Return a default time for server-side rendering
    return '09:00'
  }
  
  const now = new Date()
  let hours = now.getHours()
  let minutes = roundToNearest15(now.getMinutes())
  
  // Handle minute overflow (e.g., 59 minutes rounds to 60)
  if (minutes === 60) {
    minutes = 0
    hours = (hours + 1) % 24
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Helper function to add minutes to a time string
export const addMinutesToTime = (time24: string, minutesToAdd: number): string => {
  const [hours, minutes] = time24.split(':')
  const date = new Date()
  date.setHours(parseInt(hours, 10))
  date.setMinutes(parseInt(minutes, 10) + minutesToAdd)
  
  const newHours = date.getHours().toString().padStart(2, '0')
  const newMinutes = date.getMinutes().toString().padStart(2, '0')
  return `${newHours}:${newMinutes}`
}

// Convert AM/PM format to HTML5 time format (24-hour)
export const convertTo24HourFormat = (time12: string): string => {
  const [time, period] = time12.split(' ')
  const [hours, minutes] = time.split(':')
  let hour = parseInt(hours, 10)
  
  if (period === 'PM' && hour !== 12) {
    hour += 12
  } else if (period === 'AM' && hour === 12) {
    hour = 0
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`
}

// Convert HTML5 time format (24-hour) to AM/PM format
export const convertTo12HourFormat = (time24: string): string => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`
}

// Calculate duration between two times
export const calculateDuration = (startTime: string, endTime: string): string => {
  // Convert 12-hour format to 24-hour format for calculation if needed
  const start24 = startTime.includes('AM') || startTime.includes('PM') 
    ? convertTo24HourFormat(startTime) 
    : startTime
  const end24 = endTime.includes('AM') || endTime.includes('PM') 
    ? convertTo24HourFormat(endTime) 
    : endTime
    
  const start = new Date(`2000-01-01 ${start24}`)
  const end = new Date(`2000-01-01 ${end24}`)
  const diffMinutes = (end.getTime() - start.getTime()) / 60000
  const hours = Math.floor(diffMinutes / 60)
  const mins = diffMinutes % 60
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${mins}m`
  }
}

export const formatTimeRange = (start: string, end: string) => {
    // Helper function to remove AM/PM from time string
    const removeAmPm = (time: string) => {
      return time.replace(/\s*(AM|PM)/gi, '')
    }
    
    // Check if times are already in 12-hour format (contain AM/PM)
    if (start.includes('AM') || start.includes('PM')) {
      return `${removeAmPm(start)} - ${removeAmPm(end)}`
    }
    
    // If times are in 24-hour format, convert to 12-hour format without AM/PM
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(":")
      const hour = Number.parseInt(hours)
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayHour}:${minutes}`
    }
    return `${formatTime(start)} - ${formatTime(end)}`
  }
