# SPEC-005 — Movimento esportivo

**Direção aprovada:** segunda simulação, esportiva e expressiva (01/11/2026).

**Estado:** implementada e verificada no navegador local. Evidências e limites em [registro de implementação](../implementation/2026-11-01-movimento-esportivo.md).

## Objetivo e comportamento

Aplicar a direção escolhida à página existente. A hero revela o título em duas linhas, seguido de descrição e ações; uma faixa diagonal vermelha entra uma vez. Seções revelam títulos e grupos com entrada lateral e sequência curta, disparadas pela visibilidade real durante a rolagem nativa.

- Manter textos, conteúdo ilustrativo, ordem editorial, tamanhos de fonte e funções existentes.
- Título: revelação vertical em corte; duração de até 900 ms. Pequenos grupos: intervalo de 75 ms, duração de até 650 ms. Mobile: deslocamento lateral de até 14 px.
- Sem repetição contínua, pin, rolagem artificial, autoplay de vídeo ou animação obrigatória para acessar informação.
- HTML visível por padrão; JavaScript aplica a melhoria somente após inicializar. Falha ou ausência do script não pode esconder conteúdo.
- `prefers-reduced-motion: reduce`: não iniciar animações e cancelar as que estiverem em execução caso a preferência mude. Conteúdo focado por teclado deve ficar visível imediatamente.
- Links e controles recebem pequenas transições de interação somente com movimento permitido.

## Solução e limites

Script TypeScript processado pelo Astro no layout, Web Animations API e IntersectionObserver. A simulação escolhida já usa animação nativa; nenhuma biblioteca adicional é necessária para esta fatia. Não adicionar roteamento de cliente para uma página com âncoras.

## Aceite

- Verificar entrada da hero e revelação de seções na página real, incluindo reprodução por recarga.
- Verificar leitura e âncoras sem JavaScript, com redução de movimento e alteração dessa preferência durante uma animação.
- Verificar teclado durante revelações e carrosséis após as alterações.
- Sem overflow do documento em 320, 360, 390, 768, 1024 e 1440 px, inclusive durante animação.
- Executar `npm run check`, `npm run test` e `npm run build`.

## Plano de implementação

1. Ajustar marcação da hero para a revelação em linhas e faixa decorativa.
2. Adicionar módulo único de movimento e estilos de interação, mantendo a renderização estática.
3. Validar a página real no navegador e registrar resultados e limites na documentação de implementação.
