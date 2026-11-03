# SPEC-006 — Fundos em movimento

**Estado:** implementada; evidências em [registro de implementação](../implementation/2026-11-01-fundos-em-movimento.md).

## Objetivo

Adicionar movimento ambiente perceptível em mobile, independente de hover, conforme solicitação do usuário. Complementa SPEC-005: loops decorativos de fundo passam a ser permitidos com controle global de pausa.

## Comportamento e aceite

- Linhas de quadra/círculos e luz difusa em navy/vermelho se deslocam lentamente atrás do conteúdo; texto, imagens e controles permanecem imóveis e legíveis.
- Funcionar em mobile e desktop, sem dependência de mouse ou toque, flashes, áudio, vídeo ou controle artificial de scroll.
- Animar apenas transform/opacity de camadas decorativas, sem assets externos ou novas dependências. Suspender fora da área visível e quando a aba estiver oculta.
- Controle global visível de pelo menos 44 px permite pausar/retomar todos os fundos, com estado acessível. Deve estar disponível também no mobile.
- Redução de movimento mantém tudo estático e oculta o controle desnecessário. Sem JavaScript, não criar loops nem ocultar conteúdo.
- Preservar a escala mobile revisada e a navegação. Validar movimento real, pausa, retomada, viewport, aba oculta, preferência reduzida, ausência de JS e overflow em 320, 360, 390, 768, 1024 e 1440 px.

## Plano

Módulo TypeScript processado pelo Astro adiciona camadas decorativas e observa visibilidade. CSS define os ciclos. Controle no layout compartilhado. Verificar a página real e executar check, testes existentes e build.

## Ajuste para telas amplas — 03/11/2026

A partir de 1200 px, ampliar gradualmente a quadra e a luz difusa existentes e adicionar luz e sombra estáticas nas laterais das seções claras e marinho. O centro permanece suave para preservar a leitura. Abaixo desse limite, manter o visual atual; a hero fotográfica permanece fora do efeito. Reutilizar o movimento existente e suas condições de visibilidade e redução de movimento.
