# SPEC-007 — Background tático e stack completa de animação

**Estado:** implementada e validada via `check`, `test` e `build` (03/11/2026). Registro em [implementação](../implementation/2026-11-03-background-tatico-e-stack-animacao.md).

## Objetivo

Evoluir o background ambiente e o sistema de animações da landing page utilizando a stack completa prevista em `ARCHITECTURE.md` (**GSAP + ScrollTrigger**, **Lenis** e **React + Motion**), adotando a direção visual **Quadra tática + energia esportiva em camadas** e uma coreografia de entrada mais rica ao longo das seções.

## Escopo e ferramentas

1. **GSAP + ScrollTrigger (`gsap`):**
   - Coordena a timeline de abertura da Hero, revelações escalonadas (`stagger`) por seção, parallax com `scrub` nas camadas de fundo tático e o desenho progressivo da linha do tempo na seção História.
   - Gerencia os loops contínuos das trajetórias táticas em SVG e luzes difusas das seções visíveis.
2. **Lenis (`lenis`):**
   - Suaviza a rolagem nativa no desktop/mobile quando `prefers-reduced-motion: no-preference`.
   - Alimentado **exclusivamente** pelo `gsap.ticker` (`lenis.raf(time * 1000)`), conforme regra arquitetural de único RAF.
   - Sincronizado com `ScrollTrigger.update` e configurado para preservar links de âncora e rolagem horizontal nativa nas faixas de atletas.
3. **React + Motion (`@astrojs/react`, `react`, `react-dom`, `motion`):**
   - Ilha interativa `TeamsShowcase` na seção Equipes (`client:visible`), permitindo alternar entre todas as equipes ou filtrar por equipe específica (`Equipe Horizonte`, `Equipe Maré`) e inspecionar posição em quadra com transições declarativas de layout e entrada/saída (`AnimatePresence` e `motion.article`).
   - Preserva renderização inicial no HTML estático (SSR) para leitura sem JavaScript.
   - Respeita `propertyOwnershipRule`: GSAP anima apenas o cabeçalho da seção; `motion/react` controla exclusivamente os elementos internos da ilha.

## Novo background: Quadra tática + energia esportiva em camadas

- Camada decorativa injetada e controlada em cada seção (`ambient-field`), composta por:
  - **SVG tático de quadra de vôlei (`ambient-tactical-svg`):** linhas de quadra em perspectiva angulada, linha central e linhas de ataque (3 metros), zonas táticas, arcos de trajetória de bola (`stroke-dashoffset` animado) e pontos de posicionamento.
  - **Faixas diagonais esportivas (`ambient-beam`):** recortes diagonais em navy/vermelho com deslocamento vinculado ao scroll (`ScrollTrigger` `scrub`).
  - **Luzes difusas (`ambient-light`):** brilho radial suave em ciclo contínuo e parallax leve.
- Na Hero, composição tática dedicada integrada à faixa diagonal e ao poster.
- Controle global `Pausar fundo` / `Retomar fundo` (`[data-ambient-toggle]`) pausa/retoma todas as animações contínuas de fundo e atualiza `aria-pressed`.

## Coreografia de animações

- **Hero (`#inicio`):** timeline GSAP com eyebrow, corte vertical nas duas linhas do `H1`, entrada da faixa diagonal, desenho das linhas táticas em SVG, descrição, botões e nota de rodapé.
- **O Projeto (`#projeto`):** revelação do cabeçalho, expansão das linhas divisórias superiores dos 3 princípios (`01`, `02`, `03`) e entrada escalonada dos cartões.
- **Nossa História (`#historia`):** linha vertical da timeline preenchida progressivamente conforme o scroll (`scrub`), acendimento sequencial dos marcadores (`timeline-dot`), entrada dos marcos históricos, moldura de memória com parallax sutil e bloco de impacto.
- **Comissão Técnica (`#comissao`):** destaque na barra lateral vermelha do título e entrada escalonada dos cartões da comissão com revelação suave dos retratos.
- **Competições, Resultados, Agenda, Instagram e Apoiadores:** entradas escalonadas coordenadas por `ScrollTrigger`, com limpeza de propriedades (`clearProps`) ao término para preservar `:hover` e `:focus-visible`.

## Regras de domínio e acessibilidade

- Manter conteúdo editorial ilustrativo (`src/data/site.json`), aviso visível e contratos de domínio intactos.
- HTML permanece 100% visível por padrão sem JavaScript.
- Com `prefers-reduced-motion: reduce`, desativar Lenis, cancelar animações GSAP/Motion, ocultar o botão de pausa de fundo e manter toda a página estática e legível.
- Qualquer elemento focado via teclado (`focusin`) durante uma revelação deve concluir imediatamente sua animação para não atrasar o foco.
- Zero overflow horizontal em 320, 360, 390, 768, 1024 e 1440 px.

## Critérios de aceite

- `npm run check`, `npm run test` e `npm run build` executados e aprovados.
- Verificação em navegador das animações GSAP/ScrollTrigger, rolagem com Lenis, ilha React + Motion nas equipes, botão de pausa do fundo, `prefers-reduced-motion`, navegação por teclado e ausência de overflow nos 6 viewports.
