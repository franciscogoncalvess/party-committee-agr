import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import type { Poll } from "@/lib/mockData";

export default function PollCard({ poll }: { poll: Poll }) {
  const storageKey = `poll-vote-${poll.id}`;
  const saved = localStorage.getItem(storageKey);
  const [voted, setVoted] = useState<string | null>(saved);
  const [localOptions, setLocalOptions] = useState(() =>
    saved ? poll.options.map((o) => (o.id === saved ? { ...o, votes: o.votes + 1 } : o)) : poll.options
  );
  const totalVotes = localOptions.reduce((s, o) => s + o.votes, 0);
  const endsDate = new Date(poll.endsAt);
  const isOpen = endsDate > new Date();

  const handleVote = (optionId: string) => {
    if (voted) return;
    setVoted(optionId);
    localStorage.setItem(storageKey, optionId);
    setLocalOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o))
    );
  };

  const currentTotal = totalVotes + (voted ? 1 : 0);

  return (
    <div className="card-elevated p-5">
      <h3 className="font-semibold text-[15px]">{poll.question}</h3>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          isOpen ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        }`}>
          <Clock size={10} />
          {isOpen ? `Ends ${endsDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Closed"}
        </span>
        <span className="text-[11px] text-muted-foreground/60 font-medium">
          {currentTotal} vote{currentTotal !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {localOptions.map((option) => {
          const pct = currentTotal > 0 ? (option.votes / currentTotal) * 100 : 0;
          const isSelected = voted === option.id;

          return (
            <button
              key={option.id}
              onClick={() => isOpen && handleVote(option.id)}
              disabled={!!voted || !isOpen}
              className={`group relative w-full text-left rounded-xl border px-4 py-3 text-[13px] font-medium transition-all duration-200 overflow-hidden ${
                isSelected
                  ? "border-primary/40 bg-primary/5"
                  : voted
                  ? "border-border/60 bg-card"
                  : "border-border/60 bg-card hover:border-primary/25 hover:bg-primary/[0.02] cursor-pointer"
              }`}
            >
              {voted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`absolute inset-y-0 left-0 rounded-xl ${
                    isSelected
                      ? "bg-gradient-to-r from-primary/12 to-transparent"
                      : "bg-muted/40"
                  }`}
                />
              )}
              <span className="relative flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {isSelected && <CheckCircle2 size={14} className="text-primary" />}
                  {option.label}
                </span>
                {voted && (
                  <span className={`text-[12px] font-bold tabular-nums ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                    {Math.round(pct)}%
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {!voted && isOpen && (
        <p className="text-[11px] text-muted-foreground/50 mt-3 font-medium">Select an option to cast your vote</p>
      )}
    </div>
  );
}
