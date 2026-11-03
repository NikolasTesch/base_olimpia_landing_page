# SPEC-009 — Giro automático de 3.3s e Painel do Dono (`/dono`) para gestão de equipes e atletas

**Estado:** implementada e validada (03/11/2026). Registro em [implementação](../implementation/2026-11-03-painel-dono-equipes-atletas.md).

## Objetivo

1. Simplificar os controles do Carrossel Coverflow 3D na seção `#equipes`, removendo o botão manual de pausar/ativar giro e mantendo a rotação automática em loop contínuo a cada **3,3 segundos (`3300 ms`)**.
2. Criar a rota exclusiva `/dono` (`src/pages/dono.astro`) permitindo ao proprietário gerenciar equipes e cartões de atletas (incluindo upload de foto, recorte automático de fundo, ajustes de zoom/enquadramento no escudo Pop-Out e edição de dados) com persistência híbrida (arquivos do projeto + `localStorage`).

## Comportamento esperado

### 1. Carrossel Coverflow 3D em Loop (3,3 segundos)
- O botão `.carousel-pause-btn` (`⏸ Giro` / `▶ Giro`) é removido do cabeçalho das equipes.
- O carrossel avança automaticamente em loop a cada **3300 ms** enquanto a seção estiver visível (respeitando `prefers-reduced-motion: reduce`, aba oculta e pausa momentânea enquanto o usuário interage diretamente com os cards).
- Os botões de passo manual (`←` e `→`), o arraste (`drag="x"`) e a barra inferior de seleção de atletas permanecem disponíveis.

### 2. Painel do Dono (`/dono`)
- Acessível na rota `/dono`.
- **Gestão de Equipes:**
  - Editar nome e categoria das equipes existentes (ex.: `Equipe Horizonte`, `Equipe Maré`).
  - Adicionar nova equipe e remover equipe (impedindo órfãos ou movendo atletas).
- **Gestão de Atletas (Cards):**
  - Selecionar qualquer atleta existente ou adicionar novo atleta.
  - Editar `name`, `position` (sugestões rápidas das posições do vôlei: Levantador, Ponteira, Ponteiro, Central, Oposto, Líbero), `teamId` e `photoSrc`.
  - **Upload de Foto e Recorte:**
    - Enviar imagem do computador (`.png`, `.jpg`, `.webp`) ou informar URL.
    - Opção **Recortar fundo automaticamente** para gerar a silhueta transparente (`-cutout.webp`) para o efeito Pop-Out.
  - **Ajuste fino no Escudo Pop-Out (Preview ao vivo):**
    - Controles de **Zoom (`photoScale`)**, **Posição Horizontal (`photoOffsetX`)** e **Posição Vertical (`photoOffsetY`)** aplicados em tempo real no card Pop-Out (tanto no preview de `/dono` quanto na landing page `/`).
- **Persistência Híbrida:**
  - Salva no `localStorage` (`base:equipes-override`) para atualização imediata no navegador e em preview estático.
  - Quando em execução via servidor de desenvolvimento (`npm run dev`), grava diretamente em `src/data/site.json` e salva fotos/recortes em `public/images/athletes/` através de endpoints locais do Vite (`/__dono_api/save` e `/__dono_api/upload`).

## Regras de domínio e acessibilidade

- Manter validação de integridade (`teamId` de cada atleta deve pertencer a uma equipe existente).
- Preservar todos os controles acessíveis com alvo mínimo de 44×44 px.
- O build estático (`npm run build`) deve continuar gerando `/index.html` e `/dono/index.html` sem erros.

## Critérios de aceite

- Carrossel girando a cada `3300 ms` sem o botão de pausar giro.
- Página `/dono` funcional permitindo editar equipes e atletas, enviar foto, ajustar zoom/posição com preview Pop-Out ao vivo e refletir as alterações na página inicial `/`.
- `npm run check`, `npm run test` e `npm run build` aprovados sem erros.
