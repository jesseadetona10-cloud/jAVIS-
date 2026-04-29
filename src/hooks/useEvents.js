import { useState } from 'react'

export default function useEvents() {
  const [events, setEvents] = useState([])

  const addEvent = (text) => {
    // Try to extract time from text
    const timeMatch = text.match(/\d{1,2}(:\d{2})?\s*(am|pm)/i)
    const time = timeMatch ? timeMatch[0] : null

    // Clean up the event name
    const name = text
      .replace(/at\s+\d{1,2}(:\d{2})?\s*(am|pm)/i, '')
      .replace(/add|event|reminder|meeting|call/i, '')
      .trim()

    const event = {
      id: Date.now(),
      name: name || 'Event',
      time: time || 'No time set',
      raw: text,
    }

    setEvents(prev => [...prev, event])
    console.log('Event added:', event)
    return event
  }

  const getEvents = () => {
    if (events.length === 0) {
      return 'You have nothing scheduled Sir.'
    }
    const list = events
      .map(e => `${e.name} at ${e.time}`)
      .join(', ')
    return `Here is your schedule Sir. ${list}`
  }

  const clearEvents = () => {
    setEvents([])
  }

  return { addEvent, getEvents, clearEvents, events }
}