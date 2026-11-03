import { useState, useEffect, useRef } from 'react';
import {
  loadTeamsOverride,
  saveTeamsOverrideLocal,
  clearTeamsOverrideLocal,
  loadInstagramOverride,
  saveInstagramOverrideLocal,
  clearInstagramOverrideLocal,
  persistDonoAllHybrid,
  type EditableTeam,
  type EditableAthlete,
  type EditableInstagramPost,
} from '../domain/owner-storage';
import { POSITION_META, resolveCutoutSrc } from './TeamsShowcase';

interface OwnerDashboardProps {
  initialTeams: EditableTeam[];
  initialAthletes: EditableAthlete[];
  initialPosts?: EditableInstagramPost[];
}

const VOLLEYBALL_POSITIONS = [
  'Levantador',
  'Ponteira',
  'Ponteiro',
  'Central',
  'Oposto',
  'Líbero',
];

const INSTAGRAM_IMAGE_PRESETS = [
  { label: 'Taça Campeão', src: '/images/instagram/instagram-taca-campeao.webp' },
  { label: 'Moção de Aplausos', src: '/images/instagram/instagram-mocao-camara.webp' },
  { label: 'Treino Ginásio', src: '/images/instagram/instagram-treinos.webp' },
  { label: 'Time Feminino', src: '/images/instagram/instagram-equipe-feminina.webp' },
  { label: 'Aniversariantes', src: '/images/instagram/instagram-aniversariantes.webp' },
  { label: 'Peneira & Avisos', src: '/images/instagram/instagram-avisos.webp' },
];

