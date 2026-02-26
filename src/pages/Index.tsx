import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnnouncementCard from "@/components/AnnouncementCard";
import EventCard from "@/components/EventCard";
import { announcements, events } from "@/lib/mockData";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Index() {
  const sortedAnnouncements = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="container py-8 space-y-10 max-w-2xl">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3 py-4"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-2">
          <Sparkles size={12} className="text-primary" />
          Your team hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Welcome to the{" "}
          <span className="gradient-text">Party Committee</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Events, announcements & team fun at AGR Inventory — all in one place.
        </p>
      </motion.section>

      {/* Announcements */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Megaphone size={16} className="text-primary" />
            </div>
            Announcements
          </h2>
        </div>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {sortedAnnouncements.map((a) => (
            <motion.div key={a.id} variants={item}>
              <AnnouncementCard announcement={a} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 font-semibold text-lg">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <CalendarDays size={16} className="text-primary" />
            </div>
            Upcoming Events
          </h2>
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary">
            <Link to="/events" className="flex items-center gap-1 text-sm">
              View all <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {upcomingEvents.map((e) => (
            <motion.div key={e.id} variants={item}>
              <EventCard event={e} compact />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
