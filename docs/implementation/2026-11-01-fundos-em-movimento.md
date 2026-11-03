# Fundos em movimento — 01/11/2026

O usuário solicitou movimento de background que funcione em mobile sem hover. Implementadas camadas decorativas de quadra e luz difusa atrás de cada seção, com deslocamento/rotação lentos (18 s) e luz em deslocamento/opacidade (14 s), sem mover conteúdo ou rolagem.

Módulo Astro processado importa `src/scripts/ambient.ts`; estilos isolados em `src/styles/ambient.css`. Não foram adicionadas dependências, imagens externas ou vídeo. Os elementos são decorativos, ocultos da árvore acessível e não interceptam eventos. Controle global com mínimo de 44 px e `aria-pressed` pausa/retoma todos os fundos; redução de movimento mantém tudo estático e oculta o controle. Footer reserva espaço para o controle fixo.

Verificado em Chrome headless com toque/mobile: transformação do fundo muda sem interação, pausa mantém transformação constante, retomada reinicia, seções fora da tela ficam pausadas e alteração de movimento reduzido remove os ciclos. O handler de Page Visibility foi verificado com evento simulado de aba oculta/visível. Sem JS: conteúdo legível, nenhuma camada criada e botão oculto. Nenhum erro JavaScript observado.

320, 360, 390, 768, 1024 e 1440 px: sem overflow horizontal, controle com altura mínima de 44 px. Capturas de abertura e Projeto em mobile revisadas. `npm run check`: sem erros/avisos; `npm run test`: 5 testes aprovados; `npm run build`: aprovado.

Evidências: `C:/Users/NIKOLAS/.codex/visualizations/2026/11/01/01a1998c-8af1-7703-a6bc-7ea6f811270c/verify_ambient.py`, `mobile-ambient-hero.png` e `mobile-ambient-project.png`. Limite: validação em Chrome com emulação mobile; consumo de bateria/GPU não foi medido em aparelho físico.
