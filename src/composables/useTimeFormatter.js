export function useTimeFormatter() {
    const formatTime = (isoString) => {
        if (!isoString) return ''

        // Parse the ISO date string
        const inputDate = new Date(isoString)
        if (isNaN(inputDate.getTime())) return 'Invalid date'

        // Get time components
        const hours = inputDate.getHours()
        const minutes = inputDate.getMinutes()

        // Format the time part (8.35 PM)
        const period = hours >= 12 ? 'PM' : 'AM'
        const twelveHour = hours % 12 || 12
        const formattedMinutes = minutes.toString().padStart(2, '0')
        const timePart = `${twelveHour}.${formattedMinutes} ${period}`

        // Get current date and input date for comparison
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const inputDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate())

        // Calculate differences
        const diffMs = now - inputDate
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor((today - inputDay) / (1000 * 60 * 60 * 24))

        // Determine relative time
        if (diffMs < 0) {
            return `today at ${timePart}` // Future time
        } else if (diffDays === 0) {
            // Today
            if (diffMinutes === 0) {
                return 'just now'
            } else if (diffMinutes < 60) {
                return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago at ${timePart}`
            } else {
                return `today at ${timePart}`
            }
        } else if (diffDays === 1) {
            // Yesterday
            return `yesterday at ${timePart}`
        } else if (diffDays < 7) {
            // This week
            return `${diffDays} days ago at ${timePart}`
        } else {
            // Older than a week
            return `${diffDays} days ago at ${timePart}`
        }
    }

    // You can add more functions here later
    return {
        formatTime
    }
}