# Execução das quatro specs — estrutura inicial

Plano: docs/superpowers/plans/2026-11-01-primeiras-quatro-specs.md

Ruling: trabalho no diretório existente, pois ainda não há repositório Git. Nenhum commit automático.
Ruling: usuário autorizou dados fictícios em 01/11/2026; todos seguem identificados como ilustrativos.
Ruling: loop decorativo fica pendente de mídia; a hero inicial usa moldura e player nativo somente quando houver arquivo.

Implementado: componentes editoriais, navegação, hero, molduras de mídia, história, comissão, equipes, agenda, resultados, informativos e apoio.
Regras: projeção pública sem campos extras, exclusão de rascunhos, validação de relações por ID, datas e inscrições, ordenação e limite de resultados.
Verificação: cinco testes de domínio passaram; Astro check sem erros/avisos; build estático concluído.
Browser: um H1 e zero âncoras quebradas. Sem overflow observado em larguras reais 394, 742, 997 e 1414 px; override de viewport do navegador não permitiu medir exatamente 320/360 px. Homologação exata desses tamanhos e mídia real permanecem pendentes.

Revisão independente: corrigidos CTA de inscrição para evento cancelado/adiado e aceitação de data impossível. Teste de regressão falhou antes da correção e passou depois.

## Atualização visual — hero, pessoas, equipes e contato

Implementado o design aprovado em `docs/superpowers/specs/2026-11-01-landing-page-destaques-design.md`, seguindo `docs/superpowers/plans/2026-11-01-landing-page-destaques.md`:

- Hero full-bleed com overlay de contraste, poster opcional e vídeo institucional sob ação explícita. Como a mídia oficial ainda não existe, a prévia usa a moldura gráfica demonstrativa.
- História mantém sua linha do tempo sem repetição de perfis; a seção “Quem faz acontecer” tem destaque visual próprio nos cartões da comissão.
- Equipes demonstrativas separadas em trilhos nativos com scroll-snap, controles acessíveis quando JavaScript roda e conteúdo integral no HTML.
- Dia a dia organizado como cartões quadrados para futuras publicações, sem embeds ou URLs inventados.
- Rodapé com telefone, localização, Instagram, e-mail e WhatsApp configuráveis; campos vazios não geram links e indicam “A informar”.

Verificação executada: `npm run test` (5 testes aprovados), `npm run check` (0 erros/avisos) e `npm run build` (página estática gerada). No preview desktop, há um H1, nenhuma âncora interna quebrada, nenhuma largura de documento excedendo a viewport, dois carrosséis com três atletas cada e nenhum link de contato quando os dados são nulos.

Revisão independente encontrou e corrigiu dois estados do carrossel: controles não devem aparecer sem JavaScript e seus estados precisam se atualizar após redimensionamento. O título da hero foi mantido na escala tipográfica já definida em `DESIGN.md`.

Correção de direção solicitada pelo usuário: o destaque de pessoas foi removido da seção História (que repetia o treinador) e aplicado à seção “Quem faz acontecer”, com fundo suave, acento no título e cartões elevados no hover; o movimento é removido quando `prefers-reduced-motion` está ativo.

No navegador desktop, a largura do documento coincide com a viewport de 2218 px. Uma tentativa de captura estreita teve viewport CSS mínimo de 500 px imposto pelo Chrome (apesar da largura do arquivo de captura); nessa viewport, `scrollWidth` e `clientWidth` coincidiram em 500 px. As larguras exatas 320, 360 e 390 px seguem pendentes e a captura estreita cortada foi descartada. A mídia oficial, dados de contato e revisão editorial continuam pendentes. O diretório permanece sem repositório Git, portanto não há diff/status Git para registro.

## Homologação responsiva e acessibilidade — 01/11/2026

- Corrigida navegação mobile: links quebram em linhas, com alvos de toque preservados, em vez de exigir rolagem horizontal no menu.
- Viewports CSS conferidas em Chrome isolado: 320, 360, 390, 768, 1024 e 1440 px; sem overflow horizontal no documento, sem âncoras internas quebradas e com um H1. A rolagem horizontal restante está contida nos carrosséis de atletas.
- O primeiro Tab alcança o link de salto ao conteúdo com outline visível de 3 px. A preferência por movimento reduzido remove rolagem suave e transições dos cartões da comissão.
- Não foram observados alvos menores que 44 × 44 px no primeiro viewport nas seis larguras. Esta inspeção não substitui avaliação manual com leitor de tela nem certificação WCAG.
- Capturas da auditoria: `C:/Users/NIKOLAS/.codex/visualizations/2026/11/01/01a1991c-dda7-74d0-a94e-88a926eb5e4a/audit-responsive-2026-11-01/`.
