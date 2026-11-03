import type {
  Match,
  ProjectEvent,
  Milestone,
  StaffMember,
  Team,
  Athlete,
} from "../types/content";
const publicItem = (item: { status: string }) => item.status !== "draft";
const validDate = (value: string | null) => {
  if (!value || !Number.isFinite(Date.parse(value))) return false;
  const parts = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(value);
  if (!parts) return false;
  const [, year, month, day] = parts.map(Number);
  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= new Date(Date.UTC(year, month, 0)).getUTCDate()
  );
};
export function canRegister(event: ProjectEvent) {
  let url: URL;
  try {
    url = new URL(event.contactUrl ?? "");
  } catch {
    return false;
  }
  return (
    event.type === "tryout" &&
    event.state === "confirmed" &&
    event.status === "confirmed" &&
    event.registrationState === "open" &&
    ["https:", "http:"].includes(url.protocol)
  );
}
export function getRecentCompletedMatches(
  matches: readonly Match[],
  limit = 3,
) {
  return matches
    .filter(
      (m) =>
        m.state === "completed" &&
        m.status === "confirmed" &&
        m.scoreSets &&
        validDate(m.startsAt),
    )
    .sort((a, b) => Date.parse(b.startsAt!) - Date.parse(a.startsAt!))
    .slice(0, Math.max(0, limit));
}
export function selectUpcomingEvents(
  events: readonly ProjectEvent[],
  now: Date,
) {
  const visible = events.filter(publicItem);
  return {
    dated: visible
      .filter(
        (e) =>
          validDate(e.startsAt) && Date.parse(e.startsAt!) >= now.getTime(),
      )
      .sort((a, b) => Date.parse(a.startsAt!) - Date.parse(b.startsAt!)),
    pendingDate: visible.filter((e) => e.startsAt === null),
  };
}
export function getEventStatusLabel(event: Pick<ProjectEvent, "state">) {
  return {
    planned: "Previsto",
    confirmed: "Confirmado",
    postponed: "Adiado",
    cancelled: "Cancelado",
  }[event.state];
}
export interface ContentIssue {
  path: string;
  code:
    | "DATE_INVALID"
    | "SCORE_UNCONFIRMED"
    | "OPEN_TRYOUT_WITHOUT_CONTACT"
    | "TEAM_NOT_FOUND";
  message: string;
}
export function validateContent(input: {
  matches: readonly Match[];
  events: readonly ProjectEvent[];
  teams: readonly { id: string }[];
  athletes: readonly { id: string; teamId: string }[];
}) {
  const issues: ContentIssue[] = [];
  for (const [kind, items] of [
    ["matches", input.matches],
    ["events", input.events],
  ] as const)
    items.forEach((item, i) => {
      if (item.startsAt !== null && !validDate(item.startsAt))
        issues.push({
          path: `${kind}.${i}.startsAt`,
          code: "DATE_INVALID",
          message: "Data inválida.",
        });
    });
  input.matches.forEach((m, i) => {
    if (m.scoreSets && (m.state !== "completed" || m.status !== "confirmed"))
      issues.push({
        path: `matches.${i}.scoreSets`,
        code: "SCORE_UNCONFIRMED",
        message: "Placar exige partida concluída e resultado confirmado.",
      });
  });
  input.events.forEach((e, i) => {
    if (e.registrationState === "open" && !canRegister(e))
      issues.push({
        path: `events.${i}.contactUrl`,
        code: "OPEN_TRYOUT_WITHOUT_CONTACT",
        message: "Inscrição exige confirmação e canal oficial.",
      });
  });
  input.athletes.forEach((a, i) => {
    if (!input.teams.some((t) => t.id === a.teamId))
      issues.push({
        path: `athletes.${i}.teamId`,
        code: "TEAM_NOT_FOUND",
        message: "Equipe não encontrada.",
      });
  });
  return issues;
}
export const getPublicMilestones = (items: readonly Milestone[]) =>
  items
    .filter(publicItem)
    .map(({ id, title, date, body }) => ({ id, title, date, body }));
export const getPublicStaffMembers = (items: readonly StaffMember[]) =>
  items
    .filter(publicItem)
    .map(({ id, name, role, bio, photoSrc }) => ({
      id,
      name,
      role,
      bio,
      photoSrc,
    }));
export const getPublicTeams = (items: readonly Team[]) =>
  items
    .filter(publicItem)
    .map(({ id, name, category }) => ({ id, name, category }));
export const getPublicAthletes = (items: readonly Athlete[]) =>
  items
    .filter(publicItem)
    .map(({ id, teamId, name, position, photoSrc, cutoutSrc, photoScale, photoOffsetX, photoOffsetY }) => ({
      id,
      teamId,
      name,
      position,
      photoSrc,
      cutoutSrc,
      photoScale,
      photoOffsetX,
      photoOffsetY,
    }));
