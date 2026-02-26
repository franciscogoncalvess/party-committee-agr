import { motion } from "framer-motion";
import PollCard from "@/components/PollCard";
import { polls } from "@/lib/mockData";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function Polls() {
  return (
    <div className="container py-8 max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Polls</h1>
        <p className="text-sm text-muted-foreground mt-1">Vote and see what the team thinks!</p>
      </div>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
        {polls.map((p) => (
          <motion.div key={p.id} variants={item}>
            <PollCard poll={p} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
