import { Pin } from "lucide-react";
import type { Announcement } from "@/lib/mockData";

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <div className={announcement.pinned ? "card-featured p-5" : "card-elevated p-5"}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[15px] leading-snug">{announcement.title}</h3>
        {announcement.pinned && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider">
            <Pin size={9} />
            Pinned
          </span>
        )}
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{announcement.body}</p>
      <time className="mt-3 block text-[11px] text-muted-foreground/50 font-medium uppercase tracking-wider">
        {new Date(announcement.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </time>
    </div>
  );
}
