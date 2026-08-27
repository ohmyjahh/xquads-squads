# Task: Diagnose (Triagem Meta)

**Agente:** xquads-chief
**Comando:** `*diagnose`
**Output:** bloco de diagnóstico com squad recomendado (NÃO ativa)
**Duração:** < 1 minuto

---

## Objetivo

Transformar uma demanda em linguagem natural na identificação precisa de **qual squad resolve**. Esta task NÃO ativa ninguém — ela só diagnostica. Para diagnosticar E ativar, use `route.md`.

---

## Passo 1 — Extrair a demanda real

Leia o pedido do usuário e responda internamente:

| Pergunta | Por quê |
|---|---|
| O que precisa EXISTIR no final? | Artefato concreto revela o squad |
| Isso é um "como faço X" ou um "devo fazer X"? | "Devo" → advisory-board / c-level |
| Já existe algo ou é do zero? | Auditar vs criar muda a task, não o squad |
| Tem métrica quebrada envolvida? | Métrica → data-squad entra na cadeia |

**Anti-padrão:** não aceite o rótulo que o usuário deu. "Preciso de um copy pra minha landing" pode ser problema de oferta (hormozi), não de texto.

---

## Passo 2 — Classificar o domínio

Carregue `data/routing-catalog.yaml` e faça match de keywords contra a demanda.

- Match em PT-BR tem peso maior que EN (o usuário fala português).
- Conte quantos domínios deram match.
  - **1 domínio** → confiança alta de saída
  - **2+ domínios** → aplique `tie_breakers`
  - **0 domínios** → verifique `external_targets`, depois considere `/squad`

---

## Passo 3 — Calcular confiança

| Sinal | Ajuste |
|---|---|
| Match direto de keyword específica (ex: "VSL", "pixel", "arquétipo") | +40 |
| Artefato final nomeado explicitamente | +25 |
| Contexto de projeto conhecido na conversa | +15 |
| Verbo de ação claro (escrever, escalar, auditar, desenhar) | +10 |
| Demanda vaga ("melhorar", "dar uma olhada", "resolver") | −30 |
| Dois domínios com match equivalente | −25 |
| Só keywords genéricas ("vender", "crescer", "converter") | −20 |

Base: 40. Some os ajustes. Trave entre 0 e 100.

**Faixas:**
- **≥ 80 (ALTA)** → roteia direto
- **50-79 (MÉDIA)** → roteia declarando a premissa assumida
- **< 50 (BAIXA)** → UMA pergunta de desambiguação, tirada do `tie_breakers`

---

## Passo 4 — Detectar cadeia multi-squad

Compare a demanda com `multi_squad_chains`. É cadeia quando:

- O usuário pediu um **resultado de negócio** e não um deliverable (ex: "lançar meu curso")
- O artefato final depende de 2+ domínios em sequência
- Existe uma chain no catálogo com trigger_keywords batendo

⚠️ **Não invente cadeia.** Se o usuário pediu uma headline, ele quer uma headline — não um lançamento inteiro. Cadeia só quando o escopo pedido realmente exige.

Se o escopo é de campanha mas pequeno, prefira **marketing-squad** (já integrado) à cadeia completa — desde que esteja instalado; ele não acompanha este repositório.

---

## Passo 5 — Casos especiais (verificar ANTES de rotear)

| Situação | Destino | Regra |
|---|---|---|
| Envolve escrever/alterar **código** | `/raxos` ⚠️ | SDC obrigatório. Nunca implemente. Alvo externo: se `/raxos` não existir, diga que está fora do alcance. |
| Configurar Claude Code, hooks, MCP, skills | `claude-code-mastery` | Não confundir com desenvolvimento de produto |
| Não existe squad para o domínio | `/squad` | Ofereça criar o squad novo |
| Usuário já disse o squad | pular para `route.md` | Não re-diagnostique o que já foi decidido |

---

## Passo 6 — Emitir o diagnóstico

```
🎯 Diagnóstico
Demanda:    {1 frase — o que precisa existir no final}
Domínio:    {domínio do catálogo}
Squad:      {squad} → {chefe}
Confiança:  {n}% — {motivo em 1 linha}
Cadeia:     {nenhuma | squad1 → squad2 → squad3}
Comando:    {/squad:agents:chief}
```

Se confiança < 50, emita no lugar disso **uma** pergunta:

```
🎯 Preciso de um detalhe pra acertar o time:
{pergunta do tie_breaker}

(a) {opção A} → {squad A}
(b) {opção B} → {squad B}
```

---

## Checkpoint

| Gate | Veto |
|---|---|
| Squad identificado com confiança ≥ 50 **ou** pergunta única emitida | Emitiu 2+ perguntas |
| Domínio existe no catálogo | Inventou squad fora do catálogo |
| Nenhum trabalho de execução foi feito | Começou a produzir o deliverable |
