import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/mockData";
import { useState } from "react";

function generateICS(event: Event) {
  const start = new Date(`${event.date}T${event.time}:00`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${fmt(start)}
DTEND:${fmt(end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
}

export default function EventCard({ event, compact }: { event: Event; compact?: boolean }) {
  const [rsvpd, setRsvpd] = useState(false);
  const dateObj = new Date(event.date + "T" + event.time);

  const downloadICS = () => {
    const blob = new Blob([generateICS(event)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "-")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const googleCalUrl = () => {
    const start = new Date(`${event.date}T${event.time}:00`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
  };

  const spotsLeft = event.maxCapacity - event.rsvpCount - (rsvpd ? 1 : 0);

  return (
    <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {/* Date badge */}
        <div className="shrink-0 flex flex-col items-center justify-center rounded-lg bg-primary/10 text-primary w-14 h-14">
          <span className="text-xs font-medium uppercase">
            {dateObj.toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="text-xl font-bold leading-none">{dateObj.getDate()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{event.title}</h3>
          {!compact && <p className="text-sm text-muted-foreground mt-0.5">{event.description}</p>}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CalendarDays size={12} />{dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
            <span className="flex items-center gap-1"><MapPin size={12} />{event.location}</span>
            <span className="flex items-center gap-1"><Users size={12} />{spotsLeft} spots left</span>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            size="sm"
            variant={rsvpd ? "secondary" : "default"}
            onClick={() => setRsvpd(!rsvpd)}
          >
            {rsvpd ? "Cancel RSVP" : "RSVP"}
          </Button>
          <Button size="sm" variant="outline" onClick={downloadICS}>
            .ics
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={googleCalUrl()} target="_blank" rel="noopener noreferrer">Google Cal</a>
          </Button>
        </div>
      )}
    </div>
  );
}
