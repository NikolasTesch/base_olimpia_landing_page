# Apresentação de equipes e atletas: Coverflow 3D em Loop e Pop-Out — 03/11/2026

Implementada a [SPEC-008](../specs/008-apresentacao-atletas-coverflow-popout.md) conforme escolhas do usuário:

1. **Recorte transparente real das 6 fotos dos atletas (`public/images/athletes/*-cutout.webp`):**
   - Combinadas as máscaras de segmentação humana (`u2net_human_seg`) e objeto saliente (`u2net`) via `rembg` para preservar tanto a silhueta de cada atleta quanto a bola de vôlei no braço, com corte superior ajustado ao topo da cabeça para maximizar o efeito *pop-out*.
   - Arquivos gerados: `atleta-alex-silva-cutout.webp`, `atleta-beatriz-rocha-cutout.webp`, `atleta-camila-santos-cutout.webp`, `atleta-gabriel-lima-cutout.webp`, `atleta-joao-martins-cutout.webp` e `atleta-pedro-nunes-cutout.webp`.

2. **Cartões com Escudo Poligonal e Efeito Pop-Out (`src/components/TeamsShowcase.tsx` e `src/styles/global.css`):**
   - Base em escudo chanfrado (`.athlete-shield`) posicionada atrás do torso do jogador, com gradiente navy profundo, faixa diagonal vermelha (`.athlete-shield-slash`), marca d'água tipográfica da posição (`.athlete-watermark`), número de camisa/rotação (`.athlete-jersey-num`) e mini-quadra tática de 6 zonas (`MiniCourtBadge`).
   - A imagem sem fundo do atleta (`.athlete-cutout-img`) projeta a cabeça e os ombros para fora do topo do escudo e ganha elevação extra (`translateY(-8px) scale(1.055)`) quando está no centro do carrossel.

3. **Carrossel Coverflow 3D em Loop Contínuo (`CoverflowStage` em `src/components/TeamsShowcase.tsx`):**
   - Cálculo circular (`getCircularOffset`) posicionando o card central em escala `1` (`rotateY(0deg)`) e os laterais em perspectiva 3D (`rotateY(±24deg)`, `scale(0.82)`), girando em loop infinito.
   - Auto-rotação inteligente a cada `3.6s` quando visível, pausando automaticamente no hover, foco de teclado, aba oculta, botão global `Pausar fundo`, botão local `⏸ Giro` ou `prefers-reduced-motion: reduce`.
   - Suporte a swipe/drag (`drag="x"`), setas do teclado (`ArrowLeft` / `ArrowRight`) e barra seletora rápida de atletas (`.coverflow-roster-bar`).
