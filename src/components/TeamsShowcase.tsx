import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Team, Athlete } from '../types/content';
import { loadTeamsOverride, OWNER_STORAGE_KEY } from '../domain/owner-storage';

export type PublicTeam = Omit<Team, 'status'>;
export type PublicAthlete = Omit<Athlete, 'status'>;

interface TeamsShowcaseProps {
  teams: PublicTeam[];
  athletes: PublicAthlete[];
}

export interface PositionMeta {
  zone: string;
  courtSlot: number; // 1..6 volleyball rotation zone
  roleHint: string;
  shortCode: string;
}

export const POSITION_META: Record<string, PositionMeta> = {
  Levantador: { zone: 'Zona 1/2 · Armação', courtSlot: 1, roleHint: 'Distribuição tática e ritmo de jogo', shortCode: 'LEV' },
  Levantadora: { zone: 'Zona 1/2 · Armação', courtSlot: 1, roleHint: 'Distribuição tática e ritmo de jogo', shortCode: 'LEV' },
  Ponteira: { zone: 'Zona 4 · Entrada', courtSlot: 4, roleHint: 'Ataque de ponta e recepção', shortCode: 'PNT' },
  Ponteiro: { zone: 'Zona 4 · Entrada', courtSlot: 4, roleHint: 'Ataque de ponta e recepção', shortCode: 'PNT' },
  Central: { zone: 'Zona 3 · Meio de rede', courtSlot: 3, roleHint: 'Bloqueio central e ataque rápido', shortCode: 'CEN' },
  Oposto: { zone: 'Zona 2 · Saída de rede', courtSlot: 2, roleHint: 'Definidor de bolas altas', shortCode: 'OPO' },
  Oposta: { zone: 'Zona 2 · Saída de rede', courtSlot: 2, roleHint: 'Definidora de bolas altas', shortCode: 'OPO' },
  Líbero: { zone: 'Zona 6 · Defesa', courtSlot: 6, roleHint: 'Especialista em passe e cobertura', shortCode: 'LIB' },
};

export function resolveCutoutSrc(athlete: Pick<PublicAthlete, 'photoSrc' | 'cutoutSrc'>): string | null {
  if (athlete.cutoutSrc) return athlete.cutoutSrc;
  if (!athlete.photoSrc) return null;
  if (athlete.photoSrc.startsWith('data:')) return athlete.photoSrc;
  if (athlete.photoSrc.endsWith('-cutout.webp')) return athlete.photoSrc;
  return athlete.photoSrc.replace(/\.webp$/i, '-cutout.webp');
}

function getCircularOffset(index: number, activeIndex: number, length: number): number {
  if (length <= 1) return 0;
  let diff = (index - activeIndex) % length;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  if (length % 2 === 0 && diff === -length / 2) diff = length / 2;
  return diff;
}

