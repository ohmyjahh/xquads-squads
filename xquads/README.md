# Xquads Chief — O Chefe Geral

> Porta de entrada única do Xquads. Você descreve o problema; ele identifica a atividade, escolhe o squad e **ativa o chefe do squad**.

```
/xquads
```

O Xquads Chief (**Xander**, 🎯) é um meta-orquestrador — fica um nível acima dos chefes de squad. Ele não escreve copy, não desenha, não analisa e não programa. Ele faz três coisas: **diagnostica → briefa → ativa**.

---

## Como funciona

```
Você descreve o problema
        │
        ▼
  [1] DIAGNOSE ......... extrai a demanda real, classifica o domínio, calcula confiança
        │
        ├── confiança < 50% ──► UMA pergunta ──┐
        │                                       │
        ▼◄──────────────────────────────────────┘
  [2] DECIDE ........... squad único ou cadeia multi-squad
        │
        ▼
  [3] BRIEFING ......... handoff estruturado (máx. 500 tokens)
        │
        ▼
  [4] ATIVA ............ /{squad}:agents:{chefe} assume a conversa
        │
        ▼
  [5] SAI DE CENA ...... o chefe do squad conduz daqui em diante
```

---

## Mapa de Roteamento

| Domínio da demanda | Squad | Chefe ativado | Agentes |
|---|---|---|---|
| Texto que vende, headline, VSL, email | copy-squad | copy-chief | 23 |
| Copy avançado: pitch, negociação, SaaS | copy-master | copy-master-chief | 33 |
| Tráfego pago, escala, tracking | traffic-masters | traffic-chief | 16 |
| Marca, posicionamento, naming, identidade | brand-squad | brand-chief | 15 |
| Campanha integrada ponta a ponta ⚠️ | marketing-squad | marketing-chief | 5 |
| Oferta, preço, leads, vendas, escala | hormozi-squad | hormozi-chief | 16 |
| Narrativa, pitch, apresentação, manifesto | storytelling | story-chief | 12 |
| UX, UI, design system | design-squad | design-chief | 8 |
| Analytics, growth, retenção, comunidade | data-squad | data-chief | 7 |
| Pentest, AppSec, incidente, auditoria | cybersecurity | cyber-chief | 15 |
| Visão, GTM, operações, captação | c-level-squad | vision-chief | 6 |
| Conselho estratégico ("devo fazer X?") | advisory-board | board-chair | 11 |
| Movimento, tribo, causa | movement | movement-chief | 7 |
| Claude Code, hooks, MCP, agentes | claude-code-mastery | claude-mastery-chief | 8 |
| **Código / desenvolvimento** | *(externo)* | `/raxos` — SDC obrigatório | — |
| **Não existe squad pro domínio** | *(externo)* | `/squad` — cria um novo | — |

> ⚠️ **Não acompanham este repositório.** `marketing-squad`, `/raxos` e `/squad` são componentes separados — este repo distribui 13 squads (177 agentes). Sem eles instalados, o chefe avisa que a rota está indisponível e oferece a alternativa mais próxima.

---

## Comandos

| Comando | O que faz |
|---|---|
| `*route` | **Padrão.** Diagnostica e ativa o chefe do squad |
| `*diagnose` | Só diagnostica — mostra o squad recomendado sem ativar |
| `*route-to {squad}` | Pula o diagnóstico e ativa o squad informado |
| `*chain` | Monta e executa uma cadeia multi-squad |
| `*squads` | Lista os squads instalados (13 acompanham este repo) |
| `*review` | Valida a entrega devolvida pelo squad |
| `*help` | Mostra os squads e o que cada um resolve |

---

## Cadeias Multi-Squad

Quando a demanda atravessa domínios, o chefe monta uma cadeia e ativa **um elo por vez** — o output de cada squad vira contexto do próximo.

| Cadeia | Sequência |
|---|---|
| Lançamento completo | brand → hormozi → copy → traffic → data |
| Marca nova | brand → storytelling → design |
| Produto novo | hormozi → copy → traffic |
| Produto digital do zero | c-level → design → raxos |
| Turnaround de métrica | data → traffic → copy |

> Escopo pequeno de campanha? Ele prefere o **marketing-squad** (já integrado) à cadeia inteira — se estiver instalado (⚠️ não acompanha este repo).

---

## Desambiguação

O chefe não aceita o rótulo que você deu — ele checa o problema real. Alguns casos que ele resolve sozinho:

| Você diz | Ele checa | Resultado |
|---|---|---|
| "Minha landing não converte" | texto, visual ou tráfego? | copy · design · traffic |
| "Quero vender mais" | falta oferta, tráfego ou conversão? | hormozi · traffic · copy |
| "Preciso de um nome" | marca ou headline? | brand · copy |
| "Devo fazer X ou Y?" | pessoal ou operacional? | advisory-board · c-level |
| "Meu site tem problema" | bug, UX ou invasão? | raxos · design · cybersecurity |

Se a confiança ficar abaixo de 50%, ele faz **uma** pergunta — nunca duas.

---

## Limites (por design)

- ❌ Nunca executa o trabalho — nem "só um rascunho"
- ❌ Nunca escreve código (código vai pro `/raxos`, com SDC obrigatório)
- ❌ Nunca escolhe o especialista final — isso é decisão do chefe do squad
- ❌ Nunca ativa dois chefes em paralelo
- ❌ Nunca inventa squad fora do catálogo
- ✅ Sempre declara confiança e motivo antes de ativar
- ✅ Sempre responde em português

---

## Instalação

```bash
git clone https://github.com/ohmyjahh/xquads-squads.git
cp -r xquads-squads/xquads ~/.claude/commands/xquads
cp xquads-squads/xquads/command-entry.md ~/.claude/commands/xquads.md
```

> ⚠️ **O nome da pasta define o slash command.** Mantenha `xquads` — renomear para `xquads-chief` faz o comando virar `/xquads-chief` e quebra as instruções desta doc.

Depois é só rodar `/xquads`. O chefe geral só consegue ativar os squads que você tiver instalado em `~/.claude/commands/` — instale os outros squads antes para o roteamento funcionar por completo.

## Componentes

- **1 agente** — xquads-chief (Tier -1, meta-orquestrador)
- **3 tasks** — diagnose, route, review
- **1 workflow** — wf-route-to-squad (6 fases com gates e vetos)
- **1 checklist** — output-quality (gate de roteamento, não de deliverable)
- **1 data file** — routing-catalog (13 squads no repo + 1 opcional, 2 alvos externos, 8 tie-breakers, 5 cadeias)

## Requisitos

- AIOS >= 4.0.0
- Squads Xquads instalados em `~/.claude/commands/`
