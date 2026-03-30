import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PollCard from "@/components/PollCard";
import { supabase } from "@/integrations/supabase/client";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

interface PollFromDB {
  id: string;
  question: string;
  ends_at: string;
  activity_date?: string;
  poll_options: { id: string; label: string; sort_order: number; description?: string }[];
}

export default function Polls() {
  const [polls, setPolls] = useState<PollFromDB[]>([]);

  useEffect(() => {
    const fetch_ = async () => {
      const { data } = await supabase
        .from("polls")
        .select("*, poll_options(*)")
        .order("created_at", { ascending: false });
      setPolls((data as PollFromDB[]) ?? []);
    };
    fetch_();
  }, []);

  return (
    <div className="container py-10 max-w-[680px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Polls</h1>
        <p className="text-[14px] text-muted-foreground mt-1.5">Vote and see what the team thinks!</p>
      </div>
      <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
        {polls.map((p) => (
          <motion.div key={p.id} variants={fadeUp}>
            <PollCard poll={p} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