export function MiniCourtBadge({ activeSlot, code }: { activeSlot: number; code: string }) {
  const zones = [4, 3, 2, 5, 6, 1];
  return (
    <div className="athlete-mini-court" aria-hidden="true" title={`Posição tática: Zona ${activeSlot}`}>
      <span className="athlete-mini-code">{code}</span>
      <div className="athlete-mini-grid">
        {zones.map((z) => (
          <span
            key={z}
            className={`athlete-mini-cell${z === activeSlot ? ' is-zone-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

function CoverflowStage({
  title,
  subtitle,
  items,
  teamMap,
  reducedMotion,
  hydrated,
}: {
  title: string;
  subtitle: string;
  items: PublicAthlete[];
  teamMap: Map<string, PublicTeam>;
  reducedMotion: boolean;
  hydrated: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  const count = items.length;
  const safeActive = count > 0 ? ((activeIndex % count) + count) % count : 0;

  const step = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setActiveIndex((prev) => (((prev + delta) % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting));
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoLoopRunning =
    hydrated && !reducedMotion && !interacting && isVisible && count > 1;

  // Automatic 3.3s (3300ms) rotation loop without manual toggle button
  useEffect(() => {
    if (!autoLoopRunning) return;
    const timer = window.setInterval(() => {
      step(1);
    }, 3300);
    return () => window.clearInterval(timer);
  }, [autoLoopRunning, step]);

  const activeAthlete = items[safeActive];

  return (
    <div
      ref={stageRef}
      className="team coverflow-team"
      data-team-carousel
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setInteracting(false);
        }
      }}
    >
      <div className="team-heading">
        <div>
          <h3>
            {title}
            <small>{subtitle}</small>
          </h3>
        </div>

        <div className="carousel-controls" inert={!hydrated}>
          <button
            type="button"
            data-carousel-step="-1"
            aria-label={`Atleta anterior: ${title}`}
            onClick={() => step(-1)}
          >
            ←
          </button>
          <button
            type="button"
            data-carousel-step="1"
            aria-label={`Próximo atleta: ${title}`}
            onClick={() => step(1)}
          >
            →
          </button>
        </div>
      </div>

      <div
        className="athlete-track is-coverflow-track"
        tabIndex={0}
        role="list"
        aria-label={`Atletas de ${title}`}
        data-lenis-prevent-horizontal
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            step(-1);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            step(1);
          }
        }}
      >
        {items.map((athlete, idx) => {
          const offset = getCircularOffset(idx, safeActive, count);
          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);
          const posMeta = athlete.position ? POSITION_META[athlete.position] : undefined;
          const team = teamMap.get(athlete.teamId);
          const cutoutSrc = resolveCutoutSrc(athlete);
          const watermarkLabel = (athlete.position ?? 'ATLETA').toUpperCase();

          const xPercent =
            offset === 0
              ? 0
              : offset === -1
                ? -66
                : offset === 1
                  ? 66
                  : offset < 0
                    ? -112
                    : 112;
          const scale = isCenter ? 1 : absOffset === 1 ? 0.82 : 0.66;
          const rotateY = isCenter ? 0 : offset < 0 ? 24 : -24;
          const zIndex = 10 - absOffset * 3;
          const opacity = isCenter ? 1 : absOffset === 1 ? 0.82 : absOffset === 2 ? 0.42 : 0;

          const customScale = athlete.photoScale ?? 1;
          const customOffsetX = athlete.photoOffsetX ?? 0;
          const customOffsetY = athlete.photoOffsetY ?? 0;

          return (
            <motion.article
              key={athlete.id}
              id={`atleta-${athlete.id}`}
              className={`athlete-card athlete-card--popout${isCenter ? ' is-active-center' : ''}`}
              role="listitem"
              aria-current={hydrated && isCenter ? 'true' : undefined}
              style={{ zIndex, pointerEvents: absOffset > 2 ? 'none' : 'auto' }}
              initial={false}
              animate={{ x: `${xPercent}%`, scale, rotateY, opacity }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 250, damping: 28, mass: 0.9 }
              }
              drag={hydrated && !reducedMotion ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -45) step(1);
                else if (info.offset.x > 45) step(-1);
              }}
              onClick={() => {
                if (!isCenter) setActiveIndex(idx);
              }}
            >
              <div className="athlete-popout-stage">
                <div className="athlete-shield" aria-hidden="true">
                  <span className="athlete-shield-glow" />
                  <span className="athlete-shield-slash" />
                  <span className="athlete-shield-grid" />
                  <span className="athlete-watermark">{watermarkLabel}</span>
                  <span className="athlete-jersey-num">0{idx + 1}</span>
                </div>

                {posMeta && (
                  <MiniCourtBadge activeSlot={posMeta.courtSlot} code={posMeta.shortCode} />
                )}

                <div
                  className="athlete-cutout-wrap"
                  style={
                    customScale !== 1 || customOffsetX !== 0 || customOffsetY !== 0
                      ? {
                          transform: `translate(${customOffsetX}px, ${customOffsetY}px) scale(${customScale})`,
                          transformOrigin: 'bottom center',
                        }
                      : undefined
                  }
                >
                  {cutoutSrc ? (
                    <img
                      className="athlete-cutout-img"
                      src={cutoutSrc}
                      alt={athlete.name}
                      loading={absOffset <= 1 ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                      onError={(e) => {
                        if (athlete.photoSrc && e.currentTarget.getAttribute('src') !== athlete.photoSrc) {
                          e.currentTarget.src = athlete.photoSrc;
                        }
                      }}
                    />
                  ) : (
                    <div className="media-placeholder">
                      <span className="media-orbit" />
                      <span className="media-label">
                        <small>ESPAÇO PARA IMAGEM</small>
                        Retrato do atleta
                      </span>
                    </div>
                  )}
                </div>

                {posMeta && (
                  <span className="athlete-zone-badge" aria-hidden="true">
                    {posMeta.zone}
                  </span>
                )}
              </div>

              <div className="athlete-info-plate">
                <div className="athlete-plate-top">
                  <span className="athlete-team-tag">{team?.name ?? 'BASE'}</span>
                  <span className="athlete-position-pill">{athlete.position ?? 'Posição a confirmar'}</span>
                </div>
                <h3>{athlete.name}</h3>
                {posMeta && <span className="athlete-role-hint">{posMeta.roleHint}</span>}
              </div>
            </motion.article>
          );
        })}
      </div>

      {count > 1 && (
        <div className="coverflow-roster-bar" inert={!hydrated} role="tablist" aria-label={`Selecionar atleta em destaque de ${title}`}>
          {items.map((athlete, idx) => {
            const isSelected = idx === safeActive;
            return (
              <button
                key={athlete.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`coverflow-roster-chip${isSelected ? ' is-selected' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                <span className="coverflow-chip-num">0{idx + 1}</span>
                <span className="coverflow-chip-name">{athlete.name.split(' ')[0]}</span>
                <small className="coverflow-chip-pos">{athlete.position}</small>
              </button>
            );
          })}
        </div>
      )}

      {hydrated && activeAthlete && (
        <p className="sr-only" aria-live="polite">
          Atleta em destaque: {activeAthlete.name}, {activeAthlete.position ?? 'posição a confirmar'}
        </p>
      )}
    </div>
  );
}

