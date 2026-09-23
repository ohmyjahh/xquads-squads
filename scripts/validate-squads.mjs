#!/usr/bin/env node
// Valida a consistencia estrutural da biblioteca de squads:
//   1. cada squad.yaml existe, parseia e referencia arquivos que existem de fato
//   2. a xquads/data/routing-catalog.yaml so aponta para squads que existem
//   3. a contagem de agentes no routing-catalog bate com o squad.yaml
//
// Nao valida conteudo/qualidade dos agentes (isso e' trabalho de squad ou revisao humana),
// so a integridade estrutural que quebraria o roteamento em runtime.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const COMPONENT_DIRS = { agents: "agents", tasks: "tasks", workflows: "workflows", checklists: "checklists" };

const errors = [];
const warnings = [];

function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

// Squad = qualquer pasta de topo (fora .git/.claude/.next/node_modules/scripts) que tenha squad.yaml
const squadDirs = readdirSync(ROOT).filter((name) => {
  if (name.startsWith(".") || name === "node_modules" || name === "scripts") return false;
  return existsSync(join(ROOT, name, "squad.yaml"));
});

const squadsByName = new Map(); // slashPrefix -> { dir, doc }

for (const dir of squadDirs) {
  const yamlPath = join(ROOT, dir, "squad.yaml");
  let doc;
  try {
    doc = yaml.load(readFileSync(yamlPath, "utf8"));
  } catch (e) {
    errors.push(`${dir}/squad.yaml: YAML invalido — ${e.message}`);
    continue;
  }

  if (!doc || typeof doc !== "object") {
    errors.push(`${dir}/squad.yaml: documento vazio ou invalido`);
    continue;
  }
  for (const field of ["name", "slashPrefix", "components"]) {
    if (!(field in doc)) errors.push(`${dir}/squad.yaml: campo obrigatorio ausente: ${field}`);
  }

  squadsByName.set(doc.slashPrefix ?? dir, { dir, doc });

  const components = doc.components ?? {};
  for (const [key, subdir] of Object.entries(COMPONENT_DIRS)) {
    const listed = components[key] ?? [];
    const dirPath = join(ROOT, dir, subdir);
    const onDisk = isDir(dirPath)
      ? new Set(readdirSync(dirPath).filter((f) => f.endsWith(".md") || f.endsWith(".yaml") || f.endsWith(".yml")))
      : new Set();

    for (const file of listed) {
      if (!onDisk.has(file)) {
        errors.push(`${dir}/squad.yaml: components.${key} referencia "${file}" mas o arquivo nao existe em ${dir}/${subdir}/`);
      }
    }

    const listedSet = new Set(listed);
    for (const file of onDisk) {
      if (!listedSet.has(file)) {
        warnings.push(`${dir}/${subdir}/${file}: existe no disco mas nao esta listado em squad.yaml (orfao)`);
      }
    }
  }
}

// Routing catalog do Xquads Chief
const routingPath = join(ROOT, "xquads", "data", "routing-catalog.yaml");
if (existsSync(routingPath)) {
  let routing;
  try {
    routing = yaml.load(readFileSync(routingPath, "utf8"));
  } catch (e) {
    errors.push(`xquads/data/routing-catalog.yaml: YAML invalido — ${e.message}`);
    routing = null;
  }

  if (routing?.domains) {
    for (const [domainKey, entry] of Object.entries(routing.domains)) {
      if (!entry?.squad) continue;
      const squad = squadsByName.get(entry.squad);
      if (!squad) {
        errors.push(`routing-catalog.yaml: dominio "${domainKey}" aponta para squad "${entry.squad}" que nao existe no repo`);
        continue;
      }
      const actualAgentCount = (squad.doc.components?.agents ?? []).length;
      if (typeof entry.agents === "number" && entry.agents !== actualAgentCount) {
        warnings.push(
          `routing-catalog.yaml: dominio "${domainKey}" diz agents: ${entry.agents}, mas ${entry.squad}/squad.yaml tem ${actualAgentCount}`
        );
      }
    }
  }
}

// Relatorio
for (const w of warnings) console.warn(`WARN  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);

console.log(`\n${squadDirs.length} squads verificados — ${errors.length} erro(s), ${warnings.length} aviso(s)`);

if (errors.length > 0) process.exit(1);
