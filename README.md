# Xquads Squads

**As maiores mentes trabalhando para você.**

13 squads de agentes IA especializados — 177 agentes — com workflows, tasks e configurações prontos para uso no Synkra AIOS.

## Comece por aqui: o Chefe Geral

```
/xquads
```

Não precisa saber qual squad chamar. O **Xquads Chief** (Xander 🎯) é a porta de entrada única: você descreve o problema em linguagem natural, ele identifica a atividade, escolhe o squad e **ativa o chefe dele** com um briefing pronto.

```
Você descreve o problema
        │
        ▼
  DIAGNOSTICA ....... classifica o domínio e calcula a confiança
        │
        ├── confiança < 50% ──► UMA pergunta de desambiguação
        │
        ▼
  BRIEFA ............ handoff estruturado (máx. 500 tokens)
        │
        ▼
  ATIVA ............. o chefe do squad assume a conversa
```

Ele nunca executa o trabalho — só identifica e delega. Quando a demanda atravessa domínios, monta uma cadeia multi-squad e ativa um elo por vez.

Detalhes em [`xquads/README.md`](xquads/README.md).

## Squads Disponíveis

| Squad | Agentes | Foco |
|-------|---------|------|
| Advisory Board | 11 | Conselheiros estratégicos (Ray Dalio, Charlie Munger, Naval Ravikant...) |
| Brand Squad | 15 | Branding e posicionamento (David Aaker, Marty Neumeier, Al Ries...) |
| C-Level Squad | 6 | Liderança executiva (CEO, CTO, CMO, COO, CIO, CAIO) |
| Claude Code Mastery | 8 | Domínio do Claude Code e AIOS |
| Copy Master | 33 | Copywriting 2.0 — persuasão, pitch, negociação, SaaS |
| Copy Squad | 23 | Copywriting (Gary Halbert, Eugene Schwartz, David Ogilvy...) |
| Cybersecurity | 15 | Segurança ofensiva e defensiva |
| Data Squad | 7 | Analytics, growth e comunidade (Sean Ellis, Avinash Kaushik...) |
| Design Squad | 8 | UX/UI e design systems (Brad Frost, Dan Mall...) |
| Hormozi Squad | 16 | Negócios e escala (framework Alex Hormozi) |
| Movement | 7 | Construção de movimentos e comunidades |
| Storytelling | 12 | Narrativa e storytelling (Joseph Campbell, Oren Klaff...) |
| Traffic Masters | 16 | Tráfego pago e mídia (Pedro Sobral, Kasim Aslam...) |

## Como Instalar

### Opção 1: Clonar este repositório

```bash
git clone https://github.com/ohmyjahh/xquads-squads.git
```

Copie os squads para o seu diretório de comandos do Claude Code:

```bash
cp -r xquads-squads/* ~/.claude/commands/
cp ~/.claude/commands/xquads/command-entry.md ~/.claude/commands/xquads.md
```

> ⚠️ **O nome da pasta define o slash command.** `copy-squad/` vira `/copy-squad`, `xquads/` vira `/xquads`. Não renomeie as pastas.

A segunda linha é o que registra o `/xquads` — sem ela o chefe geral não existe como comando.

Para uso dentro de um projeto aios-core:

```bash
cp -r xquads-squads/* seu-projeto/squads/
```

### Opção 2: Baixar o ZIP

Acesse [xquads.vercel.app/xquads/downloads](https://xquads.vercel.app/xquads/downloads) e baixe o pacote completo.

### Opção 3: Instalar via AIOS Core

```bash
git clone https://github.com/SynkraAI/aios-core.git
cd aios-core
npm install
npx aios-core install
```

## Estrutura de Cada Squad

```
squad-name/
├── squad.yaml          # Manifesto do squad (agentes, tasks, workflows)
├── agents/             # Definições de agentes (persona, role, focus, greeting)
├── tasks/              # Tasks executáveis com inputs/outputs
├── workflows/          # Workflows multi-agente automatizados
├── checklists/         # Checklists de qualidade
├── config/             # Configurações do squad
└── data/               # Frameworks e catálogos de referência
```

## Pré-requisitos

- [Synkra AIOS Core](https://github.com/SynkraAI/aios-core)
- Node.js 18+
- Claude Code (Anthropic CLI)

## Dashboard

Veja todos os agentes, bios e especialidades em: [xquads.vercel.app/xquads](https://xquads.vercel.app/xquads)

---

**Xquads by Synkra**

_Atualizado em 2026-04-03_
