import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, X, Lightbulb, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [options, setOptions] = useState(
    [...(poll.poll_options ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  );

  const fetchOptions = useCallback(async () => {
    const { data } = await supabase
      .from("poll_options")
      .select("id, label, sort_order, description")
      .eq("poll_id", poll.id)
      .order("sort_order", { ascending: true });
    if (data) setOptions(data as any);
  }, [poll.id]);

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
      .on("postgres_changes", { event: "*", schema: "public", table: "poll_options", filter: `poll_id=eq.${poll.id}` }, () => {
        fetchOptions();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchVotes, fetchOptions, poll.id]);

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

      <SuggestionsSection pollId={poll.id} deviceId={deviceId} isOpen={isOpen} />
    </div>
  );
}

function SuggestionsSection({ pollId, deviceId, isOpen }: { pollId: string; deviceId: string; isOpen: boolean }) {
  const [suggestions, setSuggestions] = useState<{ id: string; label: string; description: string; device_id: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    const { data } = await supabase
      .from("poll_suggestions")
      .select("id, label, description, device_id")
      .eq("poll_id", pollId)
      .order("created_at", { ascending: true });
    if (data) setSuggestions(data as any);
  }, [pollId]);

  useEffect(() => {
    fetchSuggestions();
    const channel = supabase
      .channel(`poll-suggestions-${pollId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "poll_suggestions", filter: `poll_id=eq.${pollId}` }, () => fetchSuggestions())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchSuggestions, pollId]);

  const handleSubmit = async () => {
    const trimmed = label.trim();
    if (!trimmed) return;
    if (trimmed.length > 120) { toast.error("Keep it under 120 characters"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("poll_suggestions").insert({
      poll_id: pollId,
      label: trimmed,
      description: description.trim().slice(0, 280),
      device_id: deviceId,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Idea submitted!");
    setLabel(""); setDescription(""); setShowForm(false);
  };

  return (
    <div className="mt-5 pt-4 border-t border-border/50">
      <div className="flex items-center justify-between">
        <h4 className="text-[12px] font-semibold flex items-center gap-1.5 text-muted-foreground">
          <Lightbulb size={12} /> Ideas from the team {suggestions.length > 0 && <span className="text-muted-foreground/60">({suggestions.length})</span>}
        </h4>
        {isOpen && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-[11px] font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <Plus size={11} /> Suggest
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {suggestions.map((s) => (
            <li key={s.id} className="rounded-lg bg-muted/40 px-3 py-2 text-[12px]">
              <p className="font-medium">{s.label}</p>
              {s.description && <p className="text-[11px] text-muted-foreground mt-0.5">{s.description}</p>}
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <div className="mt-3 space-y-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={120}
            placeholder="Your idea"
            className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-[13px] focus:outline-none focus:border-primary/40"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={280}
            placeholder="Why? (optional)"
            rows={2}
            className="w-full rounded-lg border border-border/60 bg-card px-3 py-2 text-[12px] focus:outline-none focus:border-primary/40 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !label.trim()}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Submit"}
            </button>
            <button
              onClick={() => { setShowForm(false); setLabel(""); setDescription(""); }}
              className="text-[12px] font-medium px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {suggestions.length === 0 && !showForm && (
        <p className="text-[11px] text-muted-foreground/60 mt-1.5">Got a better option? Share it!</p>
      )}
    </div>
  );
}
