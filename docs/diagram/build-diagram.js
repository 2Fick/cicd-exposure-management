const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "logos");
const uri = (file) => {
  const b = fs.readFileSync(path.join(dir, file));
  const mime = file.endsWith(".svg") ? "image/svg+xml" : "image/png";
  return `data:${mime};base64,${b.toString("base64")}`;
};

const L = {
  terraform: uri("terraform.svg"),
  kubernetes: uri("kubernetes.svg"),
  helm: uri("helm.svg"),
  docker: uri("docker.svg"),
  postgres: uri("postgresql.svg"),
  grafana: uri("grafana.svg"),
  actions: uri("githubactions.svg"),
  trivy: uri("trivy.svg"),
  gitleaks: uri("gitleaks.png"),
  opa: uri("opa.png"),
  checkov: uri("checkov.png"),
};

const scanner = (logo, name, role) => `
  <div class="tool">
    <div class="chip"><img src="${L[logo]}" alt="${name}"></div>
    <div class="tool-name">${name}</div>
    <div class="tool-role">${role}</div>
  </div>`;

const node = (logo, title, sub, extra = "") => `
  <div class="node" ${extra}>
    <img src="${L[logo]}" alt="${title}">
    <div><div class="node-title">${title}</div><div class="node-sub">${sub}</div></div>
  </div>`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1500px;
    font-family: "Segoe UI", system-ui, sans-serif;
    background: #fbfbfd;
    color: #16181d;
    padding: 40px 48px 34px;
  }
  h1 { font-size: 29px; font-weight: 650; letter-spacing: -0.4px; }
  .sub { font-size: 14.5px; color: #6b7280; margin-top: 6px; margin-bottom: 26px; }

  .stage { border: 1.5px solid #d7dae0; border-radius: 14px; background: #fff; padding: 22px 22px 20px; position: relative; }
  .stage-label {
    position: absolute; top: -12px; left: 20px; background: #fff;
    padding: 0 10px; font-size: 12.5px; font-weight: 650;
    letter-spacing: 0.9px; text-transform: uppercase; color: #5b6270;
    display: flex; align-items: center; gap: 7px;
  }
  .stage-label img { height: 15px; width: 15px; }
  .stage-note { font-size: 12.5px; color: #6b7280; margin-top: 15px; }

  .band { display: flex; align-items: center; gap: 16px; }
  .band .node { flex: none; }

  .flow { display: flex; align-items: center; justify-content: center; gap: 11px; padding: 13px 0; }
  .flow-arrow { font-size: 21px; color: #b0b6c0; line-height: 1; }
  .flow-label { font-size: 12.5px; color: #6b7280; font-weight: 550; }

  .tools { display: flex; gap: 15px; }
  .tool {
    flex: 1; border: 1.5px solid #e3e6ec; border-radius: 11px;
    padding: 15px 12px 14px; text-align: center; background: #fdfdfe;
  }
  .chip {
    height: 46px; display: flex; align-items: center; justify-content: center;
  }
  .chip img { max-height: 44px; max-width: 118px; object-fit: contain; }
  .tool-name { font-size: 14.5px; font-weight: 620; margin-top: 7px; }
  .tool-role { font-size: 12px; color: #6b7280; margin-top: 4px; line-height: 1.35; }

  .node {
    border: 1.5px solid #e3e6ec; border-radius: 11px; background: #fdfdfe;
    padding: 14px 17px; display: flex; align-items: center; gap: 13px;
  }
  .node img { height: 33px; width: 33px; object-fit: contain; flex: none; }
  .node-title { font-size: 14.5px; font-weight: 620; }
  .node-sub { font-size: 12px; color: #6b7280; margin-top: 3px; line-height: 1.35; }

  .verdicts { display: flex; gap: 14px; margin-top: 16px; }
  .verdict { flex: 1; border-radius: 10px; padding: 11px 15px; font-size: 13.5px; font-weight: 600; }
  .blocked { background: #fdeced; color: #a3242e; border: 1.5px solid #f3c3c7; }
  .passed  { background: #eaf7ee; color: #1c6b33; border: 1.5px solid #bfe3c9; }

  .row { display: flex; align-items: center; gap: 16px; }
  .arrow { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: none; }
  .arrow-line { font-size: 23px; color: #b0b6c0; line-height: 1; }
  .arrow-label { font-size: 11.5px; color: #6b7280; white-space: nowrap; }
  .gap { height: 16px; }
</style></head><body>

<h1>CI/CD Pipeline Exposure Management</h1>
<div class="sub">Four scanners guarding a pipeline, findings stored and charted over time, builds blocked on critical results.</div>

<div class="stage">
  <div class="stage-label">Source repository</div>
  <div class="band">
    ${node("terraform", "Terraform", "Cluster provisioning")}
    ${node("helm", "Helm charts", "Written by hand, one per component")}
    ${node("opa", "Rego policies", "Custom rules for this project")}
  </div>
</div>

<div class="flow">
  <span class="flow-arrow">&darr;</span>
  <span class="flow-label">every push and every pull request</span>
  <span class="flow-arrow">&darr;</span>
</div>

<div class="stage">
  <div class="stage-label"><img src="${L.actions}" alt="">Continuous integration gate</div>
  <div class="tools">
    ${scanner("gitleaks", "Gitleaks", "Secrets across the full git history")}
    ${scanner("checkov", "Checkov", "Misconfiguration in Terraform, Helm and Kubernetes")}
    ${scanner("trivy", "Trivy", "Known CVEs in the deployed container images")}
    ${scanner("opa", "OPA and Conftest", "Rules no vendor ships")}
  </div>
  <div class="verdicts">
    <div class="verdict blocked">Critical finding &nbsp;&rarr;&nbsp; pull request refused, the build stops</div>
    <div class="verdict passed">All clear &nbsp;&rarr;&nbsp; the change may be merged</div>
  </div>
</div>

<div class="flow">
  <span class="flow-arrow">&darr;</span>
  <span class="flow-label">once merged, deployed with Helm</span>
  <span class="flow-arrow">&darr;</span>
</div>

<div class="stage">
  <div class="stage-label"><img src="${L.kubernetes}" alt="">Local Kubernetes cluster</div>
  <div class="row" style="margin-bottom:16px">
    ${node("terraform", "Terraform apply", "Creates the cluster itself, not just scanned by it")}
    <div class="arrow"><div class="arrow-line">&rarr;</div><div class="arrow-label">creates</div></div>
    ${node("docker", "kind, two nodes", "Runs on Docker, zero cost, no cloud account")}
  </div>
  <div class="row">
    ${node("trivy", "Scan jobs", "One Kubernetes Job per target image", 'style="flex:1"')}
    <div class="arrow"><div class="arrow-line">&rarr;</div><div class="arrow-label">writes findings</div></div>
    ${node("postgres", "PostgreSQL", "One row per finding, one row per scan", 'style="flex:1"')}
    <div class="arrow"><div class="arrow-line">&rarr;</div><div class="arrow-label">queried by</div></div>
    ${node("grafana", "Grafana", "Exposure timeline, provisioned from files", 'style="flex:1"')}
  </div>
  <div class="stage-note">Network policies restrict who may reach the database. Every container runs non root, with a read only filesystem and no Linux capabilities.</div>
</div>

</body></html>`;

fs.writeFileSync(path.join(__dirname, "diagram.html"), html);
console.log("diagram.html written");
