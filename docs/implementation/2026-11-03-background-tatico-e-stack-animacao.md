# Background tático e stack completa de animação — 03/11/2026

Implementada a [SPEC-007](../specs/007-background-tatico-e-stack-animacao.md) conforme escolhas do usuário:

1. **Stack completa integrada (`package.json` e `astro.config.mjs`):**
   - `gsap` + `ScrollTrigger` para timelines de abertura, revelações escalonadas (`stagger`), parallax em camadas de fundo e linha do tempo desenhada conforme o scroll.
   - `lenis` sincronizado exclusivamente pelo `gsap.ticker` (`autoRaf: false`), com suporte a âncoras, prevenção em faixas horizontais (`data-lenis-prevent-horizontal`) e desligamento automático em `prefers-reduced-motion: reduce`.
   - `@astrojs/react` + `react` + `motion` (`motion/react`) na ilha `src/components/TeamsShowcase.tsx` (`client:visible`), com filtro animado por equipe (`layoutId="team-filter-pill"`), transições `AnimatePresence` e badges táticos de zona/posição em quadra.

2. **Novo background tático em camadas (`src/scripts/ambient.ts`, `src/styles/ambient.css`, `src/components/HeroVideo.astro`):**
   - SVG tático na Hero (`.hero-tactical-svg`) com quadra em perspectiva isométrica, linha central, linhas dos 3 metros, arcos de trajetória de bola e nós de posicionamento.
   - Camadas `.ambient-tactical-svg` e `.ambient-beam` em cada seção, combinando ciclos contínuos controlados pelo botão global `Pausar fundo` / `Retomar fundo` e parallax via `ScrollTrigger` `scrub`.

3. **Coreografia de entrada e interações (`src/scripts/motion.ts`, `src/components/HistoryTimeline.astro`):**
   - Progresso vertical da linha do tempo (`[data-timeline-progress]`) desenhado conforme o scroll e pulso nos marcadores `.timeline-dot`.
   - Revelações escalonadas com limpeza de propriedades inline (`clearProps`) ao término e liberação imediata no foco por teclado (`focusin`).

## Verificações executadas

- `npm run check`: 0 erros, 0 avisos, 0 hints (25 arquivos verificados).
- `npm run test`: 5 testes de domínio aprovados (`src/domain/content.test.ts`).
- `npm run build`: saída estática e ilha hidratável geradas com sucesso em `dist/`.
