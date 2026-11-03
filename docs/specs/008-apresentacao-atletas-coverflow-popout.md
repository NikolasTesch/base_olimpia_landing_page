# SPEC-008 — Apresentação de equipes e atletas: Coverflow 3D em Loop e Pop-Out com recorte transparente

**Estado:** implementada e validada (03/11/2026). Registro em [implementação](../implementation/2026-11-03-apresentacao-atletas-coverflow-popout.md).

## Objetivo

Renovar a seção de Equipes e Atletas (`#equipes`) substituindo os cartões retangulares tradicionais por:
1. **Silhuetas recortadas (fundo transparente)** das 6 fotos demonstrativas dos atletas, criando efeito **Pop-Out** (cabeça e ombros projetados para fora de uma base em formato de escudo/polígono esportivo com tipografia da posição ao fundo).
2. **Carrossel Coverflow 3D em Loop** controlado por `motion/react`, destacando o atleta central em escala real e posicionando os demais em perspectiva 3D lateral, com rotação contínua em loop (auto-play pausável) e navegação manual completa.

## Comportamento esperado

### 1. Atletas recortados e composição Pop-Out
- As 6 imagens em `public/images/athletes/` ganham versões recortadas sem fundo (`*-cutout.webp`) mantendo transparência real (canal alfa).
- Cada cartão de atleta (`.athlete-card--popout`) é dividido em camadas:
  - **Escudo / Base Poligonal (`.athlete-shield`):** posicionada nos ~75% inferiores da altura da figura, com recorte chanfrado (`clip-path`), fundo navy escuro com brilho radial, faixa diagonal vermelha e marca d'água tipográfica da posição (`LEVANTADOR`, `PONTEIRA`, `CENTRAL`, `OPOSTO`, `LÍBERO`, `PONTEIRO`).
  - **Aura e Mini-Quadra Tática:** indica visualmente em qual das 6 zonas da quadra o atleta atua.
  - **Figura Pop-Out (`.athlete-cutout-img`):** o atleta sem fundo emerge de dentro do escudo, com cabeça e ombros ultrapassando o limite superior da moldura e sombra projetada (`drop-shadow`) realista.
  - **Placa de Identificação (`.athlete-info-plate`):** nome, função/posição e dica tática da posição.

### 2. Carrossel Coverflow 3D em Loop
- **Loop circular infinito:** ao avançar além do último atleta, retorna suavemente ao primeiro (e vice-versa ao voltar), sem fim seco.
- **Perspectiva Coverflow:**
  - Card central (`offset = 0`): escala `1`, `rotateY(0deg)`, foco total, aura vermelha/navy ativa e elevação da silhueta recortada.
  - Cards adjacentes (`offset = -1` e `+1`): deslocados à esquerda/direita com `scale(0.84)`, `rotateY(±24deg)`, menor luminosidade e clicáveis para assumir o centro imediatamente.
  - Em caso de filtro "Todas as equipes" (6 atletas), exibe também os vizinhos de segundo nível (`offset = ±2`) em profundidade menor.
- **Auto-rotação inteligente em loop:**
  - Avança automaticamente a cada `3600 ms` enquanto visível na tela.
  - Pausa automaticamente no `hover`, no foco por teclado (`focusin`), quando a aba está oculta (`document.hidden`), quando o controle global `Pausar fundo` está ativo (`html[data-ambient-paused]`), quando o usuário pausa pelo botão local do carrossel ou quando `prefers-reduced-motion: reduce` está ativo.

## Regras de domínio e acessibilidade

- Preservar integralmente os dados e regras de `src/data/site.json` (nomes e equipes demonstrativas, sem dados pessoais sensíveis de menores).
- O HTML inicial entrega o Coverflow na posição de repouso, com os cards já separados e o destaque centralizado em mobile e desktop. Os três retratos em primeiro plano começam a carregar antes da hidratação.
- Com JavaScript desativado, a faixa horizontal nativa mantém acesso a todos os atletas.
- Um fundo estático discreto e sombras sob os cards dão profundidade à seção.
- Controles acessíveis com alvo mínimo de 44×44 px (`Anterior`, `Próximo`, `Pausar/Retomar giro` e seletores diretos de atleta), além de suporte a setas do teclado (`ArrowLeft` / `ArrowRight`).
- Zero overflow horizontal da página em 320, 360, 390, 768, 1024 e 1440 px.

## Critérios de aceite

- 6 imagens recortadas com fundo transparente geradas em `public/images/athletes/*-cutout.webp` e referenciadas em `src/data/site.json` (ou resolvidas automaticamente pelo componente).
- Carrossel Coverflow 3D em loop funcionando tanto por equipe individual quanto na aba "Todas as equipes".
- `npm run check`, `npm run test` e `npm run build` aprovados sem erros.
