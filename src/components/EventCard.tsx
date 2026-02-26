import { CalendarDays, MapPin, Users, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/mockData";
import { useState } from "react";

function generateICS(event: Event) {
  const start = new Date(`${event.date}T${event.time}:00`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${fmt(start)}\nDTEND:${fmt(end)}\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
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
  const capacityPct = ((event.rsvpCount + (rsvpd ? 1 : 0)) / event.maxCapacity) * 100;

  return (
    <div className="card-elevated p-5">
      <div className="flex gap-4">
        {/* Date badge */}
        <div className="shrink-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary w-16 h-16 border border-primary/10">
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {dateObj.toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="text-2xl font-bold leading-none -mt-0.5">{dateObj.getDate()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[15px] truncate">{event.title}</h3>
          {!compact && <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{event.description}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
            <MetaItem icon={<CalendarDays size={12} />} text={dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} />
            <MetaItem icon={<MapPin size={12} />} text={event.location} />
            <MetaItem icon={<Users size={12} />} text={`${spotsLeft} spots left`} highlight={spotsLeft < 10} />
          </div>
        </div>
      </div>

      {!compact && (
        <>
          {/* Capacity bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">{Math.round(capacityPct)}%</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              size="sm"
              variant={rsvpd ? "secondary" : "default"}
              onClick={() => setRsvpd(!rsvpd)}
              className={`rounded-xl text-[13px] ${rsvpd ? "" : "badge-glow"}`}
            >
              {rsvpd ? "Cancel RSVP" : "RSVP Now"}
            </Button>
            <Button size="sm" variant="outline" onClick={downloadICS} className="rounded-xl text-[13px] gap-1.5">
              <Download size={12} /> .ics
            </Button>
            <Button size="sm" variant="outline" asChild className="rounded-xl text-[13px] gap-1.5">
              <a href={googleCalUrl()} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={12} /> Google Cal
              </a>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function MetaItem({ icon, text, highlight }: { icon: React.ReactNode; text: string; highlight?: boolean }) {
  return (
    <span className={`flex items-center gap-1.5 text-[12px] font-medium ${highlight ? "text-warning" : "text-muted-foreground"}`}>
      {icon}{text}
    </span>
  );
}
