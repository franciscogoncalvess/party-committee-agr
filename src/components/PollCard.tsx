import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function getDeviceId(): string {
  const key = "agr-device-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

interface PollProps {
  poll: {
    id: string;
    question: string;
    ends_at: string;
    activity_date?: string;
    poll_options: { id: string; label: string; sort_order: number; description?: string }[];
  };
}

export default function PollCard({ poll }: PollProps) {
  const deviceId = getDeviceId();
  const [voted, setVoted] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const options = [...(poll.poll_options ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  const fetchVotes = useCallback(async () => {
    const { data } = await supabase
      .from("poll_votes")
      .select("option_id, device_id")
      .eq("poll_id", poll.id);

    if (data) {
      const counts: Record<string, number> = {};
      let myVote: string | null = null;
      for (const row of data) {
        counts[row.option_id] = (counts[row.option_id] || 0) + 1;
        if (row.device_id === deviceId) myVote = row.option_id;
      }
      setVoteCounts(counts);
      setVoted(myVote);
    }
    setLoading(false);
  }, [poll.id, deviceId]);

  useEffect(() => {
    fetchVotes();
    const channel = supabase
      .channel(`poll-${poll.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "poll_votes", filter: `poll_id=eq.${poll.id}` }, () => {
        fetchVotes();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchVotes, poll.id]);

  const endsDate = new Date(poll.ends_at);
  const isOpen = endsDate > new Date();
  const totalVotes = options.reduce((s, o) => s + (voteCounts[o.id] || 0), 0);

  const handleVote = async (optionId: string) => {
    if (voted || !isOpen) return;
    setVoted(optionId);
    setVoteCounts((prev) => ({ ...prev, [optionId]: (prev[optionId] || 0) + 1 }));
    await supabase.from("poll_votes").insert({ poll_id: poll.id, option_id: optionId, device_id: deviceId });
  };

  const handleUnvote = async () => {
    if (!voted) return;
    const prev = voted;
    setVoted(null);
    setVoteCounts((c) => ({ ...c, [prev]: Math.max((c[prev] || 1) - 1, 0) }));
    await supabase.from("poll_votes").delete().eq("poll_id", poll.id).eq("device_id", deviceId);
  };

  return (
    <div className="card-elevated p-5">
      <h3 className="font-semibold text-[15px]">{poll.question}</h3>
      {poll.activity_date && (
        <p className="text-[12px] text-muted-foreground mt-1">
          📅 Activity: {new Date(poll.activity_date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      )}
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          isOpen ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
        }`}>
          <Clock size={10} />
          {isOpen ? `Ends ${endsDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Closed"}
        </span>
        <span className="text-[11px] text-muted-foreground/60 font-medium">
          {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="text-[13px] text-muted-foreground py-4 text-center">Loading…</div>
        ) : (
          options.map((option) => {
            const count = voteCounts[option.id] || 0;
            const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
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
                    <span>
                      {option.label}
                      {option.description && (
                        <span className="block text-[11px] text-muted-foreground font-normal">{option.description}</span>
                      )}
                    </span>
                  </span>
                  {voted && (
                    <span className={`text-[12px] font-bold tabular-nums ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                      {Math.round(pct)}%
                    </span>
                  )}
                </span>
              </button>
            );
          })
        )}
      </div>

      {!voted && isOpen && !loading && (
        <p className="text-[11px] text-muted-foreground/50 mt-3 font-medium">Select an option to cast your vote</p>
      )}
      {voted && isOpen && (
        <button
          onClick={handleUnvote}
          className="flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-destructive mt-3 font-medium transition-colors"
        >
          <X size={12} />
          Remove my vote
        </button>
      )}
    </div>
  );
}
