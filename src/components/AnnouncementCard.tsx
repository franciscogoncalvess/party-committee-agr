import { Pin } from "lucide-react";
import type { Announcement } from "@/lib/mockData";

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <div
      className={`group relative rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] ${
        announcement.pinned
          ? "glass border-primary/20 glow-primary"
          : "glass hover:border-primary/20"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm leading-snug">{announcement.title}</h3>
        {announcement.pinned && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
            <Pin size={10} />
            Pinned
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{announcement.body}</p>
      <time className="mt-2 block text-xs text-muted-foreground/60">
        {new Date(announcement.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </time>
    </div>
  );
}
