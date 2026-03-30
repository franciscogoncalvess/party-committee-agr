import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, LogOut, Pin, Pencil, X } from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const { session, loading, signOut } = useAuth();

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Loading…</div>;
  if (!session) return <Navigate to="/login" replace />;

  return (
    <div className="container py-10 max-w-[720px] space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🎛️ Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut size={14} /> Logout
        </Button>
      </div>
      <Tabs defaultValue="events">
        <TabsList className="w-full">
          <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
          <TabsTrigger value="polls" className="flex-1">Polls</TabsTrigger>
          <TabsTrigger value="announcements" className="flex-1">Announcements</TabsTrigger>
        </TabsList>
        <TabsContent value="events"><EventsAdmin /></TabsContent>
        <TabsContent value="polls"><PollsAdmin /></TabsContent>
        <TabsContent value="announcements"><AnnouncementsAdmin /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── Events Admin ─── */
function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [location, setLocation] = useState("");

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: true });
    setEvents(data ?? []);
  };
  useEffect(() => { fetchEvents(); }, []);

  const handleAdd = async () => {
    if (!title || !date) { toast.error("Title and date required"); return; }
    const { error } = await supabase.from("events").insert({ title, description, date, time, location });
    if (error) { toast.error(error.message); return; }
    toast.success("Event created!");
    setTitle(""); setDescription(""); setDate(""); setTime("12:00"); setLocation("");
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast.success("Deleted");
    fetchEvents();
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="card-elevated p-5 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2"><Plus size={14} /> New Event</h3>
        <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <div className="grid grid-cols-3 gap-2">
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
          <Input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <Button onClick={handleAdd} size="sm">Create Event</Button>
      </div>
      <div className="space-y-2">
        {events.map(e => (
          <div key={e.id} className="card-elevated p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{e.title}</p>
              <p className="text-xs text-muted-foreground">{e.date} · {e.time} · {e.location}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)}>
              <Trash2 size={14} className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Polls Admin ─── */
function PollsAdmin() {
  const [polls, setPolls] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [options, setOptions] = useState<{ label: string; description: string }[]>([
    { label: "", description: "" },
    { label: "", description: "" },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPolls = async () => {
    const { data } = await supabase.from("polls").select("*, poll_options(*)").order("created_at", { ascending: false });
    setPolls(data ?? []);
  };
  useEffect(() => { fetchPolls(); }, []);

  const resetForm = () => {
    setQuestion(""); setActivityDate(""); setEndsAt("");
    setOptions([{ label: "", description: "" }, { label: "", description: "" }]);
    setEditingId(null);
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setQuestion(p.question);
    setActivityDate(p.activity_date ?? "");
    setEndsAt(p.ends_at);
    const sorted = [...(p.poll_options ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order);
    setOptions(sorted.map((o: any) => ({ label: o.label, description: o.description ?? "" })));
  };

  const handleAdd = async () => {
    if (!question || !endsAt || options.filter(o => o.label.trim()).length < 2) {
      toast.error("Need question, end date, and at least 2 options"); return;
    }

    if (editingId) {
      const { error } = await supabase.from("polls").update({ question, ends_at: endsAt, activity_date: activityDate || null } as any).eq("id", editingId);
      if (error) { toast.error(error.message); return; }
      await supabase.from("poll_options").delete().eq("poll_id", editingId);
      const optRows = options.filter(o => o.label.trim()).map((o, i) => ({ poll_id: editingId, label: o.label, description: o.description || "", sort_order: i } as any));
      await supabase.from("poll_options").insert(optRows);
      toast.success("Poll updated!");
    } else {
      const { data, error } = await supabase.from("polls").insert({ question, ends_at: endsAt, activity_date: activityDate || null } as any).select().single();
      if (error || !data) { toast.error(error?.message ?? "Error"); return; }
      const optRows = options.filter(o => o.label.trim()).map((o, i) => ({ poll_id: data.id, label: o.label, description: o.description || "", sort_order: i } as any));
      await supabase.from("poll_options").insert(optRows);
      toast.success("Poll created!");
    }
    resetForm();
    fetchPolls();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("polls").delete().eq("id", id);
    toast.success("Deleted");
    if (editingId === id) resetForm();
    fetchPolls();
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="card-elevated p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            {editingId ? <><Pencil size={14} /> Edit Poll</> : <><Plus size={14} /> New Poll</>}
          </h3>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={resetForm}><X size={14} /> Cancel</Button>
          )}
        </div>
        <Input placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Activity Date</label>
            <Input type="date" value={activityDate} onChange={e => setActivityDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Voting Ends</label>
            <Input type="date" value={endsAt} onChange={e => setEndsAt(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={i} className="space-y-1">
              <div className="flex gap-2">
                <Input
                  placeholder={`Option ${i + 1}`}
                  value={opt.label}
                  onChange={e => { const n = [...options]; n[i] = { ...n[i], label: e.target.value }; setOptions(n); }}
                />
                {options.length > 2 && (
                  <Button variant="ghost" size="icon" onClick={() => setOptions(options.filter((_, j) => j !== i))}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
              <Input
                placeholder="Description (optional)"
                value={opt.description}
                className="text-xs"
                onChange={e => { const n = [...options]; n[i] = { ...n[i], description: e.target.value }; setOptions(n); }}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setOptions([...options, { label: "", description: "" }])}>
            <Plus size={12} /> Add Option
          </Button>
        </div>
        <Button onClick={handleAdd} size="sm">{editingId ? "Update Poll" : "Create Poll"}</Button>
      </div>
      <div className="space-y-2">
        {polls.map(p => (
          <div key={p.id} className="card-elevated p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{p.question}</p>
              <p className="text-xs text-muted-foreground">Ends: {p.ends_at} · {p.poll_options?.length ?? 0} options</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                <Pencil size={14} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                <Trash2 size={14} className="text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Announcements Admin ─── */
function AnnouncementsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pinned, setPinned] = useState(false);

  const fetch_ = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { fetch_(); }, []);

  const handleAdd = async () => {
    if (!title) { toast.error("Title required"); return; }
    await supabase.from("announcements").insert({ title, body, pinned });
    toast.success("Announcement created!");
    setTitle(""); setBody(""); setPinned(false);
    fetch_();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast.success("Deleted");
    fetch_();
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="card-elevated p-5 space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2"><Plus size={14} /> New Announcement</h3>
        <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <Textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} />
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} className="rounded" />
          <Pin size={12} /> Pin this announcement
        </label>
        <Button onClick={handleAdd} size="sm">Create Announcement</Button>
      </div>
      <div className="space-y-2">
        {items.map(a => (
          <div key={a.id} className="card-elevated p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.date} {a.pinned ? "📌" : ""}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}>
              <Trash2 size={14} className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
