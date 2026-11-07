# Specs do BASE Vôlei Club

Specs descrevem comportamento e critérios de aceite antes da implementação. As decisões de domínio e visuais vêm de `ARCHITECTURE.md`, `DESIGN.md`, `CONTENT.md`, `design-spec.json` e `content.sample.json`.

## Ordem inicial

| ID | Spec | Estado | Dependências |
| --- | --- | --- | --- |
| SPEC-001 | [Base editorial responsiva](001-base-editorial-responsiva.md) | Estrutura implementada; homologação pendente | Scaffold Astro existente |
| SPEC-002 | [Hero e mídia](002-hero-e-midia.md) | Estrutura full-bleed implementada; mídia oficial e homologação pendentes | SPEC-001; poster oficial é opcional para o estado sem mídia |
| SPEC-003 | [Resultados e agenda](003-resultados-e-agenda.md) | Estrutura implementada; homologação pendente | SPEC-001; usar dados locais ilustrativos/vazios |
| SPEC-004 | [História e pessoas](004-historia-e-pessoas.md) | Destaque visual na comissão e carrosséis por equipe implementados com fictícios autorizados | SPEC-001; dados reais e autorização permanecem pendentes |
| SPEC-005 | [Movimento esportivo](005-movimento-esportivo.md) | Implementado e validado em navegador local | SPEC-001 e SPEC-002; direção esportiva escolhida pelo usuário |
| SPEC-006 | [Fundos em movimento](006-fundos-em-movimento.md) | Implementado e validado em viewport mobile com toque | SPEC-005; fundo contínuo solicitado pelo usuário |
| SPEC-007 | [Background tático e stack completa de animação](007-background-tatico-e-stack-animacao.md) | Implementada e validada (`check`, `test`, `build`) | SPEC-005 e SPEC-006; adota GSAP/ScrollTrigger, Lenis e React/Motion com quadra tática em camadas |
| SPEC-008 | [Apresentação de atletas: Coverflow 3D em Loop e Pop-Out](008-apresentacao-atletas-coverflow-popout.md) | Implementada e validada (`check`, `test`, `build`) | SPEC-004 e SPEC-007; atletas recortados sem fundo em escudo esportivo e carrossel Coverflow em loop |
| SPEC-009 | [Giro 3.3s e Painel do Dono (`/dono`)](009-painel-dono-equipes-atletas.md) | Implementada e validada (`check`, `test`, `build`) | SPEC-008; giro automático de 3.3s sem botão de giro e painel `/dono` com persistência híbrida |
| SPEC-010 | [Patrocinadores e Apoiadores](010-patrocinadores-e-apoiadores.md) | Implementada e validada (`check`, `test`, `build`) | SPEC-001 e SPEC-007; marcas reais em cards dedicados com convite de apoio |

Cada spec pode avançar para implementação depois de revisada. Nenhuma delas autoriza publicar dados reais, coletar inscrições, integrar serviços ou fazer deploy.

Plano conjunto das quatro primeiras fatias: [Plano de Implementação — Primeiras Quatro Specs](../superpowers/plans/2026-11-01-primeiras-quatro-specs.md). O mockup de espaços para imagens fica em [assets/media-slots-mockup.svg](assets/media-slots-mockup.svg).
