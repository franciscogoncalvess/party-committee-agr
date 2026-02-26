import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import AnnouncementCard from "@/components/AnnouncementCard";
import EventCard from "@/components/EventCard";
import { announcements, events } from "@/lib/mockData";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function Index() {
  const sortedAnnouncements = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="container py-10 space-y-12 max-w-[680px]">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center space-y-4 pt-4 pb-2"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-xs font-medium text-primary"
        >
          <Sparkles size={12} />
          Your team hub
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
          Welcome to the
          <br />
          <span className="text-primary">Party Committee</span>
        </h1>
        <p className="text-muted-foreground text-[15px] max-w-sm mx-auto leading-relaxed">
          Events, announcements & team fun — all in one place.
        </p>
      </motion.section>

      {/* Announcements */}
      <section>
        <SectionHeader
          icon={<Megaphone size={15} />}
          title="Announcements"
        />
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {sortedAnnouncements.map((a) => (
            <motion.div key={a.id} variants={fadeUp}>
              <AnnouncementCard announcement={a} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Upcoming Events */}
      <section>
        <SectionHeader
          icon={<CalendarDays size={15} />}
          title="Upcoming Events"
          action={
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary -mr-2">
              <Link to="/events" className="flex items-center gap-1 text-[13px]">
                View all <ArrowRight size={13} />
              </Link>
            </Button>
          }
        />
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
          {upcomingEvents.map((e) => (
            <motion.div key={e.id} variants={fadeUp}>
              <EventCard event={e} compact />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

function SectionHeader({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="flex items-center gap-2.5 font-semibold text-[17px]">
        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary">
          {icon}
        </span>
        {title}
      </h2>
      {action}
    </div>
  );
}
