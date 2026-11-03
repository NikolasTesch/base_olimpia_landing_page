# Plano de Implementação — Primeiras Quatro Specs

> **Para agentes de implementação:** SUB-SKILL OBRIGATÓRIA: use `superpowers:executing-plans` para executar este plano tarefa por tarefa. Cada etapa termina em verificação independente.

**Objetivo:** Implementar a base responsiva, a hero poster-first, as listagens de resultados/agenda e as seções de história/pessoas sem publicar informações não confirmadas.

**Arquitetura:** A página permanece Astro estática e recebe componentes Astro focados por seção, dados locais e regras puras de conteúdo. Placeholders abstratos de mídia mantêm proporção e indicam cada espaço para substituição futura por fotografia/poster autorizado.

**Stack:** Astro 7.4.4, TypeScript 6.0.3, CSS, Vitest 5.0.5 para regras puras de domínio; sem integração externa. O ambiente observado usa Node 24.12.0 e Vite 8.3.5, compatíveis com a linha atual do [Vitest](https://vitest.dev/guide/).

**Specs:** `docs/specs/001-base-editorial-responsiva.md`, `002-hero-e-midia.md`, `003-resultados-e-agenda.md`, `004-historia-e-pessoas.md`.

## Restrições globais

- Manter geração estática e conteúdo local em `src/data/site.json`.
- Manter visível o aviso ilustrativo até que o conteúdo institucional seja revisado.
- Dados reais ausentes permanecem `null` ou usam estado vazio; não criar fatos, links, placares, datas, credenciais ou pessoas.
- Atletas menores não recebem campos pessoais adicionais; perfis e fotografias exigem autorização apropriada.
- Validar layout em 320, 360, 390, 768, 1024 e 1440 px; reduzir movimento com `prefers-reduced-motion`.
- Vitest 5.0.5 requer Node `^22.12.0 || ^24.0.0 || >=26.0.0` e Vite `>=6.4.0`; o ambiente observado usa Node 24.12.0 e Vite 8.3.5.
- Não adicionar backend, CMS, formulários de inscrição, deploy, GSAP ou React nesta fatia.
- Executar `npm run check` e `npm run build` em cada tarefa; após a Tarefa 3, executar também `npm run test` para regras de domínio. Manter dependências fixas no lockfile.

## Foco de revisão

1. **Imagem ou poster ausente/falho:** conteúdo e CTA da hero continuam acessíveis; coberto na verificação dos estados nulos na Tarefa 2 e na revisão visual da Tarefa 1.
2. **Evento ou partida sem data:** não inventar data nem deixar ordem instável; coberto pelos testes da Tarefa 3.
3. **Partida sem resultado confirmado ou evento cancelado/adiado:** nunca mostrar placar indevido e sempre expor estado textual; coberto pelos testes da Tarefa 3.
4. **Atleta ligado a equipe inexistente ou conteúdo pessoal indevido:** falhar validação e não renderizar campos não permitidos; coberto pelos testes da Tarefa 4.
5. **Conteúdo ilustrativo sem JavaScript/redução de movimento:** manter leitura e indicar placeholders; coberto pela revisão visual das Tarefas 1, 2 e 4.

## Arte temporária para futuras imagens

O wireframe visual `docs/specs/assets/media-slots-mockup.svg` mostra quatro encaixes: hero 16:9, história 3:2, retrato profissional 4:5 e retrato de atleta 4:5. São apenas molduras geométricas com rótulos, sem fotos ou pessoas fictícias. Na implementação, usar um componente reutilizável `MediaPlaceholder.astro` enquanto cada mídia oficial estiver ausente; aceitar imagem real por `src` e texto alternativo explícito quando a mídia for fornecida.

## Arquivos e responsabilidades

- `src/pages/index.astro`: composição e ordenação das seções.
- `src/components/SiteHeader.astro`, `IllustrativeNotice.astro`, `SiteFooter.astro`: navegação, aviso e fechamento.
- `src/components/SectionHeading.astro`, `MediaPlaceholder.astro`: padrão de título e moldura temporária com proporção e rótulo.
- `src/components/HeroVideo.astro`, `ProjectIntro.astro`, `HistoryTimeline.astro`, `StaffSection.astro`, `CompetitionHistory.astro`, `MatchResults.astro`, `EventAgenda.astro`, `TeamsSection.astro`, `InstagramUpdates.astro`, `PartnersSection.astro`: renderização editorial por seção.
- `src/data/site.json`: fonte local dos dados já definidos no conteúdo de exemplo.
- `src/types/content.ts`: contratos tipados para os estados editoriais, partidas, eventos, equipe e atleta.
- `src/domain/content.ts`: validação e ordenação pura para regras de conteúdo.
- `src/domain/content.test.ts`: casos automatizados para placares, estados, datas e relações por ID.
- `src/styles/global.css`: tokens, breakpoints, foco, placeholders e estados de movimento reduzido.
- `package.json` / `package-lock.json`: script `test` e dependência de desenvolvimento Vitest 5.0.5; `.gitignore`: saída local `.vitest/`.

---

### Tarefa 1: Base editorial responsiva (SPEC-001)

**Arquivos:** criar `SiteHeader.astro`, `IllustrativeNotice.astro`, `SiteFooter.astro`, `SectionHeading.astro`, `ProjectIntro.astro`, `CompetitionHistory.astro`, `InstagramUpdates.astro` e `PartnersSection.astro`; refatorar `src/pages/index.astro` para compô-los; ajustar `src/styles/global.css`; atualizar `docs/specs/001-base-editorial-responsiva.md` com decisões resultantes.

**Interfaces:** `SectionHeading` recebe `eyebrow?: string`, `title: string` e `description?: string`. O aviso mantém a mensagem vinda de `site.notice`. O cabeçalho recebe a lista de âncoras e aponta somente a IDs existentes. Extrair também as seções que já estão renderizadas (competição, Instagram e apoio), preservando seus estados atuais.

- [ ] Extrair cabeçalho, aviso e rodapé da página e renderizar os links de navegação para todas as seções existentes.
- [ ] Organizar a página em componentes de seção nomeados, mantendo conteúdo do JSON e a ordem descrita em `DESIGN.md`.
- [ ] Ajustar CSS para os tokens propostos, uma coluna textual em mobile e breakpoints de 48rem e 64rem conforme o conteúdo.
- [ ] Revisar teclado, foco, skip link, hierarquia de títulos e contraste nos seis viewports definidos; confirmar ausência de overflow do documento.
- [ ] Executar `npm run check` e `npm run build`; ambos devem terminar sem erros.

### Tarefa 2: Hero e molduras de mídia substituíveis (SPEC-002)

**Arquivos:** criar `src/components/HeroVideo.astro` e `src/components/MediaPlaceholder.astro`; atualizar dados/markup da hero, `src/styles/global.css` e os tipos necessários. Usar `docs/specs/assets/media-slots-mockup.svg` como guia de proporções, sem publicar o wireframe como fotografia.

**Interfaces:** `MediaPlaceholder` recebe `label: string`, `ratio: 'wide' | 'landscape' | 'portrait' | 'square'` e `src?: string | null`; `alt` é obrigatório quando `src` existe. A hero usa o destino configurado do vídeo quando disponível; caso contrário usa `#historia`.

- [ ] Verificar no preview o markup gerado com `posterSrc`, `backgroundVideoSrc` e `storyVideoSrc` nulos, confirmando título e ação para `#historia`.
- [ ] Implementar moldura abstrata com proporção reservada, rótulo de placeholder e sem silhueta/foto falsa; permitir substituição por mídia real autorizada.
- [ ] Implementar hero poster-first. Player institucional exige ação explícita; qualquer loop decorativo deve ser mudo, pausável, carregado depois e removido em redução de movimento.
- [ ] Conferir visualmente 320, 390 e 1440 px e o estado de imagem ausente/falha; título e ação continuam legíveis.
- [ ] Executar `npm run check` e `npm run build`; ambos devem passar.

### Tarefa 3: Regras e apresentação de partidas e agenda (SPEC-003)

**Arquivos:** criar `src/domain/content.ts` e `src/domain/content.test.ts`; ampliar `src/types/content.ts`; criar `MatchResults.astro` e `EventAgenda.astro`; ligar componentes a `src/data/site.json`; adicionar Vitest e o script `npm run test` em `package.json`.

**Interfaces:** `ContentValidationInput` contém `matches: Match[]`, `events: ProjectEvent[]`, `teams: Team[]` e `athletes: Athlete[]`. `ContentIssue` é `{ path: string; code: 'DATE_INVALID' | 'SCORE_UNCONFIRMED' | 'OPEN_TRYOUT_WITHOUT_CONTACT' | 'TEAM_NOT_FOUND'; message: string }`. `getRecentCompletedMatches(matches: Match[], limit = 3): Match[]` devolve resultados concluídos, confirmados e com placar em data decrescente. `selectUpcomingEvents(events: ProjectEvent[], now: Date): { dated: ProjectEvent[]; pendingDate: ProjectEvent[] }` separa eventos futuros ordenados dos eventos sem data. `getEventStatusLabel(event: ProjectEvent): string` devolve rótulo textual para cada estado. `validateContent(input: ContentValidationInput): ContentIssue[]` devolve caminhos e códigos para data inválida, placar sem confirmação, inscrição sem canal ou ID de equipe inválido.

- [ ] Adicionar Vitest 5.0.5 e o script `npm run test`; escrever testes `getRecentCompletedMatchesReturnsOnlyConfirmedResultsInDateOrder`, `selectUpcomingEventsSortsByDateAndSeparatesUndated`, `getEventStatusLabelDescribesCancelledAndPostponedStates`, `validateContentRejectsUnconfirmedScore`, `validateContentRejectsInvalidDate` e `validateContentRequiresContactForOpenTryout`; usar relógio fixo via argumento `now`.
- [ ] Rodar `npm run test` e confirmar falha dos casos antes das regras serem implementadas.
- [ ] Implementar funções puras e validação de conteúdo sem dependência de rede ou horário global implícito; receber `now` como argumento e tipar `ContentIssue` como `{ path: string; code: 'DATE_INVALID' | 'SCORE_UNCONFIRMED' | 'OPEN_TRYOUT_WITHOUT_CONTACT' | 'TEAM_NOT_FOUND'; message: string }`.
- [ ] Renderizar estados textuais para partida/evento e impedir links ou chamadas de inscrição sem URL e status confirmados.
- [ ] Executar `npm run test`, `npm run check` e `npm run build`; todos devem passar.

### Tarefa 4: História, profissionais, equipes e atletas (SPEC-004)

**Arquivos:** criar `HistoryTimeline.astro`, `StaffSection.astro` e `TeamsSection.astro`; ampliar `src/domain/content.ts` e seus testes; atualizar os contratos de `src/types/content.ts` e os exemplos em `src/data/site.json` apenas quando necessários.

**Interfaces:** `Milestone` tem `id`, `title`, `date: string | null`, `body` e `status`; `StaffMember` tem `id`, `name`, `role`, `bio`, `photoSrc: string | null` e `status`; `Team` tem `id`, `name`, `category: string | null` e `status`; `Athlete` tem `id`, `teamId`, `name`, `position: string | null`, `photoSrc: string | null` e `status`. Tipos públicos omitem `status`: `PublicMilestone = Pick<Milestone, 'id' | 'title' | 'date' | 'body'>`, `PublicStaffMember = Pick<StaffMember, 'id' | 'name' | 'role' | 'bio' | 'photoSrc'>`, `PublicTeam = Pick<Team, 'id' | 'name' | 'category'>` e `PublicAthlete = Pick<Athlete, 'id' | 'teamId' | 'name' | 'position' | 'photoSrc'>`. `getPublicMilestones(items: Milestone[]): PublicMilestone[]` remove rascunhos e preserva a ordem editorial; `getPublicStaffMembers(items: StaffMember[]): PublicStaffMember[]`, `getPublicTeams(items: Team[]): PublicTeam[]` e `getPublicAthletes(items: Athlete[]): PublicAthlete[]` removem rascunhos e projetam apenas os campos listados. Atletas referenciam equipe por `teamId`. Imagens opcionais usam `MediaPlaceholder`.

- [ ] Antes de implementar, revisar SPEC-004 e confirmar que os critérios editoriais estão claros; não é necessário aguardar nomes ou fotos reais para usar dados ilustrativos.
- [ ] Escrever testes `validateContentRejectsAthleteWithoutTeam`, `getPublicMilestonesPreservesOrderWithoutInventingDates`, `getPublicStaffMembersSkipsDraftAndProjectsAllowedFields` e `getPublicAthletesProjectsMinimalFields`; incluir um campo extra somente no fixture em memória e verificar que a projeção não o contém.
- [ ] Implementar validação e renderização em ordem editorial, sem cronologia ou credenciais inferidas.
- [ ] Mostrar placeholders rotulados para história, profissionais e atletas até que imagens autorizadas sejam incluídas; não usar pessoas do mockup existente.
- [ ] Revisar visualmente 320, 390 e 1440 px, confirmando imagens não esticadas, leitura sem JavaScript e aviso ilustrativo.
- [ ] Executar `npm run test`, `npm run check` e `npm run build`; todos devem passar.

## Critério de conclusão

As quatro tarefas ficam concluídas quando seus critérios de aceite passam, os quatro estados das specs são atualizados, o aviso ilustrativo segue visível e nenhuma imagem ou informação não confirmada é apresentada como real. A publicação oficial continua fora deste plano.

## Execução da estrutura inicial

Implementação autorizada pelo usuário em 01/11/2026, incluindo conteúdo fictício substituível. As quatro áreas foram implementadas. Evidências e pendências de homologação estão em `docs/implementation/2026-11-01-landing-page.md`; os critérios completos das specs ainda dependem da revisão visual final e dos materiais oficiais.
