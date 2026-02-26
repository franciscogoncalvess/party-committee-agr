import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnnouncementCard from "@/components/AnnouncementCard";
import EventCard from "@/components/EventCard";
import { announcements, events } from "@/lib/mockData";

export default function Index() {
  const sortedAnnouncements = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="container py-6 space-y-8 max-w-2xl">
      {/* Hero */}
      <section className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Welcome to the <span className="text-primary">Party Committee</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Your hub for events, announcements & team fun at AGR Inventory.
        </p>
      </section>

      {/* Announcements */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-1.5 font-semibold text-lg">
            <Megaphone size={18} className="text-primary" />
            Announcements
          </h2>
        </div>
        <div className="space-y-3">
          {sortedAnnouncements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-1.5 font-semibold text-lg">
            <CalendarDays size={18} className="text-primary" />
            Upcoming Events
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/events" className="flex items-center gap-1 text-sm">
              View all <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((e) => (
            <EventCard key={e.id} event={e} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
