# AGENTS.md — BASE Vôlei Club

## Contexto
Site institucional editorial para apresentar o projeto social de vôlei BASE. A base atual é ilustrativa; não representa fatos confirmados sobre a operação do clube.

## Fonte de verdade
Antes de implementar, consulte `ARCHITECTURE.md`, `DESIGN.md`, `CONTENT.md`, `HANDOFF.md`, `design-spec.json` e `content.sample.json`. Em conflitos, decisões explícitas do usuário prevalecem; depois, `DESIGN.md` e `ARCHITECTURE.md`, então JSON e mockup. `assets/mockup-latest.png` é referência visual, não layout executável.

Specs incrementais ficam em `docs/specs/`; leia e atualize a spec da fatia correspondente antes de implementação relevante. A skill local `.agents/skills/astro-preview/SKILL.md` descreve como iniciar a prévia Astro.

## Arquitetura
- Astro + TypeScript + CSS com geração estática.
- Conteúdo editorial local em `src/data/site.json`; tipos em `src/types/content.ts`.
- Páginas em `src/pages`, layout compartilhado em `src/layouts`, componentes reutilizáveis em `src/components`.
- Mídia processável em `src/assets`; arquivos públicos em `public`.
- Scroll nativo e HTML acessível como padrão. JavaScript apenas para interações necessárias; GSAP/ScrollTrigger, React/Motion e Lenis são opcionais e só entram quando justificados.
- Sem backend, autenticação, CMS, formulários de inscrição ou integrações externas nesta fase.

## Regras de domínio e conteúdo
- Status editorial: `draft`, `illustrative` ou `confirmed`. Manter aviso ilustrativo visível até revisão oficial.
- Nunca inventar história, anos, métricas, credenciais, resultados, elenco, categorias, contatos ou URLs.
- Placares só aparecem com resultado confirmado. Eventos devem distinguir jogo e peneira e respeitar estados editoriais.
- Não publicar dados pessoais desnecessários de atletas menores. Não coletar dados de inscrição nesta base.
- URLs ausentes são `null`; não usar `href="#"` como ação falsa.
- Texto e interface em português brasileiro.

## Interface e acessibilidade
- Mobile first, sem overflow da página; testar 320, 360, 390, 768, 1024 e 1440 px.
- Um H1, landmarks, link para pular navegação, foco visível, navegação por teclado e controles com alvo mínimo proposto de 44 px.
- Conteúdo continua legível sem JavaScript. Respeitar `prefers-reduced-motion`; sem pin no mobile.
- Não apresentar pessoas fictícias do mockup como equipe real.

## Fluxo de trabalho
Siga DISCOVER → PLAN → BUILD → TEST → REVIEW → DOCUMENT. Faça a menor mudança compatível com as specs, preserve arquivos existentes e documente mudanças relevantes no domínio ou arquitetura. Não faça commit, publicação ou provisionamento sem solicitação explícita.

## Comandos
Os scripts do projeto ficam em `package.json`. Ao adicioná-los, manter `dev`, `check`, `build` e `preview` alinhados à arquitetura. Não alegar validação que não foi executada.

## Conteúdo demonstrativo autorizado
O usuário autorizou nomes, equipes e informações fictícias para desenvolver a estrutura inicial. Manter `contentMode: illustrative`, status ilustrativo e aviso explícito; os exemplos serão substituídos antes da publicação oficial. Não marcar exemplos como fatos confirmados.
