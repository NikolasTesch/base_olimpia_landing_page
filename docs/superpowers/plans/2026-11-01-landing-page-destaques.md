# Destaques da Landing Page — Plano de Implementação

> **Para agentes de implementação:** usar `superpowers:executing-plans` para executar as tarefas em sequência.

**Objetivo:** ampliar o protagonismo da hero, destacar pessoas na história, separar os atletas por equipes com navegação em carrossel, preparar espaços de publicações do Instagram e apresentar canais de contato no rodapé.

**Arquitetura:** manter Astro estático, conteúdo em `src/data/site.json` e componentes existentes. A hero usa poster gráfico/fotográfico com player institucional opcional; carrosséis usam scroll-snap e pequenos controles progressivos em JavaScript; contatos são renderizados a partir de campos configuráveis.

**Stack:** Astro, TypeScript, CSS e Vitest já instalados.

**Design aprovado:** `docs/superpowers/specs/2026-11-01-landing-page-destaques-design.md`.

## Restrições

- Vídeo institucional só inicia por ação explícita; ausência de poster não pode simular foto real.
- Dados demonstrativos continuam com aviso editorial; nenhum contato ou canal acionável deve ser inventado.
- Preservar leitura sem JavaScript, navegação por teclado e respeito a `prefers-reduced-motion`.
- Sem dependências novas, embeds externos, backend ou alterações de publicação.

## Arquivos e responsabilidades

- `src/components/HeroVideo.astro`, `src/styles/global.css`: hero de largura total com mídia de fundo e controles opcionais.
- `src/components/StaffSection.astro`, `src/styles/global.css`: destaque visual aplicado somente à comissão técnica.
- `src/components/TeamsSection.astro`, `src/styles/global.css`: agrupamento por equipe e carrossel de atletas com scroll-snap/controles acessíveis.
- `src/components/InstagramUpdates.astro`, `src/styles/global.css`: cartões em proporção de publicação e destinos condicionais.
- `src/components/SiteFooter.astro`, `src/data/site.json`: campos de contato opcionais e estados sem dados.
- `docs/specs/001-base-editorial-responsiva.md`, `002-hero-e-midia.md`, `004-historia-e-pessoas.md` e `docs/specs/README.md`: registrar comportamento implementado e homologação pendente.

### Tarefa 1: Hero em largura total

- [x] Trocar layout lateral pela composição full-bleed, mantendo copy e ação legíveis sobre gradiente; poster ausente mostra tratamento gráfico abstrato.
- [x] Mostrar player institucional acessível somente quando houver `storyVideoSrc`; manter vídeo pausado até a ação do visitante.
- [x] Ajustar responsividade e movimento reduzido sem esconder conteúdo.

### Tarefa 2: Destaque visual em “Quem faz acontecer”

- [x] Manter a história sem cartão duplicado de pessoa.
- [x] Aplicar acento visual e cartões destacados aos perfis já apresentados na seção da comissão.

### Tarefa 3: Equipes em carrosséis

- [x] Separar cada equipe em seu próprio trilho com `scroll-snap`, cartões de atletas, rótulo acessível e controles anterior/próximo.
- [x] Manter todos os cartões disponíveis no HTML e por foco de teclado; remover animação suave sob movimento reduzido.

### Tarefa 4: Instagram e rodapé

- [x] Mostrar os espaços de publicações como cartões quadrados; só oferecer links quando `permalink` ou `profileUrl` estiverem configurados.
- [x] Adicionar telefone, localização/URL, Instagram, e-mail e WhatsApp opcionais. Ausências exibem “A informar” sem gerar link.

### Tarefa 5: Documentação e validação

- [x] Atualizar as três specs e índice para descrever o comportamento e manter homologação de conteúdo real como pendente.
- [x] Executar `npm run test`, `npm run check` e `npm run build`.
- [ ] Revisar visualmente desktop e mobile no preview e conferir links/âncoras e ausência de overflow. Desktop e âncoras verificados; viewport CSS de 500 px sem overflow; revisão em 320/360/390 px segue pendente.

## Critério de conclusão

As cinco tarefas são concluídas quando os comportamentos acima estiverem presentes, as validações passarem, as specs refletirem a implementação e todos os estados sem mídia/contato continuarem claros e seguros.
