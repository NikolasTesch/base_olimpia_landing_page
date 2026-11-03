import type { Team, Athlete } from '../types/content';

export type EditableTeam = Omit<Team, 'status'> & { status?: Team['status'] };
export type EditableAthlete = Omit<Athlete, 'status'> & {
  status?: Athlete['status'];
  cutoutSrc?: string | null;
  photoScale?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
};

export interface EditableInstagramPost {
  id: string;
  account: string;
  title: string;
  excerpt: string;
  imageSrc: string;
  mediaType?: 'image' | 'video';
  videoSrc?: string | null;
  permalink: string;
  publishedAt: string | null;
  selected?: boolean;
  status?: string;
}

export interface TeamsOverridePayload {
  updatedAt: string;
  teams: EditableTeam[];
  athletes: EditableAthlete[];
}

export const OWNER_STORAGE_KEY = 'base:equipes-override:v1';
export const OWNER_INSTAGRAM_KEY = 'base:instagram-override:v1';

export function loadTeamsOverride(): TeamsOverridePayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(OWNER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TeamsOverridePayload;
    if (!Array.isArray(parsed.teams) || !Array.isArray(parsed.athletes)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveTeamsOverrideLocal(
  teams: EditableTeam[],
  athletes: EditableAthlete[]
): TeamsOverridePayload {
  const payload: TeamsOverridePayload = {
    updatedAt: new Date().toISOString(),
    teams: teams.map((t) => ({ ...t, status: t.status ?? 'illustrative' })),
    athletes: athletes.map((a) => ({ ...a, status: a.status ?? 'illustrative' })),
  };
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent('base:teams-updated', { detail: payload }));
  }
  return payload;
}

export function clearTeamsOverrideLocal(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(OWNER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('base:teams-updated', { detail: null }));
  }
}

export function loadInstagramOverride(): EditableInstagramPost[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(OWNER_INSTAGRAM_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EditableInstagramPost[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveInstagramOverrideLocal(
  posts: EditableInstagramPost[]
): EditableInstagramPost[] {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(OWNER_INSTAGRAM_KEY, JSON.stringify(posts));
    window.dispatchEvent(new CustomEvent('base:instagram-updated', { detail: posts }));
  }
  return posts;
}

export function clearInstagramOverrideLocal(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(OWNER_INSTAGRAM_KEY);
    window.dispatchEvent(new CustomEvent('base:instagram-updated', { detail: null }));
  }
}

export async function persistTeamsHybrid(
  teams: EditableTeam[],
  athletes: EditableAthlete[],
  posts?: EditableInstagramPost[]
): Promise<{ savedToDisk: boolean; message: string }> {
  return persistDonoAllHybrid(teams, athletes, posts);
}

export async function persistDonoAllHybrid(
  teams: EditableTeam[],
  athletes: EditableAthlete[],
  posts?: EditableInstagramPost[]
): Promise<{ savedToDisk: boolean; message: string }> {
  const teamsPayload = saveTeamsOverrideLocal(teams, athletes);
  if (posts) {
    saveInstagramOverrideLocal(posts);
  }
  try {
    const res = await fetch('/__dono_api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teams: teamsPayload.teams,
        athletes: teamsPayload.athletes,
        posts,
      }),
    });
    if (res.ok) {
      return {
        savedToDisk: true,
        message: 'Salvo com sucesso em src/data/site.json e sincronizado!',
      };
    }
  } catch {
    // Fallback when running in static preview mode
  }
  return {
    savedToDisk: false,
    message: 'Salvo no navegador (modo estático). Exportação disponível via JSON.',
  };
}
