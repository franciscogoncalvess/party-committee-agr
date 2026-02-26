import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { Poll } from "@/lib/mockData";

export default function PollCard({ poll }: { poll: Poll }) {
  const [voted, setVoted] = useState<string | null>(null);
  const [localOptions, setLocalOptions] = useState(poll.options);
  const totalVotes = localOptions.reduce((s, o) => s + o.votes, 0);
  const endsDate = new Date(poll.endsAt);
  const isOpen = endsDate > new Date();

  const handleVote = (optionId: string) => {
    if (voted) return;
    setVoted(optionId);
    setLocalOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
    );
  };

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold text-sm">{poll.question}</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {isOpen
          ? `Ends ${endsDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
          : "Closed"}{" "}
        · {totalVotes + (voted ? 1 : 0)} votes
      </p>

      <div className="mt-4 space-y-2">
        {localOptions.map((option) => {
          const currentTotal = totalVotes + (voted ? 1 : 0);
          const pct = currentTotal > 0 ? (option.votes / currentTotal) * 100 : 0;
          const isSelected = voted === option.id;

          return (
            <button
              key={option.id}
              onClick={() => isOpen && handleVote(option.id)}
              disabled={!!voted || !isOpen}
              className={`relative w-full text-left rounded-lg border px-3.5 py-2.5 text-sm transition-all duration-200 overflow-hidden ${
                isSelected
                  ? "border-primary/50 glow-primary"
                  : voted
                  ? "border-border/50"
                  : "border-border/50 hover:border-primary/30 cursor-pointer hover:bg-secondary/50"
              }`}
            >
              {voted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 rounded-lg ${
                    isSelected
                      ? "bg-gradient-to-r from-primary/20 to-primary/5"
                      : "bg-secondary/50"
                  }`}
                />
              )}
              <span className="relative flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {isSelected && <CheckCircle2 size={14} className="text-primary" />}
                  {option.label}
                </span>
                {voted && (
                  <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                    {Math.round(pct)}%
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!voted && isOpen && (
        <p className="text-xs text-muted-foreground/60 mt-3">Click an option to vote</p>
      )}
    </div>
  );
}
