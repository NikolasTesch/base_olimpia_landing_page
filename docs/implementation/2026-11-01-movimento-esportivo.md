# Movimento esportivo — 01/11/2026

O usuário escolheu a segunda direção após comparação animada. A SPEC-005 registra o comportamento: entrada do título em duas linhas com corte vertical, faixa diagonal, revelação lateral única de títulos/grupos e transições de interação. Conteúdo e dados editoriais mantidos.

Implementação: marcação em `HeroVideo.astro`, módulo TypeScript `src/scripts/motion.ts` importado no layout Astro e CSS global. Sem novas dependências. Animações removem seus efeitos ao terminar, preservando hover/foco. Elementos começam visíveis no HTML e só recebem animação ao iniciar a melhoria progressiva. Scroll nativo em todos os tamanhos; sem o deslocamento automático usado no comparativo.

## Verificação executada

- `npm run check`: 0 erros, avisos ou hints.
- `npm run test`: 5 testes existentes passaram.
- `npm run build`: saída estática gerada.
- Chrome headless na prévia Astro local: animação do título observada em execução e liberada ao terminar; revelação de seção ao rolar; alteração para movimento reduzido durante revelação cancelou os efeitos e preservou opacidade 1; recarga com movimento reduzido não iniciou animações.
- Teclado: foco no trilho de atletas cancelou sua revelação imediatamente; botão seguinte continuou alterando a rolagem do carrossel.
- Sem JavaScript: título, seção da comissão e aviso ilustrativo disponíveis e visíveis.
- Larguras 320, 360, 390, 768, 1024 e 1440 px: sem overflow horizontal do documento durante abertura e revelação da seção Projeto.
- Nenhum erro JavaScript observado. Capturas de hero e comissão revisadas localmente; evidências em `C:/Users/NIKOLAS/.codex/visualizations/2026/11/01/01a1998c-8af1-7703-a6bc-7ea6f811270c/` (`base-sport-hero.png`, `base-sport-staff.png`, `verify_live_motion.py`).

Limites: validação em Chrome desktop com viewports emulados; não inclui aparelhos físicos, Safari/Firefox nem métricas de desempenho de produção. Materiais oficiais e publicação continuam em etapas próprias.
