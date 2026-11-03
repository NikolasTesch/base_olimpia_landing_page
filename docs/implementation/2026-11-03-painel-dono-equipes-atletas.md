# Giro automático de 3.3s e Painel do Dono (`/dono`) — 03/11/2026

Implementada a [SPEC-009](../specs/009-painel-dono-equipes-atletas.md):

1. **Remoção do botão de pausar/ativar giro e rotação automática fixa em 3,3s (`src/components/TeamsShowcase.tsx`):**
   - Removido o botão `.carousel-pause-btn` (`⏸ Giro` / `▶ Giro`) dos controles do carrossel.
   - O loop automático avança exatamente a cada **3300 ms (3,3 segundos)** enquanto a seção estiver visível (respeitando `prefers-reduced-motion: reduce`, aba oculta e interação direta do usuário com o card).

2. **Rota `/dono` e Painel de Gestão (`src/pages/dono.astro` e `src/components/OwnerDashboard.tsx`):**
   - **Equipes:** Edição de nome e categoria (`Equipe Horizonte`, `Equipe Maré`), criação de novas equipes e exclusão segura (reatribuindo atletas para evitar órfãos).
   - **Cards de Atletas:** Edição de nome, equipe, posição em quadra (com atalhos para `Levantador`, `Ponteira`, `Ponteiro`, `Central`, `Oposto`, `Líbero`), reordenação (`↑`/`↓`), criação e exclusão de atletas.
   - **Upload de Foto, Recorte Automático e Ajuste Fino Pop-Out:**
     - Upload de imagem do computador ou caminho/URL, com opção de recorte automático de fundo (via `rembg` no servidor Vite ou fallback em Canvas no cliente).
     - Controles deslizantes de **Zoom (`photoScale`)**, **Ajuste Horizontal (`photoOffsetX`)** e **Ajuste Vertical (`photoOffsetY`)** com **Prévia ao vivo do Card Pop-Out** ao lado do formulário.
   - **Persistência Híbrida (`src/domain/owner-storage.ts` e `astro.config.mjs`):**
     - Sincronização instantânea via `localStorage` (`base:equipes-override:v1`) e eventos `storage` / `base:teams-updated` para refletir em tempo real na home `/`.
     - No servidor de desenvolvimento (`npm run dev`), grava diretamente em `src/data/site.json` e salva imagens/recortes em `public/images/athletes/` via endpoints `/__dono_api/save` e `/__dono_api/upload`.
