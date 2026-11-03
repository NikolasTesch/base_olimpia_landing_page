# SPEC-004 — História, comissão técnica e elenco

**Estado:** Estrutura implementada com conteúdo fictício autorizado  
**Fatia:** conteúdo editorial de trajetória e pessoas  
**Fontes:** `DESIGN.md`, `CONTENT.md`, contratos em `design-spec.json`

## Objetivo

Apresentar a trajetória do projeto, as pessoas que o conduzem e as equipes preservando origem, autorização e status editorial de cada informação.

## Escopo

- Linha do tempo vertical com marcos sem data obrigatória.
- A seção História não repete os perfis da comissão; o destaque visual das pessoas fica em “Quem faz acontecer”.
- Perfis de profissionais com nome, função, biografia curta e foto opcional.
- Equipes e atletas vinculados por IDs estáveis; posição e foto opcionais.
- Uma seção e um carrossel horizontal acessível por equipe, com controles de navegação e conteúdo completo sem JavaScript.
- Estados `draft`, `illustrative` e `confirmed` e aviso global ilustrativo enquanto houver conteúdo de demonstração.

## Regras de domínio e privacidade

- Não atribuir anos fictícios, conquistas ou depoimentos a pessoas reais.
- Treinador, coordenação e comissão técnica são funções; uma pessoa pode ter mais de uma.
- `teamId` de atleta deve corresponder a uma equipe existente.
- Não publicar telefone, escola, endereço, data completa de nascimento ou dados de responsáveis de atletas.
- Retratos do mockup não representam integrantes reais. Dados demonstrativos permanecem identificados como ilustrativos.

## Critérios de aceite

- Marcos sem data permanecem legíveis em ordem editorial, sem cronologia fabricada.
- Fotos ausentes não deixam espaços de mídia quebrados.
- Os perfis da comissão aparecem uma única vez, na seção “Quem faz acontecer”, com moldura/acento visual que não depende de movimento.
- Cada atleta aparece apenas na equipe referenciada pelo seu `teamId`; scroll-snap e botões não ocultam conteúdo.
- Equipe sem atletas ou perfil sem biografia usa estado vazio/omissão definida, sem texto falso.
- Relações atleta/equipe inválidas são detectadas antes do build ou por verificação automatizada.
- A página não expõe campos pessoais além do conjunto editorial autorizado.
- `npm run check` e `npm run build` passam.

## Fora de escopo e pendências

Coleta de dados reais, autorização de imagem, métricas de impacto e revisão legal/editorial precisam ser resolvidas antes da publicação oficial. Não implementar formulário para menores nesta fatia.
