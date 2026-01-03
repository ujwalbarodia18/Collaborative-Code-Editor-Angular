export const users = [
  { name: "Alice Johnson", color: "#3b82f6", userId: "1" },      // Blue
  { name: "Marcus Wright", color: "#ef4444", userId: "2" },      // Red
  { name: "Sophia Chen", color: "#10b981", userId: "3" },        // Emerald
  { name: "Julian Voss", color: "#f59e0b", userId: "4" },        // Amber
  { name: "Elena Rodriguez", color: "#8b5cf6", userId: "5" },    // Violet
  { name: "Liam O'Connor", color: "#ec4899", userId: "6" },      // Pink
  { name: "Maya Patel", color: "#06b6d4", userId: "7" },         // Cyan
  { name: "Oscar Dumont", color: "#f97316", userId: "8" },       // Orange
  { name: "Sarah Jenkins", color: "#6366f1", userId: "9" },      // Indigo
  { name: "Victor Thorne", color: "#84cc16", userId: "10" },     // Lime
  { name: "Nora Al-Farsi", color: "#a855f7", userId: "11" },     // Purple
  { name: "Felix Zhang", color: "#14b8a6", userId: "12" },       // Teal
  { name: "Grace Hopper", color: "#d946ef", userId: "13" },      // Fuchsia
  { name: "Xavier Reed", color: "#64748b", userId: "14" },       // Slate
  { name: "Isabella Rossi", color: "#b91c1c", userId: "15" },    // Dark Red
  { name: "Arthur Dent", color: "#4d7c0f", userId: "16" },       // Dark Green
  { name: "Diana Prince", color: "#0369a1", userId: "17" },      // Sky Blue
  { name: "Kevin Flynn", color: "#7e22ce", userId: "18" },       // Dark Purple
  { name: "Ravi Shankar", color: "#be123c", userId: "19" },      // Rose
  { name: "Sasha Grey", color: "#1e293b", userId: "20" }         // Charcoal
];

export const GUEST_KEY = 'collab-guest-user';

export const roomBaseURL = 'room';
export const authBaseURL = 'auth';
export const commonBaseURL = 'common';

export const roomEndPoints = {
  createRoom: roomBaseURL + '/createRoom',
  isRoomPasswordProtected: roomBaseURL + '/isRoomPasswordProtected',
  getRoom: roomBaseURL + '/getRoom',
}

export const authEndPoints = {
  login: authBaseURL + '/login',
  register: authBaseURL + '/register'
}

export const commonEndPoints = {
  getUserDetails: commonBaseURL + '/getUserDetails'
}


