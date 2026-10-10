import { EventDetails, CelebrantPhoto, GuestWish } from '../types';

export const EVENT_DATA: EventDetails = {
  celebrantName: 'Zia Venice Abonal',
  age: 7,
  tagline: 'turns 7!',
  celebrationTitle: 'A Magical 7th Birthday Celebration',
  subtitle: 'Join us for a day filled with magic, laughter, and wonderful memories.',
  // Target date for countdown: November 14, 2026 at 6:30 PM
  eventDate: '2026-11-14T18:30:00',
  displayDate: 'Saturday, November 14, 2026',
  displayTime: '6:30 PM',
  venueName: 'Jollibee Bayani Road Taguig',
  dressCode: {
    title: 'Fairytale Garden Attire',
    description: 'Come in your favorite cheerful pastel princess or fairytale-inspired attire. Soft pastels and warm smiles are welcomed!',
    colors: [
      { name: 'Soft Powder Blue', hex: '#D8ECF8', border: '#b8daf0' },
      { name: 'Pale Lavender', hex: '#EBE2F7', border: '#d5c4ef' },
      { name: 'Blush Pink', hex: '#FADEE5', border: '#f2bdcb' },
      { name: 'Soft Peach', hex: '#FEEADB', border: '#f7d3ba' },
      { name: 'Cream / White', hex: '#FFFDF9', border: '#ede6da' },
      { name: 'Subtle Gold', hex: '#E2C781', border: '#cfa950' },
    ],
  },
};

// Exactly 7 photos of ZIA VENICE ABONAL (first.jpg to seven.jpg)
export const ZIA_PHOTOS: CelebrantPhoto[] = [
  {
    id: 'zia-photo-1',
    slotNumber: 1,
    label: 'Zia Venice Photo 1',
    src: '/first.jpg',
    alt: 'Zia Venice Abonal Photo 1',
  },
  {
    id: 'zia-photo-2',
    slotNumber: 2,
    label: 'Zia Venice Photo 2',
    src: '/second.jpg',
    alt: 'Zia Venice Abonal Photo 2',
  },
  {
    id: 'zia-photo-3',
    slotNumber: 3,
    label: 'Zia Venice Photo 3',
    src: '/third.jpg',
    alt: 'Zia Venice Abonal Photo 3',
  },
  {
    id: 'zia-photo-4',
    slotNumber: 4,
    label: 'Zia Venice Photo 4',
    src: '/fourth.jpg',
    alt: 'Zia Venice Abonal Photo 4',
  },
  {
    id: 'zia-photo-5',
    slotNumber: 5,
    label: 'Zia Venice Photo 5',
    src: '/fifth.jpg',
    alt: 'Zia Venice Abonal Photo 5',
  },
  {
    id: 'zia-photo-6',
    slotNumber: 6,
    label: 'Zia Venice Photo 6',
    src: '/sixth.jpg',
    alt: 'Zia Venice Abonal Photo 6',
  },
  {
    id: 'zia-photo-7',
    slotNumber: 7,
    label: 'Zia Venice Photo 7',
    src: '/seven.jpg',
    alt: 'Zia Venice Abonal Photo 7',
  },
];

export const INITIAL_WISHES: GuestWish[] = [];
