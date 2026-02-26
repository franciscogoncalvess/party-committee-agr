import PollCard from "@/components/PollCard";
import { polls } from "@/lib/mockData";

export default function Polls() {
  return (
    <div className="container py-6 max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Polls</h1>
      <p className="text-sm text-muted-foreground">Vote and see what the team thinks!</p>
      <div className="space-y-4">
        {polls.map((p) => (
          <PollCard key={p.id} poll={p} />
        ))}
      </div>
    </div>
  );
}
