# Ajuste de escala mobile — 01/11/2026

Após o relato de informações grandes ao reduzir a largura, capturas da página real em 390 × 844 px confirmaram abertura de 680 px, H1 de 39 px, subtítulos de 22 px e cartões da comissão com 613 px (385 px só de retrato). A escala mobile não compactava essas áreas suficientemente e a introdução somava margem inferior do título ao gap da grade.

Alteração restrita ao CSS responsivo até 48rem: H1 de 30–34 px, H2 de 22–26 px, H3 de 18 px e corpo/introduções de 16 px, entrelinha 1,5. Abertura mínima de 480 px, respiro de seção de 40 px, intervalos menores e botões com mínimo de 44 px. Comissão passa a usar retrato lateral em proporção original e biografia na largura do cartão. Desktop mantém os cartões verticais e sua tipografia.

Em 390 px após o ajuste: H1 de 31,2 px; cartão da comissão de 241 px; retrato de 127 px de altura. Conteúdo não foi removido e proporção 4:5 preservada.

Verificação executada: `npm run check` sem erros/avisos, `npm run test` com 5 testes aprovados e `npm run build` aprovado. Chrome headless nas larguras 320, 360, 390, 768, 1024 e 1440 px: escala de texto, proporção dos retratos, cartões compactos, botões visíveis com pelo menos 44 px de altura e ausência de overflow no documento nas seções Projeto, Comissão, Equipes e Contato. Capturas antes/depois da abertura, Projeto e Comissão revisadas em 390 px.

Evidências: `C:/Users/NIKOLAS/.codex/visualizations/2026/11/01/01a1998c-8af1-7703-a6bc-7ea6f811270c/`, arquivos `mobile-before-*`, `mobile-after-*`, `mobile_scale.py` e `verify_mobile_scale.py`. Validação em viewports emulados de Chrome; sem teste em aparelho físico nesta alteração.