export default function TeamsShowcase({ teams: initialTeams, athletes: initialAthletes }: TeamsShowcaseProps) {
  const [teams, setTeams] = useState<PublicTeam[]>(initialTeams);
  const [athletes, setAthletes] = useState<PublicAthlete[]>(initialAthletes);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [hydrated, setHydrated] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    setHydrated(true);

    const applyOverride = () => {
      const override = loadTeamsOverride();
      if (override) {
        setTeams(override.teams);
        setAthletes(override.athletes);
      } else {
        setTeams(initialTeams);
        setAthletes(initialAthletes);
      }
    };

    applyOverride();

    const onTeamsUpdated = () => applyOverride();
    const onStorage = (event: StorageEvent) => {
      if (event.key === OWNER_STORAGE_KEY || event.key === null) {
        applyOverride();
      }
    };

    window.addEventListener('base:teams-updated', onTeamsUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('base:teams-updated', onTeamsUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, [initialTeams, initialAthletes]);

  const teamMap = new Map(teams.map((t) => [t.id, t]));

  const visibleTeams =
    selectedTeamId === 'all' ? teams : teams.filter((team) => team.id === selectedTeamId);

  return (
    <div className="teams-showcase" data-motion-island>
      {teams.length > 1 && (
        <div className="teams-filter" role="toolbar" aria-label="Filtrar visualização por equipe" inert={!hydrated}>
          <button
            type="button"
            className={`teams-filter-btn${selectedTeamId === 'all' ? ' is-active' : ''}`}
            aria-pressed={selectedTeamId === 'all'}
            onClick={() => setSelectedTeamId('all')}
          >
            {selectedTeamId === 'all' && !reducedMotion && (
              <motion.span
                layoutId="team-filter-pill"
                className="teams-filter-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="teams-filter-label">Todas as equipes ({teams.length})</span>
          </button>

          {teams.map((team) => {
            const active = selectedTeamId === team.id;
            return (
              <button
                key={team.id}
                type="button"
                className={`teams-filter-btn${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => setSelectedTeamId(team.id)}
              >
                {active && !reducedMotion && (
                  <motion.span
                    layoutId="team-filter-pill"
                    className="teams-filter-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="teams-filter-label">{team.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {visibleTeams.map((team) => (
        <CoverflowStage
          key={team.id}
          title={team.name}
          subtitle={team.category ?? 'Categoria a confirmar'}
          items={athletes.filter((athlete) => athlete.teamId === team.id)}
          teamMap={teamMap}
          reducedMotion={reducedMotion}
          hydrated={hydrated}
        />
      ))}
    </div>
  );
}
