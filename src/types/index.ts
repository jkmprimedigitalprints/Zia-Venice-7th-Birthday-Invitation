export interface EventDetails {
  celebrantName: string;
  age: number;
  tagline: string;
  celebrationTitle: string;
  subtitle: string;
  eventDate: string; // ISO string: 2026-11-14T14:00:00
  displayDate: string;
  displayTime: string;
  venueName: string;
  dressCode: {
    title: string;
    description: string;
    colors: { name: string; hex: string; border?: string }[];
  };
}

export interface CelebrantPhoto {
  id: string;
  slotNumber: number;
  label: string; // "Zia Venice Photo 1"
  src: string;
  alt: string;
}

export interface GuestWish {
  id: string;
  author: string;
  relation: string;
  message: string;
  timestamp: string;
  sparkleEmoji?: string;
}
