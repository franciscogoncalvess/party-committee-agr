export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  maxCapacity: number;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  endsAt: string;
  totalVotes: number;
}

export const announcements: Announcement[] = [
  {
    id: "1",
    title: "📢 Welcome to AGR Party Committee!",
    body: "This is where announcements from the Party Committee will appear. Stay tuned for updates on upcoming events, activities, and everything fun happening at AGR!",
    date: "2026-02-26",
    pinned: true,
  },
];

export const events: Event[] = [
  {
    id: "1",
    title: "AGR Local — Ask Me Anything with Haukur",
    description: "Join Haukur for an open AMA session. Bring your questions, curiosity, and good energy!",
    date: "2026-02-26",
    time: "12:00",
    location: "AGR Office",
    rsvpCount: 0,
    maxCapacity: 50,
  },
];

export const polls: Poll[] = [
  {
    id: "1",
    question: "What should our next team activity be?",
    options: [
      { id: "1a", label: "🏄 Surf", votes: 0 },
      { id: "1b", label: "🎳 Bowling", votes: 0 },
      { id: "1c", label: "🏎️ Karts", votes: 0 },
      { id: "1d", label: "🧗 Bouldering", votes: 0 },
      { id: "1e", label: "🧠 Quiz Game", votes: 0 },
      { id: "1f", label: "🧘 Pilates", votes: 0 },
    ],
    endsAt: "2026-03-15",
    totalVotes: 0,
  },
];
