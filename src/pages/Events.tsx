import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/mockData";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Events() {
  return (
    <div className="container py-8 max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <p className="text-sm text-muted-foreground mt-1">RSVP and add events to your calendar.</p>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
        {events.map((e) => (
          <motion.div key={e.id} variants={item}>
            <EventCard event={e} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
