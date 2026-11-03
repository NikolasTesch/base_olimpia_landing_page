# SPEC-002 — Hero e mídia progressiva

**Estado:** Estrutura implementada; homologação final pendente  
**Fatia:** abertura visual posterior à base editorial  
**Fontes:** `DESIGN.md`, `ARCHITECTURE.md`, `CONTENT.md`, `design-spec.json`

## Objetivo

Apresentar o propósito do BASE na primeira dobra e estabelecer estados seguros para poster, vídeo institucional e ausência ou falha de mídia.

## Escopo

- Hero responsiva com título, descrição, ação e imagem de poster opcional.
- Composição visual full-bleed em largura total, com texto em primeiro plano e contraste garantido por overlay.
- Com `posterSrc` ausente, usar um fundo gráfico da identidade visual, sem simular uma foto ou vídeo do time.
- Vídeo institucional completo só pode iniciar por ação explícita do usuário e precisa de controles e legendas quando houver fala.
- Eventual loop decorativo é uma melhoria opcional e só pode carregar depois do conteúdo principal; incluir controle de pausa.

## Fora de escopo

Produção de vídeo/fotografia, autoplay com áudio, carregamento de vídeo pesado na abertura, animação 3D, Lenis e pin de rolagem.

## Comportamento esperado

1. Título, descrição, poster/fundo e ação aparecem no HTML inicial.
2. Sem vídeo institucional, a ação navega para `#historia` e usa o rótulo “Conheça o projeto”.
3. O poster ocupa a área visual completa da hero; título e ação permanecem legíveis sem cobrir rostos.
4. Vídeo decorativo, caso exista, é mudo, pode ser pausado e não é requisito para compreender a página.
5. Se autoplay for recusado ou o arquivo falhar, manter poster, texto e ação.
6. Com `prefers-reduced-motion: reduce`, mostrar poster estático e não iniciar loop ou parallax.

## Critérios de aceite

- O estado sem mídia funciona com `posterSrc`, `backgroundVideoSrc` e `storyVideoSrc` nulos.
- O estado com poster mantém dimensão reservada e texto legível nas larguras 320, 390 e 1440 px.
- A mídia cobre a largura da viewport em mobile e desktop; o fundo gráfico mantém o mesmo espaço quando `posterSrc` está ausente.
- Nenhum player inicia áudio ou reprodução institucional sem interação.
- A ação principal nunca aponta para um player indisponível.
- Falhas de rede/autoplay preservam uma hero utilizável.
- `npm run check` e `npm run build` passam.

## Dependências e pendências

O escudo atual é apenas referência de marca; poster e mídia oficiais ainda não foram entregues. A ausência deles deve continuar sendo um estado suportado, sem bloquear a fatia.

## Revisão fotográfica de 03/11/2026

A foto preenche a abertura. Um degradê neutro protege a leitura e o vermelho
fica no CTA. A foto parte de uma aproximação leve e chega ao enquadramento
final em uma única animação CSS. O título entra com opacidade, em bloco.
Com movimento reduzido, ambos aparecem no estado final. No mobile, o
degradê concentra a sombra na região do texto. As demais seções mantêm efeitos de quadra, trajetórias e luz ambiente em
movimento. A revisão substitui a composição tática da abertura.
