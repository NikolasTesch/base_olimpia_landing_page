# SPEC-003 — Resultados e agenda esportiva

**Estado:** Estrutura implementada; homologação final pendente  
**Fatia:** listagem local de partidas e eventos  
**Fontes:** `ARCHITECTURE.md`, `DESIGN.md`, `CONTENT.md`, contratos em `design-spec.json`

## Objetivo

Exibir partidas e eventos do BASE com estado e dados confirmados, sem inferir placares, datas, inscrições ou locais.

## Escopo

- Tipos e validações para `Match` e `Event` em conteúdo local.
- Resultados concluídos ordenados por data decrescente, com no máximo três itens recentes na página.
- Agenda futura ordenada cronologicamente, distinguindo jogo de peneira.
- Estados vazios e estados de adiado/cancelado/inscrição não confirmada.

## Regras de domínio

- Partida concluída só publica `scoreSets` quando o resultado estiver confirmado.
- Parciais são opcionais; uma partida agendada não pode renderizar placar.
- Datas reais são ISO 8601 com fuso explícito quando conhecido.
- Evento é `match` ou `tryout`; estados são `planned`, `confirmed`, `postponed` ou `cancelled`.
- Peneira só apresenta chamada de inscrição quando `registrationState` for `open` e houver canal confirmado.
- URLs sem confirmação ficam `null`; não renderizar botão sem destino.

## Critérios de aceite

- Conteúdo vazio mostra as mensagens definidas em `content.sample.json`.
- Partidas sem resultado confirmado nunca exibem sets/parciais como placar.
- Datas ausentes não são inventadas nem ordenadas como se fossem conhecidas.
- Evento cancelado ou adiado tem estado textual, não indicado apenas por cor.
- Eventos futuros aparecem do mais próximo ao mais distante; resultados do mais recente ao mais antigo.
- Casos de ordenação, placar e relação de IDs têm verificações automatizadas sem exigir serviço externo.
- `npm run check` e `npm run build` passam.

## Fora de escopo

Sincronização em tempo real, API, scraping, integração com Instagram, formulário de inscrição e inclusão de resultados reais não fornecidos.
