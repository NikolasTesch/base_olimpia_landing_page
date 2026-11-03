# Continuidade no futuro repositório

## Estado entregue

Briefing, direção visual e scaffold Astro inicial definidos. A página já renderiza as seções com conteúdo local ilustrativo, aviso visível, navegação e estilos mobile-first. `npm run check` e `npm run build` passaram; revisão visual em navegador e nos viewports definidos ainda está pendente. Antes de novas fatias, ler README, DESIGN, ARCHITECTURE, CONTENT e os JSONs.

## Fatias pequenas de trabalho

1. **Base editorial — scaffold criado:** Astro com TypeScript e CSS; layout, navegação e conteúdo local renderizam as seções. Próximo: validar visualmente em 390 px e 320 px e ajustar overflow/foco conforme necessário; não há animações nesta etapa.
2. **Hero:** poster responsivo, texto e acesso à história. Adicionar player completo somente quando existir mídia. Depois, loop decorativo com pausa, redução de movimento e fallback.
3. **História e pessoas:** timeline, impacto, staff, equipes e atletas. Preservar todos os nomes como placeholders até confirmação.
4. **Vida esportiva:** competições, conquistas, resultados e agenda. Definir validações e estados vazios antes de inserir eventos reais.
5. **Informativos e apoio:** prévias manuais de Instagram, parceiros e contatos. Nenhum link inventado.
6. **Movimento e acabamento:** GSAP pontual, revisão de tipografia, foco, responsividade e desempenho. Lenis/Motion somente se existir necessidade demonstrada.

Cada fatia deve definir objetivo, comportamento, critérios de aceitação e erros na spec antes de implementação relevante. Executar DISCOVER → PLAN → BUILD → TEST → REVIEW → DOCUMENT. Não fazer commit, publicar, criar serviços ou integrar dados reais automaticamente.

## Critérios de aceitação do protótipo

- Propósito social fica claro na abertura e introdução; o texto explica a proposta de contraturno escolar.
- História, funcionamento, impacto, staff, competição, resultados, equipes, atletas, participação, agenda, Instagram e apoiadores têm lugar definido.
- Em mobile os textos não aparecem comprimidos em duas colunas e não há overflow horizontal da página; faixas de retratos têm navegação intencional.
- Títulos respeitam a escala reduzida; corpo permanece legível e as seções têm respiro.
- O modo ilustrativo é visível e nenhum fato inventado aparece como confirmação institucional.
- Sem vídeo, a hero funciona com poster e link à história. Sem JS, o conteúdo continua disponível.
- Teclado e foco funcionam no menu, controles e eventual diálogo de vídeo. Redução de movimento mantém leitura completa.
- Agenda sem dados e Instagram sem URL exibem mensagem apropriada. Não há botões falsos, placares, números de impacto ou contatos inventados.
- O build e as validações configuradas passam; nenhum resultado de teste é inferido a partir do mockup.

## Antes da publicação oficial

Trocar placeholders, confirmar história e funcionamento, definir contato e Instagram, obter materiais visuais apropriados, validar nomes/funções e revisar a apresentação pública de menores. Definir domínio, hospedagem e responsável pelas atualizações em tarefa própria. Este pacote não equivale a autorização de deploy.



## Implementação da estrutura em 01/11/2026

As quatro primeiras specs tiveram sua estrutura implementada com componentes e mídia temporária. Conteúdo fictício foi autorizado pelo usuário e permanece identificado como demonstração. Ver `docs/implementation/2026-11-01-landing-page.md` para verificações e limites.
