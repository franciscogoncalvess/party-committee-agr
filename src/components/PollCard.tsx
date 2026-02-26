import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-semibold text-base">{poll.question}</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {isOpen ? `Ends ${endsDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Closed"} · {totalVotes + (voted ? 1 : 0)} votes
      </p>

      <div className="mt-3 space-y-2">
        {localOptions.map((option) => {
          const pct = totalVotes + (voted ? 1 : 0) > 0 ? (option.votes / (totalVotes + (voted ? 1 : 0))) * 100 : 0;
          const isSelected = voted === option.id;

          return (
            <button
              key={option.id}
              onClick={() => isOpen && handleVote(option.id)}
              disabled={!!voted || !isOpen}
              className={`relative w-full text-left rounded-md border px-3 py-2 text-sm transition-colors overflow-hidden ${
                isSelected
                  ? "border-primary ring-1 ring-primary/30"
                  : voted
                  ? "border-border"
                  : "border-border hover:border-primary/40 cursor-pointer"
              }`}
            >
              {voted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 rounded-md ${isSelected ? "bg-primary/15" : "bg-muted"}`}
                />
              )}
              <span className="relative flex items-center justify-between">
                <span>{option.label}</span>
                {voted && <span className="text-xs font-medium text-muted-foreground">{Math.round(pct)}%</span>}
              </span>
            </button>
          );
        })}
      </div>

      {!voted && isOpen && (
        <p className="text-xs text-muted-foreground mt-2">Click an option to vote</p>
      )}
    </div>
  );
}
