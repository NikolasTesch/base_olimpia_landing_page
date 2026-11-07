import { describe, it, expect } from "vitest";
import {
  getRecentCompletedMatches,
  selectUpcomingEvents,
  getEventStatusLabel,
  validateContent,
  getPublicMilestones,
  getPublicStaffMembers,
  getPublicAthletes,
  getPublicPartners,
} from "./content";
import type { Match, ProjectEvent } from "../types/content";
const match: Match = {
  id: "m",
  teamId: "t",
  opponent: "Visitantes",
  competition: null,
  category: null,
  startsAt: "2026-11-01T10:00:00-03:00",
  state: "completed",
  scoreSets: "3 × 1",
  setScores: [],
  status: "confirmed",
};
const event: ProjectEvent = {
  id: "e",
  type: "tryout",
  title: "Peneira",
  startsAt: null,
  location: null,
  category: null,
  state: "planned",
  registrationState: "to-be-confirmed",
  contactUrl: null,
  status: "illustrative",
};
const input = (overrides = {}) => ({
  matches: [],
  events: [],
  teams: [{ id: "t" }],
  athletes: [],
  ...overrides,
});
describe("conteúdo público", () => {
  it("seleciona no máximo três resultados confirmados em ordem decrescente", () => {
    const matches = [1, 2, 3, 4].map((n) => ({
      ...match,
      id: String(n),
      startsAt: `2026-10-0${n}T10:00:00Z`,
    }));
    expect(
      getRecentCompletedMatches([
        ...matches,
        { ...match, status: "illustrative" },
      ]),
    ).toEqual([matches[3], matches[2], matches[1]]);
    expect(getRecentCompletedMatches([])).toEqual([]);
  });
  it("separa agenda sem data e preserva estados textuais", () => {
    const future = { ...event, startsAt: "2026-12-01T10:00:00Z" };
    const past = { ...event, startsAt: "2026-01-01T10:00:00Z" };
    expect(
      selectUpcomingEvents(
        [future, event, past],
        new Date("2026-11-01T00:00:00Z"),
      ),
    ).toEqual({ dated: [future], pendingDate: [event] });
    expect(getEventStatusLabel({ ...event, state: "cancelled" })).toBe(
      "Cancelado",
    );
    expect(getEventStatusLabel({ ...event, state: "postponed" })).toBe(
      "Adiado",
    );
  });
  it("detecta placar sem confirmação, data inválida, inscrição sem canal e equipe inexistente", () => {
    const errors = validateContent(
      input({
        matches: [{ ...match, status: "illustrative", startsAt: "inválida" }],
        events: [{ ...event, registrationState: "open" }],
        athletes: [{ id: "a", teamId: "ausente" }],
      }),
    );
    expect(errors.map((e) => e.code)).toEqual(
      expect.arrayContaining([
        "SCORE_UNCONFIRMED",
        "DATE_INVALID",
        "OPEN_TRYOUT_WITHOUT_CONTACT",
        "TEAM_NOT_FOUND",
      ]),
    );
    expect(validateContent(input())).toEqual([]);
  });
  it("rejeita data impossível e inscrição em evento cancelado", () => {
    expect(
      validateContent(
        input({
          events: [
            {
              ...event,
              status: "confirmed",
              state: "cancelled",
              registrationState: "open",
              contactUrl: "https://example.com",
              startsAt: "2026-02-30T10:00:00Z",
            },
          ],
        }),
      ).map((e) => e.code),
    ).toEqual(
      expect.arrayContaining(["DATE_INVALID", "OPEN_TRYOUT_WITHOUT_CONTACT"]),
    );
  });
  it("preserva ordem editorial, remove rascunhos e não projeta campos privados", () => {
    expect(
      getPublicMilestones([
        { id: "b", title: "B", body: "B", date: null, status: "illustrative" },
        { id: "a", title: "A", date: null, body: "A", status: "draft" },
      ]).map((x) => x.id),
    ).toEqual(["b"]);
    const profile = {
      id: "p",
      name: "Exemplo",
      role: "Treinador",
      bio: "Texto",
      photoSrc: null,
      status: "illustrative",
      phone: "privado",
    } as const;
    expect(getPublicStaffMembers([profile])[0]).not.toHaveProperty("phone");
    expect(getPublicStaffMembers([{ ...profile, status: "draft" }])).toEqual(
      [],
    );
    expect(
      getPublicAthletes([{ ...profile, teamId: "t", position: null }])[0],
    ).toEqual({
      id: "p",
      name: "Exemplo",
      teamId: "t",
      position: null,
      photoSrc: null,
    });
    const partner = {
      id: "part-1",
      name: "Parceiro A",
      category: "Patrocinador",
      logoSrc: "/images/apoiadores/logo.webp",
      url: "https://example.com",
      status: "confirmed",
      privateInternalNotes: "sigiloso",
    } as const;
    expect(getPublicPartners([partner])[0]).not.toHaveProperty(
      "privateInternalNotes",
    );
    expect(getPublicPartners([partner])[0]).toEqual({
      id: "part-1",
      name: "Parceiro A",
      category: "Patrocinador",
      logoSrc: "/images/apoiadores/logo.webp",
      url: "https://example.com",
    });
    expect(getPublicPartners([{ ...partner, status: "draft" }])).toEqual([]);
  });
});