function removeBackgroundClientCanvas(img: HTMLImageElement, removeBg: boolean): string {
  const maxDim = 900;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.drawImage(img, 0, 0, w, h);

  if (removeBg) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    const samples = [
      [d[0], d[1], d[2]],
      [d[(w - 1) * 4], d[(w - 1) * 4 + 1], d[(w - 1) * 4 + 2]],
      [d[Math.floor(w / 2) * 4], d[Math.floor(w / 2) * 4 + 1], d[Math.floor(w / 2) * 4 + 2]],
    ];
    const threshold = 44;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      for (const [sr, sg, sb] of samples) {
        const dist = Math.hypot(r - sr, g - sg, b - sb);
        if (dist < threshold) {
          d[i + 3] = dist < threshold * 0.65 ? 0 : Math.round(((dist - threshold * 0.65) / (threshold * 0.35)) * 255);
          break;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  return canvas.toDataURL('image/webp', 0.9);
}

export default function OwnerDashboard({
  initialTeams,
  initialAthletes,
  initialPosts = [],
}: OwnerDashboardProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'equipes' | 'instagram'>('equipes');

  // Teams & Athletes state
  const [teams, setTeams] = useState<EditableTeam[]>(initialTeams);
  const [athletes, setAthletes] = useState<EditableAthlete[]>(initialAthletes);
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>(initialAthletes[0]?.id ?? '');
  const [autoRemoveBg, setAutoRemoveBg] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Instagram posts state
  const [posts, setPosts] = useState<EditableInstagramPost[]>(initialPosts);
  const [postAccountFilter, setPostAccountFilter] = useState<string>('all');

  // Global state
  const [saving, setSaving] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<{ kind: 'success' | 'info' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load teams override
    const overrideTeams = loadTeamsOverride();
    if (overrideTeams && overrideTeams.teams.length > 0) {
      setTeams(overrideTeams.teams);
      setAthletes(overrideTeams.athletes);
      if (overrideTeams.athletes[0]) {
        setSelectedAthleteId(overrideTeams.athletes[0].id);
      }
    }

    // Load instagram override
    const overridePosts = loadInstagramOverride();
    if (overridePosts && Array.isArray(overridePosts) && overridePosts.length > 0) {
      setPosts(overridePosts);
    }

    if (overrideTeams || overridePosts) {
      setStatusBanner({
        kind: 'info',
        text: 'Edições salvas carregadas do navegador com sucesso.',
      });
    }
  }, []);

  const selectedAthlete =
    athletes.find((a) => a.id === selectedAthleteId) ?? athletes[0] ?? null;

  // Auto-sync to localStorage
  const commitTeamsLocal = (nextTeams: EditableTeam[], nextAthletes: EditableAthlete[]) => {
    setTeams(nextTeams);
    setAthletes(nextAthletes);
    saveTeamsOverrideLocal(nextTeams, nextAthletes);
  };

  const commitPostsLocal = (nextPosts: EditableInstagramPost[]) => {
    setPosts(nextPosts);
    saveInstagramOverrideLocal(nextPosts);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const result = await persistDonoAllHybrid(teams, athletes, posts);
      setStatusBanner({
        kind: 'success',
        text: result.message,
      });
    } catch (err) {
      setStatusBanner({
        kind: 'error',
        text: `Erro ao salvar: ${String(err)}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    clearTeamsOverrideLocal();
    clearInstagramOverrideLocal();
    setTeams(initialTeams);
    setAthletes(initialAthletes);
    setPosts(initialPosts);
    setSelectedAthleteId(initialAthletes[0]?.id ?? '');
    setStatusBanner({
      kind: 'info',
      text: 'Restaurado para os dados originais de site.json.',
    });
  };

  const handleExportJson = () => {
    const data = JSON.stringify({ teams, athletes, posts }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados-base-olimpia.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Team operations
  const updateTeam = (teamId: string, patch: Partial<EditableTeam>) => {
    const next = teams.map((t) => (t.id === teamId ? { ...t, ...patch } : t));
    commitTeamsLocal(next, athletes);
  };

  const addTeam = () => {
    const newId = `equipe-${Date.now().toString(36)}`;
    const nextTeams: EditableTeam[] = [
      ...teams,
      {
        id: newId,
        name: `Nova Equipe ${teams.length + 1}`,
        category: 'Sub-15 · demonstrativa',
        status: 'illustrative',
      },
    ];
    commitTeamsLocal(nextTeams, athletes);
  };

  const removeTeam = (teamId: string) => {
    if (teams.length <= 1) return;
    const remainingTeams = teams.filter((t) => t.id !== teamId);
    const fallbackTeamId = remainingTeams[0].id;
    const updatedAthletes = athletes.map((a) =>
      a.teamId === teamId ? { ...a, teamId: fallbackTeamId } : a
    );
    commitTeamsLocal(remainingTeams, updatedAthletes);
    if (selectedTeamFilter === teamId) setSelectedTeamFilter('all');
  };

  // Athlete operations
  const updateAthlete = (athleteId: string, patch: Partial<EditableAthlete>) => {
    const next = athletes.map((a) => (a.id === athleteId ? { ...a, ...patch } : a));
    commitTeamsLocal(teams, next);
  };

  const addAthlete = () => {
    const targetTeamId =
      selectedTeamFilter !== 'all' ? selectedTeamFilter : teams[0]?.id ?? 'equipe-exemplo';
    const newId = `atleta-${Date.now().toString(36)}`;
    const newAthlete: EditableAthlete = {
      id: newId,
      teamId: targetTeamId,
      name: 'Novo Atleta',
      position: 'Ponteiro',
      photoSrc: '/images/athletes/atleta-alex-silva.webp',
      cutoutSrc: '/images/athletes/atleta-alex-silva-cutout.webp',
      photoScale: 1,
      photoOffsetX: 0,
      photoOffsetY: 0,
      status: 'illustrative',
    };
    const next = [...athletes, newAthlete];
    commitTeamsLocal(teams, next);
    setSelectedAthleteId(newId);
    setStatusBanner({ kind: 'info', text: 'Novo card de atleta adicionado. Personalize os dados ao lado.' });
  };

  const removeAthlete = (athleteId: string) => {
    if (athletes.length <= 1) return;
    const next = athletes.filter((a) => a.id !== athleteId);
    commitTeamsLocal(teams, next);
    if (selectedAthleteId === athleteId) {
      setSelectedAthleteId(next[0]?.id ?? '');
    }
  };

  const moveAthlete = (athleteId: string, direction: -1 | 1) => {
    const index = athletes.findIndex((a) => a.id === athleteId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= athletes.length) return;
    const next = [...athletes];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitTeamsLocal(teams, next);
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedAthlete) return;
    setUploading(true);
    setStatusBanner({
      kind: 'info',
      text: autoRemoveBg
        ? 'Processando foto e recortando o fundo para o efeito Pop-Out...'
        : 'Processando foto do atleta...',
    });

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      try {
        const res = await fetch('/__dono_api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: selectedAthlete.name || selectedAthlete.id,
            dataUrl,
            removeBg: autoRemoveBg,
          }),
        });
        if (res.ok) {
          const json = (await res.json()) as { ok: boolean; photoSrc: string; cutoutSrc: string };
          if (json.ok) {
            updateAthlete(selectedAthlete.id, {
              photoSrc: json.photoSrc,
              cutoutSrc: json.cutoutSrc,
            });
            setStatusBanner({
              kind: 'success',
              text: autoRemoveBg
                ? 'Foto enviada e fundo recortado com sucesso!'
                : 'Foto enviada com sucesso!',
            });
            setUploading(false);
            return;
          }
        }
      } catch {
        // Fallback to client-side Canvas processing
      }

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = dataUrl;
      });
      const processedDataUrl = removeBackgroundClientCanvas(img, autoRemoveBg);
      updateAthlete(selectedAthlete.id, {
        photoSrc: processedDataUrl,
        cutoutSrc: processedDataUrl,
      });
      setStatusBanner({
        kind: 'success',
        text: 'Foto aplicada no navegador com sucesso!',
      });
    } catch (err) {
      setStatusBanner({
        kind: 'error',
        text: `Falha ao processar imagem: ${String(err)}`,
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Instagram operations
  const togglePostSelected = (postId: string) => {
    const next = posts.map((p) =>
      p.id === postId ? { ...p, selected: p.selected === false ? true : false } : p
    );
    commitPostsLocal(next);
  };

  const updatePost = (postId: string, patch: Partial<EditableInstagramPost>) => {
    const next = posts.map((p) => (p.id === postId ? { ...p, ...patch } : p));
    commitPostsLocal(next);
  };

  const addPost = () => {
    const newId = `post-${Date.now().toString(36)}`;
    const newPost: EditableInstagramPost = {
      id: newId,
      account: '@baseolimpiavolei',
      title: 'Nova Publicação do BASE',
      excerpt: 'Compartilhe aqui treinos, conquistas, avisos e novidades da equipe...',
      imageSrc: '/images/instagram/instagram-treinos.webp',
      permalink: 'https://www.instagram.com/baseolimpiavolei/',
      publishedAt: new Date().toISOString().slice(0, 10),
      selected: true,
      status: 'confirmed',
    };
    const next = [newPost, ...posts];
    commitPostsLocal(next);
    setStatusBanner({
      kind: 'info',
      text: 'Nova publicação adicionada! Preencha as informações do card.',
    });
  };

  const removePost = (postId: string) => {
    if (posts.length <= 1) return;
    const next = posts.filter((p) => p.id !== postId);
    commitPostsLocal(next);
  };

  const movePost = (postId: string, direction: -1 | 1) => {
    const index = posts.findIndex((p) => p.id === postId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= posts.length) return;
    const next = [...posts];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    commitPostsLocal(next);
  };

  // Filtered views
  const filteredAthletes =
    selectedTeamFilter === 'all'
      ? athletes
      : athletes.filter((a) => a.teamId === selectedTeamFilter);

  const filteredPosts =
    postAccountFilter === 'all'
      ? posts
      : postAccountFilter === 'selected'
      ? posts.filter((p) => p.selected !== false)
      : posts.filter((p) => p.account === postAccountFilter);

  const activePostsCount = posts.filter((p) => p.selected !== false).length;

  const activeTeam = selectedAthlete
    ? teams.find((t) => t.id === selectedAthlete.teamId)
    : undefined;
  const activePosMeta =
    selectedAthlete?.position ? POSITION_META[selectedAthlete.position] : undefined;
  const activeCutout = selectedAthlete ? resolveCutoutSrc(selectedAthlete) : null;
  const activeScale = selectedAthlete?.photoScale ?? 1;
  const activeOffsetX = selectedAthlete?.photoOffsetX ?? 0;
  const activeOffsetY = selectedAthlete?.photoOffsetY ?? 0;

  return (
    <div className="owner-shell">
      <header className="owner-topbar">
        <div className="container owner-topbar-inner">
          <div className="owner-brand">
            <a href="/" className="brand">
              <img src="/brand/escudo.png" width="44" height="44" alt="Escudo do Base Vôlei Club" />
              <span>
                BASE
                <small>PAINEL DO DONO · /DONO</small>
              </span>
            </a>
          </div>

          <div className="owner-top-actions">
            <a
              className="button button-secondary button-small"
              href={activeTab === 'equipes' ? '/#equipes' : '/#instagram'}
            >
              Ver na página ↗
            </a>
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={handleExportJson}
            >
              Exportar JSON
            </button>
            <button
              type="button"
              className="button button-secondary button-small"
              onClick={handleResetDefaults}
            >
              Restaurar padrão
            </button>
            <button
              type="button"
              className="button button-small"
              onClick={handleSaveAll}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </header>

      <main className="container owner-main">
        {statusBanner && (
          <div className={`owner-banner is-${statusBanner.kind}`} role="status">
            <span>{statusBanner.text}</span>
            <button
              type="button"
              className="owner-banner-close"
              onClick={() => setStatusBanner(null)}
              aria-label="Fechar aviso"
            >
              ✕
            </button>
          </div>
        )}

        {/* TOP TAB NAVIGATION */}
        <div className="owner-nav-tabs">
          <button
            type="button"
            className={`owner-tab-btn ${activeTab === 'equipes' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('equipes')}
          >
            🏐 Equipes & Atletas ({athletes.length})
          </button>
          <button
            type="button"
            className={`owner-tab-btn ${activeTab === 'instagram' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('instagram')}
          >
            📷 Publicações do Instagram ({activePostsCount} de {posts.length} ativas)
          </button>
        </div>

        {/* TAB 1: TEAMS & ATHLETES */}
        {activeTab === 'equipes' && (
          <>
            {/* SECTION 1: TEAMS MANAGEMENT */}
            <section className="owner-panel" aria-labelledby="owner-teams-heading">
              <div className="owner-panel-head">
                <div>
                  <span className="eyebrow">01 / EQUIPES DO PROJETO</span>
                  <h1 id="owner-teams-heading">Gerenciar Equipes</h1>
                </div>
                <button type="button" className="button button-small" onClick={addTeam}>
                  + Nova equipe
                </button>
              </div>

              <div className="owner-teams-grid">
                {teams.map((team) => {
                  const count = athletes.filter((a) => a.teamId === team.id).length;
                  return (
                    <div key={team.id} className="owner-team-card">
                      <div className="owner-field">
                        <label htmlFor={`team-name-${team.id}`}>Nome da equipe</label>
                        <input
                          id={`team-name-${team.id}`}
                          type="text"
                          value={team.name}
                          onChange={(e) => updateTeam(team.id, { name: e.target.value })}
                        />
                      </div>
                      <div className="owner-field">
                        <label htmlFor={`team-cat-${team.id}`}>Categoria / Subtítulo</label>
                        <input
                          id={`team-cat-${team.id}`}
                          type="text"
                          value={team.category ?? ''}
                          placeholder="Ex: Sub-17 · Masc / Fem"
                          onChange={(e) => updateTeam(team.id, { category: e.target.value })}
                        />
                      </div>
                      <div className="owner-team-footer">
                        <span className="owner-team-count">{count} atletas inscritos</span>
                        {teams.length > 1 && (
                          <button
                            type="button"
                            className="owner-btn-danger"
                            onClick={() => removeTeam(team.id)}
                            title="Remover equipe"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 2: ATHLETES MANAGEMENT */}
            <section className="owner-panel" aria-labelledby="owner-athletes-heading">
              <div className="owner-panel-head">
                <div>
                  <span className="eyebrow">02 / ATLETAS DO PROJETO</span>
                  <h2 id="owner-athletes-heading">Elenco & Posições</h2>
                </div>
                <div className="owner-panel-actions">
                  <div className="owner-filter-group">
                    <label htmlFor="owner-filter-select">Filtrar:</label>
                    <select
                      id="owner-filter-select"
                      value={selectedTeamFilter}
                      onChange={(e) => setSelectedTeamFilter(e.target.value)}
                    >
                      <option value="all">Todas as equipes ({athletes.length})</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({athletes.filter((a) => a.teamId === t.id).length})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="button" className="button button-small" onClick={addAthlete}>
                    + Novo atleta
                  </button>
                </div>
              </div>

              <div className="owner-athletes-layout">
                <div className="owner-athletes-list" role="tablist" aria-label="Lista de atletas">
                  {filteredAthletes.map((athlete) => {
                    const isSelected = athlete.id === selectedAthleteId;
                    const team = teams.find((t) => t.id === athlete.teamId);
                    const posMeta = athlete.position ? POSITION_META[athlete.position] : undefined;

                    return (
                      <div
                        key={athlete.id}
                        className={`owner-athlete-row ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setSelectedAthleteId(athlete.id)}
                        role="tab"
                        aria-selected={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedAthleteId(athlete.id);
                          }
                        }}
                      >
                        <div className="owner-row-thumb">
                          <img
                            src={athlete.photoSrc ?? '/images/athletes/atleta-alex-silva.webp'}
                            alt=""
                          />
                        </div>
                        <div className="owner-row-info">
                          <strong>{athlete.name}</strong>
                          <small>
                            {athlete.position ?? 'Posição a definir'} · {team?.name ?? 'BASE'}
                          </small>
                        </div>
                        {posMeta && (
                          <span className="owner-row-zone">
                            {posMeta.zone}
                          </span>
                        )}
                        <div
                          className="owner-row-actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="owner-btn-icon"
                            onClick={() => moveAthlete(athlete.id, -1)}
                            title="Mover para cima"
                            aria-label="Mover para cima"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="owner-btn-icon"
                            onClick={() => moveAthlete(athlete.id, 1)}
                            title="Mover para baixo"
                            aria-label="Mover para baixo"
                          >
                            ↓
                          </button>
                          {athletes.length > 1 && (
                            <button
                              type="button"
                              className="owner-btn-icon owner-btn-icon-danger"
                              onClick={() => removeAthlete(athlete.id)}
                              title="Excluir atleta"
                              aria-label="Excluir atleta"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedAthlete && (
                  <div className="owner-editor-card">
                    <div className="owner-editor-head">
                      <h3>Editar Atleta</h3>
                      <span className="owner-editor-id">ID: {selectedAthlete.id}</span>
                    </div>

                    <div className="owner-editor-fields">
                      <div className="owner-field">
                        <label htmlFor="edit-name">Nome completo</label>
                        <input
                          id="edit-name"
                          type="text"
                          value={selectedAthlete.name}
                          onChange={(e) =>
                            updateAthlete(selectedAthlete.id, { name: e.target.value })
                          }
                        />
                      </div>

                      <div className="owner-field-row">
                        <div className="owner-field">
                          <label htmlFor="edit-team">Equipe</label>
                          <select
                            id="edit-team"
                            value={selectedAthlete.teamId}
                            onChange={(e) =>
                              updateAthlete(selectedAthlete.id, { teamId: e.target.value })
                            }
                          >
                            {teams.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="owner-field">
                          <label htmlFor="edit-pos">Posição tática</label>
                          <select
                            id="edit-pos"
                            value={selectedAthlete.position ?? ''}
                            onChange={(e) =>
                              updateAthlete(selectedAthlete.id, { position: e.target.value })
                            }
                          >
                            {VOLLEYBALL_POSITIONS.map((pos) => (
                              <option key={pos} value={pos}>
                                {pos}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="owner-upload-box">
                        <div className="owner-upload-label-row">
                          <label htmlFor="file-upload-input">
                            <strong>Foto do Atleta</strong> (Pop-out recortado)
                          </label>
                          <label className="owner-checkbox-label">
                            <input
                              type="checkbox"
                              checked={autoRemoveBg}
                              onChange={(e) => setAutoRemoveBg(e.target.checked)}
                            />
                            <span>Recortar fundo automaticamente</span>
                          </label>
                        </div>

                        <div className="owner-upload-dropzone">
                          <input
                            ref={fileInputRef}
                            id="file-upload-input"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleFileUpload(f);
                            }}
                            disabled={uploading}
                          />
                          <p>
                            {uploading
                              ? 'Processando imagem...'
                              : 'Arraste uma foto ou clique para selecionar (PNG, JPG, WebP)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAthlete && (
                  <aside className="owner-preview-column" aria-label="Pré-visualização do card">
                    <span className="owner-preview-eyebrow">PRÉ-VISUALIZAÇÃO EM TEMPO REAL</span>
                    <article className="athlete-card is-active is-focus-card">
                      <div className="athlete-card-media-wrap">
                        <div className="athlete-card-bg-glow" />
                        <div className="media-frame media-portrait">
                          {selectedAthlete.photoSrc ? (
                            <img
                              src={activeCutout || selectedAthlete.photoSrc}
                              alt={selectedAthlete.name}
                              style={{
                                transform: `scale(${activeScale}) translate(${activeOffsetX}%, ${activeOffsetY}%)`,
                                transformOrigin: 'bottom center',
                              }}
                            />
                          ) : (
                            <div className="media-placeholder">
                              <span className="media-label">Sem foto</span>
                            </div>
                          )}
                        </div>
                        {activePosMeta && (
                          <span className="athlete-zone-badge" aria-hidden="true">
                            {activePosMeta.zone}
                          </span>
                        )}
                      </div>
                      <div className="athlete-info-plate">
                        <div className="athlete-plate-top">
                          <span className="athlete-team-tag">{activeTeam?.name ?? 'BASE'}</span>
                          <span className="athlete-position-pill">
                            {selectedAthlete.position ?? 'Posição a confirmar'}
                          </span>
                        </div>
                        <h3>{selectedAthlete.name}</h3>
                      </div>
                    </article>
                  </aside>
                )}
              </div>
            </section>
          </>
        )}

        {/* TAB 2: INSTAGRAM POSTS MANAGEMENT */}
        {activeTab === 'instagram' && (
          <section className="owner-panel" aria-labelledby="owner-ig-heading">
            <div className="owner-panel-head">
              <div>
                <span className="eyebrow">02 / O DIA A DIA DO BASE</span>
                <h1 id="owner-ig-heading">Publicações do Instagram</h1>
                <p className="owner-panel-desc">
                  Selecione quais postagens são exibidas na página principal, edite textos, fotos e links oficiais.
                </p>
              </div>

              <div className="owner-panel-actions">
                <div className="owner-filter-group">
                  <label htmlFor="owner-ig-filter">Filtrar:</label>
                  <select
                    id="owner-ig-filter"
                    value={postAccountFilter}
                    onChange={(e) => setPostAccountFilter(e.target.value)}
                  >
                    <option value="all">Todas as publicações ({posts.length})</option>
                    <option value="selected">Somente ativas no site ({activePostsCount})</option>
                    <option value="@baseolimpiavolei">
                      @baseolimpiavolei ({posts.filter((p) => p.account === '@baseolimpiavolei').length})
                    </option>
                    <option value="@baseolimpiavoleifeminino">
                      @baseolimpiavoleifeminino ({posts.filter((p) => p.account === '@baseolimpiavoleifeminino').length})
                    </option>
                  </select>
                </div>

                <button type="button" className="button button-small" onClick={addPost}>
                  + Nova publicação
                </button>
              </div>
            </div>

            <div className="owner-posts-grid">
              {filteredPosts.map((post, index) => {
                const isSelected = post.selected !== false;
                return (
                  <article
                    key={post.id}
                    className={`owner-post-card ${isSelected ? 'is-active-post' : 'is-hidden-post'}`}
                  >
                    <div className="owner-post-head">
                      <label className={`owner-post-toggle ${isSelected ? 'is-selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePostSelected(post.id)}
                        />
                        <span>{isSelected ? '✓ Exibindo na Página' : 'Oculto da Página'}</span>
                      </label>

                      <div className="owner-post-meta-selects">
                        <select
                          value={post.account}
                          onChange={(e) => updatePost(post.id, { account: e.target.value })}
                          className="owner-account-select"
                        >
                          <option value="@baseolimpiavolei">@baseolimpiavolei (Geral / Masc)</option>
                          <option value="@baseolimpiavoleifeminino">@baseolimpiavoleifeminino (Feminino)</option>
                        </select>
                      </div>

                      <div className="owner-post-actions">
                        <button
                          type="button"
                          className="owner-btn-icon"
                          onClick={() => movePost(post.id, -1)}
                          disabled={index === 0}
                          title="Mover para cima"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="owner-btn-icon"
                          onClick={() => movePost(post.id, 1)}
                          disabled={index === posts.length - 1}
                          title="Mover para baixo"
                        >
                          ↓
                        </button>
                        {posts.length > 1 && (
                          <button
                            type="button"
                            className="owner-btn-icon owner-btn-icon-danger"
                            onClick={() => removePost(post.id)}
                            title="Excluir post"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="owner-post-body">
                      {/* Thumbnail & Image selection */}
                      <div className="owner-post-media-col">
                        <div className="owner-post-thumb">
                          <img src={post.imageSrc} alt="" />
                        </div>
                        <span className="owner-label-tiny">Escolher foto:</span>
                        <div className="owner-preset-chips">
                          {INSTAGRAM_IMAGE_PRESETS.map((preset) => (
                            <button
                              key={preset.src}
                              type="button"
                              className={`owner-preset-chip ${post.imageSrc === preset.src ? 'is-current' : ''}`}
                              onClick={() => updatePost(post.id, { imageSrc: preset.src })}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="owner-post-fields">
                        <div className="owner-field">
                          <label>Tipo de mídia da publicação</label>
                          <div className="owner-post-media-type-toggle">
                            <button
                              type="button"
                              className={`owner-tab-mini ${post.mediaType === 'video' ? 'is-active' : ''}`}
                              onClick={() => updatePost(post.id, { mediaType: 'video' })}
                            >
                              🎥 Vídeo / Reel
                            </button>
                            <button
                              type="button"
                              className={`owner-tab-mini ${post.mediaType !== 'video' ? 'is-active' : ''}`}
                              onClick={() => updatePost(post.id, { mediaType: 'image' })}
                            >
                              📷 Foto
                            </button>
                          </div>
                        </div>

                        {post.mediaType === 'video' && (
                          <div className="owner-field">
                            <label>URL do vídeo (.mp4 ou link direto)</label>
                            <input
                              type="text"
                              value={post.videoSrc ?? ''}
                              onChange={(e) => updatePost(post.id, { videoSrc: e.target.value })}
                              placeholder="/video/... ou https://..."
                            />
                          </div>
                        )}
                        <div className="owner-field">
                          <label>Título da publicação</label>
                          <input
                            type="text"
                            value={post.title}
                            onChange={(e) => updatePost(post.id, { title: e.target.value })}
                            placeholder="Ex: Campeões da Taça Cidade de Voleibol"
                          />
                        </div>

                        <div className="owner-field">
                          <label>Legenda / Descrição</label>
                          <textarea
                            rows={3}
                            value={post.excerpt}
                            onChange={(e) => updatePost(post.id, { excerpt: e.target.value })}
                            placeholder="Texto detalhando o momento ou aviso..."
                          />
                        </div>

                        <div className="owner-field-row">
                          <div className="owner-field">
                            <label>Link oficial no Instagram</label>
                            <input
                              type="url"
                              value={post.permalink}
                              onChange={(e) => updatePost(post.id, { permalink: e.target.value })}
                              placeholder="https://www.instagram.com/p/..."
                            />
                          </div>

                          <div className="owner-field">
                            <label>Data de publicação</label>
                            <input
                              type="date"
                              value={post.publishedAt ?? ''}
                              onChange={(e) => updatePost(post.id, { publishedAt: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="owner-field">
                          <label>URL personalizada da imagem (opcional)</label>
                          <input
                            type="text"
                            value={post.imageSrc}
                            onChange={(e) => updatePost(post.id, { imageSrc: e.target.value })}
                            placeholder="/images/instagram/... ou https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
