# SPEC-001 — Base editorial responsiva

**Estado:** Implementada e homologada em viewports responsivas; acessibilidade automatizada básica verificada  
**Fatia:** acabamento estrutural e visual da página editorial existente  
**Fontes:** `DESIGN.md`, `ARCHITECTURE.md`, `HANDOFF.md`

## Objetivo

Fazer a página inicial funcionar como uma apresentação editorial legível e navegável em telas pequenas e grandes, preservando o conteúdo demonstrativo e a renderização estática do Astro.

## Escopo

- Organizar cabeçalho, aviso ilustrativo, seções e rodapé em componentes Astro com responsabilidades claras.
- Completar a navegação por âncoras para as áreas previstas em `DESIGN.md`, incluindo estados de foco e navegação por teclado.
- Ajustar container, tipografia, respiro, cards e fundos segundo os tokens propostos em `DESIGN.md`.
- Manter uma coluna para conteúdo textual em mobile; reservar grades para larguras em que a leitura permaneça confortável.
- Apresentar as prévias do Instagram em cartões próprios; só oferecer links quando o destino oficial estiver configurado.
- Exibir telefone, localização, Instagram, e-mail e WhatsApp no rodapé como campos opcionais; valores ausentes mostram “A informar” sem link.
- Permitir carrosséis horizontais contidos para atletas, com navegação por teclado e controles quando JavaScript estiver disponível.
- Manter todo o conteúdo principal legível sem JavaScript.

## Fora de escopo

Player de vídeo, carrossel interativo, animações GSAP, CMS, dados oficiais, formulário de inscrição e publicação.

## Comportamento esperado

1. O aviso de apresentação ilustrativa é visível ao carregar a página.
2. O link “Pular para o conteúdo” leva ao `<main>`.
3. A página tem um único H1, landmarks semânticos e títulos de seção hierárquicos.
4. Links do cabeçalho e rodapé apontam para IDs existentes; nenhuma ação usa `href="#"` como placeholder.
5. Em larguras mobile, textos, cards e navegação não causam overflow horizontal do documento.
6. O foco do teclado é visível. A preferência `prefers-reduced-motion` remove rolagem suave e movimento não essencial.
7. A informação continua completa quando scripts não carregam ou estão desativados.
8. Cabeçalho inspirado na [Cartage](https://www.cartage.ai/), observado em desktop e em 390 px. A barra sobrepõe a abertura, com links centrais e ação compacta no desktop. No mobile, marca e ícone de duas linhas abrem um painel branco de links verticais. O menu funciona sem JavaScript e fecha ao escolher um link ou pressionar Escape quando o script está disponível.

## Critérios de aceite

### Revisão de escala mobile — 01/11/2026

O usuário solicitou reduzir a escala visual ao estreitar a página. Até 48rem: título principal entre 30 e 34 px, títulos de seção entre 22 e 26 px, subtítulos em 18 px e corpo/introduções em 16 px com entrelinha 1,5. Abertura com altura mínima de 480 px, seções com 40 px de respiro vertical e retratos da comissão em coluna lateral compacta, mantendo proporção 4:5 e biografia na largura do cartão. Eliminar a soma desnecessária de margem do título e gap no bloco introdutório. Preservar controles com área de toque mínima de 44 px, conteúdo integral, animações e a escala desktop. Validar capturas antes/depois em mobile e ausência de overflow nas seis larguras previstas.

- A página é revisada em 320, 360, 390, 768, 1024 e 1440 px.
- Em 320 e 360 px, não há rolagem horizontal da página; faixas horizontais intencionais ficam contidas e operáveis por teclado.
- Em larguras de 390 px ou menos, conteúdo textual é empilhado em uma coluna.
- Texto de corpo permanece entre 16 e 18 px e metadados nunca ficam abaixo de 14 px.
- Todos os links internos resolvem para uma seção existente e são alcançáveis por teclado.
- O contraste do texto e do foco é verificado; o vermelho não é usado para texto pequeno sem contraste suficiente.
- `npm run check` e `npm run build` passam.
- `npm run test` passa.

## Homologação responsiva e acessibilidade — 01/11/2026

- Viewports CSS revisadas: 320, 360, 390, 768, 1024 e 1440 px. Em todas, a largura rolável do documento coincide com a largura útil da viewport; nos dois maiores tamanhos, a diferença em relação à largura da janela é somente a barra vertical do navegador.
- Os únicos elementos com rolagem horizontal são os trilhos intencionais dos carrosséis de atletas. A navegação mobile agora quebra em duas linhas e não depende de rolagem horizontal escondida.
- Um H1 por página, nenhuma âncora interna sem destino e nenhum alvo visível menor que 44 × 44 px no primeiro viewport medido.
- O primeiro Tab alcança “Pular para o conteúdo”, com indicador de foco de 3 px. `prefers-reduced-motion: reduce` desativa rolagem suave e transições dos cartões.
- Capturas em `C:/Users/NIKOLAS/.codex/visualizations/2026/11/01/01a1991c-dda7-74d0-a94e-88a926eb5e4a/audit-responsive-2026-11-01/`.
- Verificação feita em Chrome headless isolado na prévia local. Não equivale a certificação WCAG nem inclui avaliação com leitor de tela ou teste manual completo de todos os estados/contrastes.

## Casos de erro e limites

- Se um recurso visual falhar, texto, navegação e seções continuam disponíveis.
- Se uma seção não tiver conteúdo confirmado, renderizar o estado ilustrativo/vazio definido em `CONTENT.md`; não preencher com fatos inventados.
- Canais de contato ausentes permanecem como “A informar” e nunca geram links fictícios.
