import { Pin } from "lucide-react";
import type { Announcement } from "@/lib/mockData";

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <div className={`rounded-lg border p-4 transition-shadow hover:shadow-md ${announcement.pinned ? "border-primary/30 bg-primary/5" : "bg-card"}`}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-base leading-snug">{announcement.title}</h3>
        {announcement.pinned && <Pin size={14} className="text-primary shrink-0 mt-1" />}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{announcement.body}</p>
      <time className="mt-2 block text-xs text-muted-foreground">
        {new Date(announcement.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </time>
    </div>
  );
}
