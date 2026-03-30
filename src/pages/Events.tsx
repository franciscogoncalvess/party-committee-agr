import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetch_ = async () => {
      const { data } = await supabase.from("events").select("*").order("date", { ascending: true });
      setEvents(data ?? []);
    };
    fetch_();
  }, []);

  return (
    <div className="container py-10 max-w-[680px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-[14px] text-muted-foreground mt-1.5">RSVP and add events to your calendar.</p>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
        {events.map((e) => (
          <motion.div key={e.id} variants={fadeUp}>
            <EventCard event={e} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
