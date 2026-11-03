# Design: destaques da landing page

## Intenção

Evoluir a landing page do BASE para dar mais presença à mídia da hero, às pessoas do projeto, às equipes e aos canais de contato, preservando o caráter demonstrativo até que os dados e materiais oficiais sejam fornecidos.

## Objetivos

- Apresentar a hero como uma faixa visual de largura total, com imagem de capa e vídeo opcional iniciado por ação explícita.
- Dar destaque visual à seção “Quem faz acontecer”, mantendo as pessoas apresentadas somente nela.
- Separar atletas por equipe e apresentá-los em carrosséis horizontais com encaixe nativo e navegação acessível.
- Transformar a seção Dia a dia em espaços para publicações do Instagram.
- Preparar no rodapé campos de telefone, localização, Instagram, e-mail e WhatsApp.

## Limites

- Não inventar dados de contato funcionais, locais, nomes, fotos ou publicações oficiais.
- Campos sem valor exibem estado “a informar” ou placeholder demonstrativo, sem link acionável.
- Manter os dados locais e a geração estática existentes; não adicionar dependência nem integração externa.
- Respeitar movimento reduzido e manter conteúdo compreensível sem JavaScript.

## Abordagens consideradas

- **Hero:** vídeo ambiente em loop ou imagem com vídeo sob ação do visitante. Escolhida a segunda: não há vídeo oficial disponível, então a imagem de capa mantém a experiência completa e o vídeo poderá ser acionado quando configurado.
- **Carrossel:** controles customizados com JavaScript ou rolagem nativa com scroll-snap. Escolhida a rolagem nativa, por ser simples, acessível e não exigir dependência.
- **Contatos:** valores demonstrativos com links ou campos configuráveis com estados vazios. Escolhidos campos configuráveis, evitando que valores fictícios pareçam canais oficiais.

## Direção visual e comportamento

- A hero ocupará a largura da página; texto, ação principal e mídia permanecem legíveis sobre a composição. O vídeo, quando configurado, terá controles e não tocará automaticamente.
- A seção História mantém a linha do tempo sem repetir perfis da comissão.
- A seção “Quem faz acontecer” recebe o tratamento visual de destaque: fundo suave, acento lateral no título e cartões com elevação discreta no hover, desativada sob movimento reduzido.
- Cada equipe terá seu próprio título e trilho horizontal de atletas; cartões mantêm proporção de imagem e nome/posição.
- A seção Dia a dia mostrará espaços de publicação com imagem, legenda e destino configuráveis, sem embeds externos nesta etapa.
- O rodapé organizará os cinco canais em campos separados, exibindo estado indisponível até que exista dado válido.

## Decisões deixadas à implementação

Manter os componentes Astro e o CSS existentes, estender os dados locais/tipos apenas onde necessário e atualizar as specs afetadas após a implementação. A aparência final poderá ser ajustada na homologação visual com os conteúdos oficiais.
