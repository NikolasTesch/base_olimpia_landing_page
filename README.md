# BASE Vôlei Club

Site institucional editorial do projeto social BASE Vôlei Club. O conteúdo atual é ilustrativo e permanece identificado como tal até a confirmação das informações oficiais.

## Executar localmente

Requer Node.js compatível com a versão do Astro instalada.

```sh
npm install
npm run dev
```

Comandos disponíveis:

```sh
npm run check
npm run build
npm run preview
```

## Organização

- `src/pages`: páginas Astro.
- `src/layouts`: estrutura HTML compartilhada.
- `src/data/site.json`: conteúdo demonstrativo da página.
- `src/types`: contratos TypeScript iniciais.
- `src/styles`: tokens e estilos globais.
- `public/brand`: escudo de referência; substituir pelo SVG definitivo quando fornecido.
- `public/video`: reservado para mídia futura; não há vídeo incluído.
- `ARCHITECTURE.md`, `DESIGN.md`, `CONTENT.md`, `HANDOFF.md`: decisões e especificações da base.

Consulte `AGENTS.md` antes de implementar novas fatias. O mockup em `assets/` é somente referência visual e não representa pessoas ou funcionamento real do site.

## Specs

As specs incrementais e sua ordem de implementação ficam em [docs/specs/README.md](docs/specs/README.md).

