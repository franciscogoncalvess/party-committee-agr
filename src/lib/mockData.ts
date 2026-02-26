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
    title: "🎉 Year-End Party Date Confirmed!",
    body: "Mark your calendars — our annual celebration is on December 20th at The Grand Hall. More details coming soon!",
    date: "2026-02-25",
    pinned: true,
  },
  {
    id: "2",
    title: "New Break Room Snack Menu",
    body: "We've refreshed the snack rotation based on your survey results. Check out the new options starting Monday!",
    date: "2026-02-24",
    pinned: false,
  },
  {
    id: "3",
    title: "Volunteer Day Sign-Ups Open",
    body: "Join us on March 15th for our community volunteer day. Sign up by March 5th to reserve your spot.",
    date: "2026-02-22",
    pinned: false,
  },
];

export const events: Event[] = [
  {
    id: "1",
    title: "Team Bowling Night 🎳",
    description: "Friendly competition at Lucky Lanes. Pizza and drinks included!",
    date: "2026-03-07",
    time: "18:00",
    location: "Lucky Lanes Bowling",
    rsvpCount: 18,
    maxCapacity: 30,
  },
  {
    id: "2",
    title: "Spring Picnic in the Park",
    description: "Outdoor lunch, games, and good vibes. Bring your family!",
    date: "2026-03-21",
    time: "11:00",
    location: "Central Park Pavilion",
    rsvpCount: 24,
    maxCapacity: 50,
  },
  {
    id: "3",
    title: "Trivia Night",
    description: "Form teams of 4 and battle for bragging rights + prizes.",
    date: "2026-04-04",
    time: "19:00",
    location: "Office Cafeteria",
    rsvpCount: 12,
    maxCapacity: 40,
  },
  {
    id: "4",
    title: "Cooking Class: Thai Cuisine",
    description: "Learn to cook Pad Thai and Tom Yum with Chef Somsak.",
    date: "2026-04-18",
    time: "17:30",
    location: "Community Kitchen",
    rsvpCount: 8,
    maxCapacity: 16,
  },
];

export const polls: Poll[] = [
  {
    id: "1",
    question: "What should our next team building activity be?",
    options: [
      { id: "1a", label: "Escape Room", votes: 14 },
      { id: "1b", label: "Go-Karting", votes: 22 },
      { id: "1c", label: "Cooking Class", votes: 9 },
      { id: "1d", label: "Hiking Trip", votes: 17 },
    ],
    endsAt: "2026-03-10",
    totalVotes: 62,
  },
  {
    id: "2",
    question: "Preferred lunch spot for March team lunch?",
    options: [
      { id: "2a", label: "Sushi Garden", votes: 11 },
      { id: "2b", label: "Burger House", votes: 8 },
      { id: "2c", label: "Thai Palace", votes: 15 },
    ],
    endsAt: "2026-03-05",
    totalVotes: 34,
  },
  {
    id: "3",
    question: "Best day for weekly game hour?",
    options: [
      { id: "3a", label: "Wednesday", votes: 0 },
      { id: "3b", label: "Thursday", votes: 0 },
      { id: "3c", label: "Friday", votes: 0 },
    ],
    endsAt: "2026-03-15",
    totalVotes: 0,
  },
];
