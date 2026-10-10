/**
 * Persistent Database Layer for Zia Venice 7th Birthday Invitation
 * Primary: Firebase Firestore (Realtime Cloud Database)
 * Fallback: Local Disk / In-memory
 */

import fs from 'fs';
import path from 'path';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export interface RSVPRecord {
  id: string;
  name: string;
  status: 'attending' | 'declined';
  submittedAt: string;
}

export interface GuestWishRecord {
  id: string;
  author: string;
  relation: string;
  message: string;
  sparkleEmoji: string;
  timestamp: string;
  createdAt: string;
}

// -------------------------------------------------------------
// Firebase Firestore Setup
// -------------------------------------------------------------
let firestoreDb: ReturnType<typeof getFirestore> | null = null;
let isFirebaseConfigured = false;

try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const rawConfig = fs.readFileSync(configPath, 'utf-8');
    const firebaseConfig = JSON.parse(rawConfig);
    if (firebaseConfig.projectId) {
      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      const dbId = firebaseConfig.firestoreDatabaseId || process.env.FIREBASE_DATABASE_ID;
      firestoreDb = dbId ? getFirestore(app, dbId) : getFirestore(app);
      isFirebaseConfigured = true;
      console.log('[DB] Firebase Firestore initialized successfully for project:', firebaseConfig.projectId);
    }
  }
} catch (err) {
  console.warn('[DB] Failed to initialize Firebase Firestore in server layer:', err);
}

// Local file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const LOCAL_RSVP_FILE = path.join(DATA_DIR, 'rsvp.json');
const LOCAL_MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Ephemeral fallback cache
let memoryRSVPs: RSVPRecord[] = [];
let memoryMessages: GuestWishRecord[] = [];

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {
  // read-only in some serverless environments
}

export function getDatabaseStatus() {
  if (isFirebaseConfigured && firestoreDb) {
    return {
      provider: 'firebase_firestore',
      configured: true,
      message: 'Connected to Google Firebase Firestore (Realtime Cloud DB)',
    };
  }
  return {
    provider: 'local_file',
    configured: false,
    message: 'Running with local file storage. Configure Firebase to enable cloud persistence.',
  };
}

// ==========================================
// RSVP OPERATIONS
// ==========================================

export async function getStoredRSVPs(): Promise<RSVPRecord[]> {
  // 1. Try Firebase Firestore
  if (firestoreDb) {
    try {
      const snapshot = await getDocs(collection(firestoreDb, 'rsvps'));
      const list: RSVPRecord[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: data.id || d.id,
          name: data.name,
          status: data.status === 'declined' ? 'declined' : 'attending',
          submittedAt: data.submittedAt || new Date().toISOString(),
        });
      });
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      return list;
    } catch (err) {
      console.error('[DB] Firestore getStoredRSVPs error:', err);
    }
  }

  // 2. Try Local File
  try {
    if (fs.existsSync(LOCAL_RSVP_FILE)) {
      const content = fs.readFileSync(LOCAL_RSVP_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore read errors
  }

  return memoryRSVPs;
}

export async function saveRSVPRecord(record: {
  name: string;
  status: 'attending' | 'declined';
  id?: string;
  submittedAt?: string;
}): Promise<RSVPRecord> {
  const trimmedName = record.name.trim();
  const currentRSVPs = await getStoredRSVPs();

  // Case-insensitive match for existing guest submission
  const existingIndex = currentRSVPs.findIndex(
    (r) => r.name.toLowerCase() === trimmedName.toLowerCase()
  );

  let finalRecord: RSVPRecord;

  if (existingIndex >= 0) {
    finalRecord = {
      ...currentRSVPs[existingIndex],
      name: trimmedName,
      status: record.status,
      submittedAt: record.submittedAt || new Date().toISOString(),
    };
    currentRSVPs[existingIndex] = finalRecord;
  } else {
    // Safe ID with alphanumeric characters
    const safeId = `rsvp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    finalRecord = {
      id: record.id || safeId,
      name: trimmedName,
      status: record.status,
      submittedAt: record.submittedAt || new Date().toISOString(),
    };
    currentRSVPs.unshift(finalRecord);
  }

  // 1. Persist to Firebase Firestore
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'rsvps', finalRecord.id), {
        id: finalRecord.id,
        name: finalRecord.name,
        status: finalRecord.status,
        submittedAt: finalRecord.submittedAt,
      });
      console.log(`[DB] Firestore saved RSVP for: ${finalRecord.name}`);
    } catch (err: unknown) {
      console.error('[DB] Firestore setDoc failed:', err);
      throw new Error(`Database error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // 2. Persist to Local File
  try {
    fs.writeFileSync(LOCAL_RSVP_FILE, JSON.stringify(currentRSVPs, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem in serverless
  }

  memoryRSVPs = currentRSVPs;
  return finalRecord;
}

export async function deleteRSVPRecord(id: string): Promise<boolean> {
  const currentRSVPs = await getStoredRSVPs();
  const updated = currentRSVPs.filter((r) => r.id !== id);

  // 1. Delete from Firebase Firestore
  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'rsvps', id));
      console.log(`[DB] Firestore deleted RSVP id: ${id}`);
    } catch (err) {
      console.error('[DB] Firestore deleteDoc error:', err);
    }
  }

  // 2. Delete from Local File
  try {
    fs.writeFileSync(LOCAL_RSVP_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem
  }

  memoryRSVPs = updated;
  return true;
}

// ==========================================
// GUESTBOOK MESSAGES OPERATIONS
// ==========================================

export async function getStoredMessages(): Promise<GuestWishRecord[]> {
  // 1. Try Firebase Firestore
  if (firestoreDb) {
    try {
      const snapshot = await getDocs(collection(firestoreDb, 'messages'));
      const msgs: GuestWishRecord[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        msgs.push({
          id: data.id || d.id,
          author: data.author,
          relation: data.relation || 'Royal Guest',
          message: data.message,
          sparkleEmoji: data.sparkleEmoji || '✨',
          timestamp: data.timestamp || 'Just now',
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return msgs;
    } catch (err) {
      console.warn('[DB] Firestore getStoredMessages error:', err);
    }
  }

  // 2. Try Local File
  try {
    if (fs.existsSync(LOCAL_MESSAGES_FILE)) {
      const content = fs.readFileSync(LOCAL_MESSAGES_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore
  }

  return memoryMessages;
}

export async function saveMessageRecord(msg: GuestWishRecord): Promise<GuestWishRecord> {
  const currentMessages = await getStoredMessages();
  const updated = [msg, ...currentMessages];

  // 1. Firebase Firestore
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'messages', msg.id), {
        id: msg.id,
        author: msg.author,
        relation: msg.relation,
        message: msg.message,
        sparkleEmoji: msg.sparkleEmoji,
        timestamp: msg.timestamp,
        createdAt: msg.createdAt,
      });
      console.log(`[DB] Firestore saved message from: ${msg.author}`);
    } catch (err) {
      console.warn('[DB] Firestore insert message error:', err);
    }
  }

  // 2. Local File
  try {
    fs.writeFileSync(LOCAL_MESSAGES_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem
  }

  memoryMessages = updated;
  return msg;
}
