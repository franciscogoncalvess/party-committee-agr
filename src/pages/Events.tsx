import EventCard from "@/components/EventCard";
import { events } from "@/lib/mockData";

export default function Events() {
  return (
    <div className="container py-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Events</h1>
      <p className="text-sm text-muted-foreground">RSVP and add events to your calendar.</p>
      <div className="space-y-3">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
}
