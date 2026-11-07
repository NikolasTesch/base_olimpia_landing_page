# SPEC-010 — Patrocinadores e Apoiadores

**Estado:** Implementada e validada (`check`, `test`, `build`)  
**Fatia:** Seção de apoiadores e patrocinadores oficiais (`#apoiadores`)  
**Fontes:** `DESIGN.md`, `ARCHITECTURE.md`, `CONTENT.md`, `src/data/site.json`

## Objetivo

Apresentar as empresas parceiras e patrocinadores do BASE Vôlei Club na seção "Quem joga junto." (`#apoiadores`), exibindo marcas reais em cards limpos e responsivos, além de disponibilizar canal direto para novas parcerias e apoios.

## Escopo

- Modelar e tipar a entidade editorial `Partner` (`id`, `name`, `category`, `logoSrc`, `url`, `status`) estendendo `EditorialItem`.
- Adicionar função de projeção `getPublicPartners` em `src/domain/content.ts` com cobertura de testes em `src/domain/content.test.ts`.
- Processar e otimizar os logos reais das 3 empresas enviadas pelo usuário em formato WebP e PNG de alta resolução com transparência:
  1. **CST Impermeabilização** (`/images/apoiadores/cst-impermeabilizacao.webp`)
  2. **FASE** (`/images/apoiadores/fase.webp`)
  3. **33 Veículos** (`/images/apoiadores/33-veiculos.webp`) — adaptada com tipografia navy `#082541` para contraste sobre superfície clara e versão original preservada.
- Adicionar os dados no `src/data/site.json` e `content.sample.json` com canal de contato WhatsApp oficial (`https://wa.me/5527997282733`).
- Refatorar `PartnersSection.astro` para renderizar os cards dos patrocinadores e um card adicional com CTA "Sua Marca Aqui" completando o grid.
- Atualizar `src/styles/global.css` com estilização moderna dos cards, alinhamento visual, estados `:hover` e acessibilidade `:focus-visible`.

## Critérios de Aceite

1. Os três patrocinadores aparecem com logo, nome e identificação de categoria ("Patrocinador Oficial").
2. O quarto card atua como convite de apoio ("Sua Marca Aqui") com link direto para o canal de contato do clube.
3. A chamada inferior (`.support-callout`) convida novas marcas com botão de ação funcional ("Converse com o BASE").
4. A seção é responsiva em todas as viewports (320px, 360px, 390px, 768px, 1024px e 1440px) sem overflow horizontal.
5. Os cards respeitam `prefers-reduced-motion` e mantêm integração com as animações de scroll do `motion.ts`.
6. `npm run check`, `npm test` e `npm run build` passam sem erros.
