export type EditorialStatus = "draft" | "illustrative" | "confirmed";
export interface EditorialItem {
  id: string;
  status: EditorialStatus;
}
export interface Match extends EditorialItem {
  teamId: string;
  opponent: string;
  competition: string | null;
  category: string | null;
  startsAt: string | null;
  state: "scheduled" | "completed" | "postponed" | "cancelled";
  scoreSets: string | null;
  setScores: string[];
}
export interface ProjectEvent extends EditorialItem {
  type: "match" | "tryout";
  title: string;
  startsAt: string | null;
  location: string | null;
  category: string | null;
  state: "planned" | "confirmed" | "postponed" | "cancelled";
  registrationState: "open" | "closed" | "to-be-confirmed" | null;
  contactUrl: string | null;
}
export interface Milestone extends EditorialItem {
  title: string;
  date: string | null;
  body: string;
}
export interface StaffMember extends EditorialItem {
  name: string;
  role: string;
  bio: string;
  photoSrc: string | null;
}
export interface Team extends EditorialItem {
  name: string;
  category: string | null;
}
export interface Athlete extends EditorialItem {
  teamId: string;
  name: string;
  position: string | null;
  photoSrc: string | null;
  cutoutSrc?: string | null;
  photoScale?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
}
export interface Partner extends EditorialItem {
  name: string;
  category?: string | null;
  logoSrc: string;
  url?: string | null;
}
