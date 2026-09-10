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

const tile = (logo, name) => `
  <div class="tile"><img src="${L[logo]}" alt="${name}"><span>${name}</span></div>`;

const step = (n, label) => `
  <div class="step"><span class="num">${n}</span><span class="lbl">${label}</span></div>`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1420px;
    font-family: "Segoe UI", system-ui, sans-serif;
    background: #fff;
    color: #16181d;
    padding: 34px 40px 30px;
  }
  h1 { font-size: 25px; font-weight: 700; letter-spacing: -0.3px; }
  .sub { font-size: 13.5px; color: #6b7280; margin-top: 4px; margin-bottom: 26px; }

  .canvas { display: flex; align-items: flex-start; gap: 0; }

  .group {
    border: 1.5px solid #e08a2e; border-radius: 8px;
    padding: 26px 18px 18px; position: relative; background: #fff;
    display: flex; flex-direction: column; gap: 14px;
  }
  .group > .gname {
    position: absolute; top: 7px; left: 0; right: 0; text-align: center;
    font-size: 12.5px; font-weight: 650; color: #d97b12; letter-spacing: 0.2px;
  }

  .sub-group {
    border: 1.5px dashed #b9bfc9; border-radius: 7px;
    padding: 22px 14px 13px; position: relative;
  }
  .sub-group > .sname {
    position: absolute; top: 5px; left: 0; right: 0; text-align: center;
    font-size: 11.5px; font-weight: 600; color: #5b6270;
  }

  .tiles { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .tile { width: 96px; text-align: center; }
  .tile img { height: 38px; width: auto; max-width: 76px; object-fit: contain; }
  .tile span { display: block; font-size: 11.5px; font-weight: 600; margin-top: 7px; line-height: 1.25; }

  .connector { align-self: center; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0 6px; min-width: 132px; }
  .connector .line { width: 100%; height: 1.5px; background: #9aa1ad; position: relative; }
  .connector .line::after {
    content: ""; position: absolute; right: -1px; top: -4px;
    border-left: 8px solid #9aa1ad; border-top: 4.5px solid transparent; border-bottom: 4.5px solid transparent;
  }
  .step { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; }
  .num {
    width: 19px; height: 19px; border-radius: 50%; background: #16181d; color: #fff;
    font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex: none;
  }
  .lbl { font-size: 11.5px; color: #3d434d; font-weight: 550; white-space: nowrap; }

  .vconn { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 3px 0; }
  .vconn .down { font-size: 17px; color: #9aa1ad; line-height: 1; }

  .verdicts { display: flex; flex-direction: column; gap: 7px; margin-top: 2px; }
  .verdict { border-radius: 6px; padding: 7px 11px; font-size: 11.5px; font-weight: 650; text-align: center; }
  .blocked { background: #fdeced; color: #a3242e; border: 1.5px solid #f0b9be; }
  .passed  { background: #eaf7ee; color: #1c6b33; border: 1.5px solid #b6e0c2; }
</style></head><body>

<h1>CI/CD Pipeline Exposure Management</h1>
<div class="sub">Four scanners gate every change, findings land in a database, the dashboard shows exposure over time.</div>

<div class="canvas">

  <div class="group" style="width:236px">
    <div class="gname">source repository</div>
    <div class="sub-group">
      <div class="sname">infrastructure as code</div>
      <div class="tiles">${tile("terraform", "Terraform")}${tile("helm", "Helm charts")}</div>
    </div>
    <div class="sub-group">
      <div class="sname">policy as code</div>
      <div class="tiles">${tile("opa", "Rego rules")}</div>
    </div>
  </div>

  <div class="connector">
    ${step(1, "push, pull request")}
    <div class="line"></div>
  </div>

  <div class="group" style="width:322px">
    <div class="gname">continuous integration gate</div>
    <div class="sub-group">
      <div class="sname">scanners, GitHub Actions</div>
      <div class="tiles">
        ${tile("gitleaks", "Gitleaks")}${tile("checkov", "Checkov")}
        ${tile("trivy", "Trivy")}${tile("opa", "Conftest")}
      </div>
    </div>
    <div class="verdicts">
      <div class="verdict blocked">critical finding, build stops</div>
      <div class="verdict passed">all clear, change merged</div>
    </div>
  </div>

  <div class="connector">
    ${step(2, "terraform apply")}
    ${step(3, "helm install")}
    <div class="line"></div>
  </div>

  <div class="group" style="width:620px">
    <div class="gname">local cluster, kind on Docker, namespace exposure</div>

    <div class="sub-group">
      <div class="sname">scan job, one per target image</div>
      <div class="tiles" style="align-items:center">
        ${tile("trivy", "Trivy initContainer")}
        <div class="connector" style="min-width:104px">
          ${step(4, "writes report")}
          <div class="line"></div>
        </div>
        ${tile("postgres", "psql loader")}
      </div>
    </div>

    <div class="vconn"><span class="num">5</span><span class="lbl">insert scan and findings</span><span class="down">&darr;</span></div>

    <div class="sub-group">
      <div class="sname">storage, StatefulSet with a persistent volume</div>
      <div class="tiles">${tile("postgres", "PostgreSQL")}</div>
    </div>

    <div class="vconn"><span class="num">6</span><span class="lbl">queried by</span><span class="down">&darr;</span></div>

    <div class="sub-group">
      <div class="sname">dashboard, provisioned from files</div>
      <div class="tiles">${tile("grafana", "Grafana")}</div>
    </div>
  </div>

</div>

</body></html>`;

fs.writeFileSync(path.join(__dirname, "diagram.html"), html);
console.log("diagram.html written");
