import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("device_id", id); }
  return id;
}

interface EventProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    max_capacity: number;
  };
  compact?: boolean;
}

export default function EventCard({ event, compact }: EventProps) {
  const [rsvpd, setRsvpd] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [notGoingCount, setNotGoingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dateObj = new Date(event.date + "T" + event.time);
  const deviceId = getDeviceId();

  const fetchRsvps = useCallback(async () => {
    const { count: goingC } = await supabase.from("event_rsvps").select("*", { count: "exact", head: true }).eq("event_id", event.id).eq("status", "going");
    setRsvpCount(goingC ?? 0);
    const { count: notGoingC } = await supabase.from("event_rsvps").select("*", { count: "exact", head: true }).eq("event_id", event.id).eq("status", "not_going");
    setNotGoingCount(notGoingC ?? 0);
    const { data } = await supabase.from("event_rsvps").select("id, status").eq("event_id", event.id).eq("device_id", deviceId).maybeSingle();
    setRsvpd(data?.status === "going");
  }, [event.id, deviceId]);

  useEffect(() => { fetchRsvps(); }, [fetchRsvps]);

  useEffect(() => {
    const channel = supabase.channel(`rsvps-${event.id}`).on("postgres_changes", { event: "*", schema: "public", table: "event_rsvps", filter: `event_id=eq.${event.id}` }, () => fetchRsvps()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [event.id, fetchRsvps]);

  const handleRsvp = async (status: "going" | "not_going") => {
    setLoading(true);
    await supabase.from("event_rsvps").delete().eq("event_id", event.id).eq("device_id", deviceId);
    await supabase.from("event_rsvps").insert({ event_id: event.id, device_id: deviceId, status });
    await fetchRsvps();
    setLoading(false);
  };

  return (
    <div className="card-elevated p-5">
      <div className="flex gap-4">
        <div className="shrink-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary w-16 h-16 border border-primary/10">
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {dateObj.toLocaleDateString("en-US", { month: "short" })}
          </span>
          <span className="text-2xl font-bold leading-none -mt-0.5">{dateObj.getDate()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[15px] truncate">{event.title}</h3>
          {!compact && <p className="text-[13px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{event.description}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
            <MetaItem icon={<CalendarDays size={12} />} text={dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} />
            <MetaItem icon={<MapPin size={12} />} text={event.location} />
            <MetaItem icon={<Users size={12} />} text={`${rsvpCount} going · ${notGoingCount} not going`} />
          </div>
        </div>
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            size="sm"
            variant={rsvpd ? "default" : "outline"}
            onClick={() => { if (!rsvpd) handleRsvp("going"); }}
            disabled={loading}
            className={`rounded-xl text-[13px] ${rsvpd ? "badge-glow" : ""}`}
          >
            ✅ I'm going
          </Button>
          <Button
            size="sm"
            variant={!rsvpd ? "default" : "outline"}
            onClick={() => { handleRsvp("not_going"); }}
            disabled={loading}
            className="rounded-xl text-[13px]"
          >
            ❌ I'm not going
          </Button>
        </div>
      )}
    </div>
  );
}

function MetaItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
      {icon}{text}
    </span>
  );
}
