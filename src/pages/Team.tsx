import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Crown, Wrench, Megaphone, Sparkles, Sprout } from "lucide-react";

import joseImg from "@/assets/team/jose.jpeg";
import franciscoImg from "@/assets/team/francisco.png";
import claudioImg from "@/assets/team/claudio.png";
import astaImg from "@/assets/team/asta.png";
import vanessaImg from "@/assets/team/vanessa.jpeg";

interface Member {
  name: string;
  photo: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tier: "king" | "council" | "intern";
}

const members: Member[] = [
  {
    name: "José Mendes",
    photo: joseImg,
    title: "The President",
    subtitle: "Supreme leader of celebrations, keeper of the party budget, master of the mic drop.",
    icon: Crown,
    tier: "king",
  },
  {
    name: "Francisco Gonçalves",
    photo: franciscoImg,
    title: 'Head of "I\'ll Handle It" Department',
    subtitle: "The multitasking problem-solver who somehow makes everything happen on time.",
    icon: Wrench,
    tier: "council",
  },
  {
    name: "Cláudio Bessa",
    photo: claudioImg,
    title: "Chief Communications Officer of Fun",
    subtitle: "The official voice, announcer, and hype manager of all party-related matters.",
    icon: Megaphone,
    tier: "council",
  },
  {
    name: "Asta",
    photo: astaImg,
    title: "The Vibes Consultant",
    subtitle: "Emotional support, calm energy, and the team's morale booster extraordinaire.",
    icon: Sparkles,
    tier: "council",
  },
  {
    name: "Vanessa Pinto",
    photo: vanessaImg,
    title: "The Intern",
    subtitle: "Newest member of the royal court. Full of potential, fresh energy, and a lot of questions.",
    icon: Sprout,
    tier: "intern",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

function MemberCard({ member, index }: { member: Member; index: number }) {
  const isKing = member.tier === "king";
  const isIntern = member.tier === "intern";

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className={`relative group ${isKing ? "col-span-full flex justify-center" : ""} ${isIntern ? "col-span-full flex justify-center" : ""}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 h-full flex flex-col items-center justify-start ${
          isKing
            ? "card-featured w-full max-w-md p-6 text-center"
            : isIntern
            ? "card-elevated w-full max-w-sm p-5 text-center"
            : "card-elevated p-5 text-center w-full"
        }`}
      >
        {/* Decorative glow for the king */}
        {isKing && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Photo avatar */}
        <div className="relative mx-auto mb-3">
          <div
            className={`overflow-hidden rounded-full ${
              isKing
                ? "w-20 h-20 ring-2 ring-primary/20"
                : isIntern
                ? "w-14 h-14 ring-2 ring-accent/15"
                : "w-16 h-16 ring-2 ring-border"
            }`}
          >
            <img src={member.photo} alt={member.name} className="w-full h-full object-cover object-top" />
          </div>
          {isKing && (
            <motion.div
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
              className="absolute -top-2 -right-2 text-2xl"
            >
              ✦
            </motion.div>
          )}
        </div>

        {/* Name & title */}
        <h3 className={`font-bold tracking-tight ${isKing ? "text-xl" : "text-[15px]"}`}>
          {member.name}
        </h3>
        <p className={`font-semibold mt-0.5 ${
          isKing ? "text-primary text-[14px]" : isIntern ? "text-accent text-[12px]" : "text-muted-foreground text-[12px]"
        }`}>
          {member.title}
        </p>
        <p className="text-muted-foreground text-[12px] mt-2 leading-relaxed max-w-[260px] mx-auto">
          {member.subtitle}
        </p>

        {/* Role badge */}
        <div className="mt-3">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
            isKing
              ? "bg-primary/10 text-primary"
              : isIntern
              ? "bg-accent/10 text-accent"
              : "bg-secondary text-secondary-foreground"
          }`}>
            <member.icon size={10} />
            {isKing ? "Royal Decree" : isIntern ? "Fresh Blood" : "Royal Council"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const king = members.filter((m) => m.tier === "king");
  const council = members.filter((m) => m.tier === "council");
  const interns = members.filter((m) => m.tier === "intern");

  return (
    <div className="container py-10 max-w-[720px] space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Meet the <span className="text-primary">Party Committee</span>
        </h1>
        <p className="text-[14px] text-muted-foreground max-w-md mx-auto">
          The Royal Court of Celebrations — a carefully curated hierarchy of fun, chaos, and good vibes.
        </p>
      </motion.div>

      {/* Connector line from king to council */}
      <div className="relative">
        {/* The King */}
        <div className="relative">
          {king.map((m, i) => (
            <MemberCard key={m.name} member={m} index={i} />
          ))}
        </div>

        {/* Tree connector */}
        <div className="flex justify-center">
          <div className="w-px h-8 bg-border" />
        </div>
        <div className="flex justify-center mb-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 bg-background px-3 py-1 rounded-full border border-border/60">
            The Royal Council
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-px h-4 bg-border" />
        </div>

        {/* Horizontal branch line */}
        <div className="flex justify-center px-8">
          <div className="w-full max-w-lg h-px bg-border" />
        </div>

        {/* Council */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {council.map((m, i) => (
            <MemberCard key={m.name} member={m} index={i + 1} />
          ))}
        </div>

        {/* Tree connector to intern */}
        <div className="flex justify-center">
          <div className="w-px h-8 bg-border" />
        </div>
        <div className="flex justify-center mb-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 bg-background px-3 py-1 rounded-full border border-border/60 border-dashed">
            New to the Court
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-px h-4 bg-border border-dashed" />
        </div>

        {/* Intern */}
        {interns.map((m, i) => (
          <MemberCard key={m.name} member={m} index={i + 4} />
        ))}
      </div>
    </div>
  );
}
