# Design — BASE Vôlei Club

## Intenção e estado das decisões

Direção acordada: site institucional de projeto social de vôlei, com competição como parte da formação. Prioridade de acesso mobile. A página deve explicar o projeto, sua história, funcionamento e impacto; apresentar comissão técnica, equipes e atletas; permitir acompanhar jogos, peneiras e informativos; oferecer contato para interessados em apoiar.

As cores navy, vermelho, branco e cinza vêm do briefing e do escudo. Os valores hexadecimais e medidas abaixo são propostas de implementação, não medições exatas do escudo ou CSS extraído da imagem.

Referência de linguagem: [Lando Norris](https://landonorris.com/), por protagonismo das imagens e narrativa esportiva. Não reproduzir identidade, textos, efeitos específicos ou assets desse site.

## Abordagens consideradas

1. Campanha cinematográfica: abertura expressiva, pouca informação imediatamente visível. Serve de referência para a hero, mas precisa de conteúdo institucional mais acessível.
2. Portal esportivo: placares e agenda como protagonistas. Útil para consultas, mas deixa o propósito social em segundo plano.
3. Editorial humano com energia esportiva: narrativa social, fotos de convivência, trajetória e informação prática. Direção selecionada na conversa, combinando elementos das opções visuais 2 e 3.

A última revisão reduz títulos, aumenta respiro e acrescenta staff e Instagram. Não expandir automaticamente a tipografia para preencher espaço.

## Hierarquia e ordem da página

| ID | Seção e função | Componentes e comportamento |
| --- | --- | --- |
| inicio | Abertura: propósito e vínculo emocional | Header simples, escudo, menu; vídeo/poster com texto legível e botão para assistir à história. |
| projeto | O que é e como funciona | Introdução e três princípios: treinar, conviver e competir. Explicar o contraturno escolar com linguagem acessível. |
| historia | Trajetória e impacto social | Linha do tempo vertical; fotos e relatos. Anos, quantidades e resultados somente quando confirmados. |
| comissao | Quem conduz o projeto | Treinador em destaque, coordenação e demais profissionais com função e breve apresentação. |
| competicoes | Caminhada esportiva | Participação em eventos, conquistas e premiações; cartões ou registros editoriais simples. |
| resultados | Últimas partidas | Até três jogos com equipes, categoria, competição, data, placar em sets e parciais disponíveis. |
| equipes | Equipes e atletas | Identificação das equipes; retratos e posição dos atletas, sem dados pessoais desnecessários. |
| participar | Como fazer parte | Orientações para interessados e responsáveis; peneiras e próximos jogos em agenda cronológica. |
| instagram | Acompanhe o BASE | Prévias selecionadas de avisos, bastidores e treinos, com acesso às publicações e ao perfil oficial. |
| apoiadores | Quem joga junto | Marcas confirmadas e convite secundário para conversar sobre apoio. |
| contato | Fechamento e canais | Contato oficial, Instagram e navegação de apoio. |

Resultados continuam após a trajetória, dentro do bloco de caminhada esportiva. A agenda não desaparece por ter sido compactada no mockup: deve mostrar as informações completas quando houver eventos reais.

## Tokens propostos

| Papel | Valor |
| --- | --- |
| Navy / fundo escuro / texto principal | `#082541` |
| Vermelho / acento / ação principal | `#D91627` |
| Superfície | `#FFFFFF` |
| Superfície suave | `#F3F5F7` |
| Texto secundário | `#475569` |
| Divisores | `#D9E0E7` |

Fonte inicial proposta: Inter, com pesos 400, 500, 600 e 700; preferir arquivos WOFF2 locais licenciados, com fallback de sistema. Validar o vermelho em texto pequeno antes de adotá-lo para esse uso.

| Elemento | Mobile | Desktop |
| --- | --- | --- |
| H1 | 30–34 px, entrelinha 1,1 | 48–56 px |
| H2 | 22–26 px, entrelinha 1,2 | 30–36 px |
| H3 | 18 px | 22 px |
| Corpo | 16 px, entrelinha 1,5 | 16–18 px |
| Metadados | mínimo 14 px | mínimo 14 px |

Espaçamento: escala 4, 8, 12, 16, 24, 32, 40, 48, 64 e 80 px. Laterais: 20 px em telas muito estreitas; 24 px no mobile usual. Revisão mobile solicitada em 01/11/2026: seções com 40 px verticais, abertura com altura mínima de 480 px, sem soma de margem do título e gap na introdução. Comissão: retrato lateral de 88–128 px em proporção 4:5, nome/função ao lado e biografia abaixo, na largura do cartão. Desktop mantém 72–96 px de respiro e cartões verticais. Texto com largura confortável, aproximadamente 60–65 caracteres por linha. Container desktop máximo proposto de 1200 px.

## Responsividade

Projetar primeiro em 390 px e validar também 320, 360, 768, 1024 e 1440 px. Breakpoints iniciais: 48rem e 64rem, ajustáveis conforme o conteúdo.

- Mobile: uma coluna para textos, história, staff e informações práticas. Fotos e descrições empilhadas; títulos nunca cobrem rostos.
- Desktop: duas colunas apenas quando há espaço para leitura; não transformar cada seção em uma grade.
- Atletas e prévias de Instagram podem usar faixa horizontal nativa com parte do próximo item visível. Oferecer botões e navegação por teclado; swipe não pode ser o único meio de acesso.
- A agenda usa lista cronológica com data, tipo, local e situação. Evitar grade mensal apertada.
- Fotos mantêm proporção e ponto focal definidos. Nunca esticar retratos para caber.

## Hero e movimento

A [revisão fotográfica de 03/11/2026](docs/specs/002-hero-e-midia.md#revisão-fotográfica-de-03112026) substitui os efeitos da abertura. Nas demais seções, quadra, trajetórias, luzes e faixas decorativas seguem em movimento quando visíveis e respeitam a preferência por movimento reduzido.

**Evolução tática e stack completa (03/11/2026):** [SPEC-007](docs/specs/007-background-tatico-e-stack-animacao.md) adota GSAP/ScrollTrigger, Lenis e React/Motion, introduzindo o background **Quadra tática + energia esportiva em camadas** (diagrama isométrico de quadra de vôlei em SVG, linhas de 3m, trajetórias de saque/ataque, faixas diagonais com parallax no scroll), linha do tempo desenhada no scroll (`#historia`) e ilha interativa de equipes com filtro animado e zonas de quadra (`#equipes`).

**Fundo ambiente solicitado em 01/11/2026:** [SPEC-006](docs/specs/006-fundos-em-movimento.md) acrescenta linhas de quadra, círculos e luz difusa em ciclos lentos de 14–18 segundos por trás do conteúdo de cada seção. Funciona sem hover no mobile. Conteúdo permanece imóvel. Controle global “Pausar fundo”/“Retomar fundo”, redução de movimento, pausa fora da tela e suspensão na aba oculta fazem parte da implementação. As camadas claras têm contraste baixo para preservar a leitura; não usar flashes nem animação da rolagem.

**Revisão aprovada em 01/11/2026:** após comparar duas simulações, o usuário escolheu a direção esportiva e expressiva. A [SPEC-005](docs/specs/005-movimento-esportivo.md) atualiza os tempos abaixo para esta fatia: título revelado em duas linhas, faixa diagonal vermelha com entrada única, revelação lateral de títulos e pequenos grupos com intervalo de 75 ms. Hero até 900 ms; seções até 650 ms. No mobile, reduzir o deslocamento lateral a 14 px. Manter scroll nativo, leitura sem JS e redução de movimento; a rolagem automática da simulação servia apenas à comparação e não faz parte do site.

Vídeo proposto: montagem curta de treino, orientação do treinador e convivência; sem áudio automático. O poster deve funcionar como abertura independente. O vídeo institucional completo é acionado pelo usuário, com controles e legendas quando houver fala.

1. Renderizar título, descrição, ação e poster imediatamente.
2. Se o dispositivo e as preferências permitirem, carregar o loop decorativo depois do conteúdo principal. Autoplay é tentativa, nunca garantia.
3. Manter controle visível para pausar o fundo em movimento.
4. Usar entrada do título com opacidade e deslocamento de até 16 px, cerca de 500–700 ms. Seções: 300–450 ms; pequenos grupos com intervalo de até 80 ms.
5. Não prender o scroll no mobile. Sem interação 3D obrigatória, splash de carregamento ou efeito que impeça ler o conteúdo.
6. Com redução de movimento, manter poster estático e retirar parallax, loops e revelações com deslocamento.

O vídeo/poster deve ser produzido para enquadramento mobile. Prever versão horizontal separada se necessário. O conteúdo continua acessível com JavaScript desativado ou falha no player.

## Contratos visuais

**Staff:** foto, nome, função, biografia curta e ordem editorial. Não inventar formação ou credenciais. No protótipo, mostrar “Nome do treinador” e “Nome do profissional”.

**História:** marcos com título, texto, data opcional e foto opcional. Não atribuir anos fictícios a fatos do BASE. Impacto se comunica por relato qualitativo provisório até existir evidência real.

**Partidas:** placar em sets, por exemplo 3 × 1, somente quando houver resultado confirmado; parciais opcionais. Eventos sem resultado não podem receber placar fictício.

**Agenda:** estados previsto, confirmado, adiado e cancelado; peneira com inscrições abertas, encerradas ou a confirmar. Data, categoria e local ausentes recebem orientação clara, sem chamada de inscrição funcional falsa.

**Instagram:** prévias editoriais com imagem própria/autorizada, título, resumo e URL. Não simular curtidas, comentários ou atualização automática. Sem perfil confirmado, mostrar estado provisório sem link inventado.

**Apoiadores:** usar “Espaço para marcas parceiras” no protótipo. Contato secundário: “Sua empresa pode fazer parte dessa história” e “Converse com o BASE”.

## Estados e acessibilidade

Um H1, seções com H2, landmarks e link para pular navegação. Foco visível, contraste verificado, controles com área proposta de 44 × 44 px, texto alternativo contextual. Não comunicar vitória, cancelamento ou seleção apenas por cor.

Menu e eventual diálogo de vídeo precisam de nome acessível, fechamento por Escape, foco bem gerenciado e retorno ao acionador. Eventos sem calendário exibem “A programação será divulgada em breve”. Falha do vídeo mantém poster e texto. Lista de atletas sem dados reais não deve sugerir que os retratos representam participantes reais.

## Limites da imagem de referência

`assets/mockup-latest.png` é imagem gerada, preservada sem edição. A composição contém colunas de desktop e corte ao final da seção Instagram; não é prova de responsividade nem de interações. A implementação deve seguir este documento para mobile, agenda, apoiadores e rodapé. O JSON descreve a intenção revisada, não coordenadas ou DOM recuperados da imagem.
