# Xquads Squads — instruções para o Claude Code

Repositório de conteúdo: cada pasta de nível raiz é um **squad** de agentes IA para o Synkra AIOS / Claude Code. Não é uma aplicação Node/Next.js — não existe build nem testes automatizados aqui.

## Regra crítica: nome da pasta = slash command

O nome de cada pasta de squad vira literalmente o slash command (`copy-squad/` → `/copy-squad`, `xquads/` → `/xquads`). **Nunca renomear uma pasta de squad existente** sem atualizar todas as referências (README, `routing-catalog.yaml` do squad `xquads`, links cruzados entre squads).

## Estrutura obrigatória de um squad

```
squad-name/
├── squad.yaml          # Manifesto: agentes, tasks, workflows, tags, routes_to
├── README.md
├── agents/              # Personas (persona, role, focus, greeting)
├── tasks/               # Tasks executáveis com inputs/outputs
├── workflows/           # Workflows multi-agente
├── checklists/          # Checklists de qualidade (geralmente output-quality.md)
├── config/              # Configurações do squad
└── data/                # Frameworks e catálogos de referência
```

Ao criar um squad novo, seguir essa estrutura e, se ele deve ser roteável pelo chefe geral, adicionar uma entrada em `xquads/data/routing-catalog.yaml` e em `xquads/squad.yaml` (`routes_to.internal`).

## Convenções de conteúdo

- Agentes de squad (`*/agents/*.md`) são personas do AIOS, não subagentes do Claude Code — não confundir com `.claude/agents/` (que não existe neste projeto e é para subagentes de projeto, se algum dia forem necessários).
- `squad.yaml` é o manifesto que lista todos os componentes do squad — qualquer arquivo novo em `tasks/`, `workflows/`, `checklists/` ou `data/` deve ser registrado ali em `components:`.
- O README.md raiz é a porta de entrada para humanos (GitHub, instalação); mudanças na tabela de squads ali devem refletir a realidade do que existe nas pastas.

## O que não fazer

- Não commitar artefatos de build (`.next/`, `node_modules/`) — cobertos pelo `.gitignore`.
- Não usar `git push --force`, `git reset --hard` ou remover squads sem confirmação explícita do usuário.
