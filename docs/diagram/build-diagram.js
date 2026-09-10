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

const tile = (logo, name, dark = false) => `
  <div class="tile${dark ? " dark" : ""}"><img src="${L[logo]}" alt="${name}"><span>${name}</span></div>`;

const step = (n, label) => `
  <div class="step"><span class="num">${n}</span><span class="lbl">${label}</span></div>`;

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1460px;
    font-family: "Segoe UI", system-ui, sans-serif;
    background: #f4f6f9;
    color: #16181d;
    padding: 32px 36px 28px;
  }
  h1 { font-size: 25px; font-weight: 700; letter-spacing: -0.3px; }
  .sub { font-size: 13.5px; color: #5b6270; margin-top: 4px; margin-bottom: 24px; }

  .canvas { display: flex; align-items: flex-start; }

  .group {
    border-radius: 10px; overflow: hidden; background: #fff;
    box-shadow: 0 1px 3px rgba(16,24,40,.09), 0 6px 18px rgba(16,24,40,.05);
  }
  .head {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 9px 12px; font-size: 13px; font-weight: 680; color: #fff; letter-spacing: 0.1px;
  }
  .head img { height: 17px; width: 17px; object-fit: contain; }
  .head img.mono { filter: brightness(0) invert(1); }
  .body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }

  .h-repo    { background: #c2701a; }
  .h-gate    { background: #2a6fb8; }
  .h-cluster { background: #2f3540; }

  .panel-cluster .body { background: #262b33; }

  .sub-group { border: 1.5px dashed #c3c9d2; border-radius: 8px; padding: 21px 12px 12px; position: relative; }
  .sub-group > .sname {
    position: absolute; top: 5px; left: 0; right: 0; text-align: center;
    font-size: 11px; font-weight: 640; color: #5b6270; letter-spacing: 0.2px;
  }
  .dashed-dark { border-color: #4a515d; }
  .dashed-dark > .sname { color: #cbd2dc; }

  .tiles { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .tile { width: 94px; text-align: center; }
  .tile img { height: 36px; width: auto; max-width: 74px; object-fit: contain; }
  .tile span { display: block; font-size: 11.5px; font-weight: 620; margin-top: 6px; line-height: 1.25; }
  .tile.dark span { color: #eef1f5; }
  .tile.dark img { background: #fff; border-radius: 9px; padding: 5px 7px; box-sizing: content-box; }

  .connector { align-self: center; display: flex; flex-direction: column; align-items: center; padding: 0 8px; min-width: 128px; }
  .connector .line { width: 100%; height: 2px; background: #98a0ac; position: relative; }
  .connector .line::after {
    content: ""; position: absolute; right: -1px; top: -4.5px;
    border-left: 9px solid #98a0ac; border-top: 5px solid transparent; border-bottom: 5px solid transparent;
  }
  .step { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
  .num {
    width: 19px; height: 19px; border-radius: 50%; background: #16181d; color: #fff;
    font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex: none;
  }
  .num.light { background: #fff; color: #16181d; }
  .lbl { font-size: 11.5px; color: #3d434d; font-weight: 600; white-space: nowrap; }
  .lbl.on-dark { color: #dfe4ea; }

  .vconn { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 2px 0; }
  .vconn .down { font-size: 16px; color: #98a0ac; line-height: 1; }

  .outcome { border: 1.5px solid #dfe3e9; border-radius: 8px; padding: 20px 11px 11px; position: relative; }
  .outcome > .sname {
    position: absolute; top: 5px; left: 0; right: 0; text-align: center;
    font-size: 11px; font-weight: 640; color: #5b6270;
  }
  .verdicts { display: flex; gap: 9px; }
  .verdict { flex: 1; border-radius: 7px; padding: 9px 8px; font-size: 11.5px; font-weight: 680; text-align: center; line-height: 1.3; }
  .blocked { background: #fdecee; color: #a3242e; border: 1.5px solid #efb4ba; }
  .passed  { background: #e9f7ee; color: #1b6a32; border: 1.5px solid #b0dfbe; }
</style></head><body>

<h1>CI/CD Pipeline Exposure Management</h1>
<div class="sub">Four scanners gate every change, findings land in a database, the dashboard shows exposure over time.</div>

<div class="canvas">

  <div class="group" style="width:232px">
    <div class="head h-repo">
      <img class="mono" src="${L.terraform}" alt="">Source repository
    </div>
    <div class="body">
      <div class="sub-group">
        <div class="sname">infrastructure as code</div>
        <div class="tiles">${tile("terraform", "Terraform")}${tile("helm", "Helm charts")}</div>
      </div>
      <div class="sub-group">
        <div class="sname">policy as code</div>
        <div class="tiles">${tile("opa", "Rego rules")}</div>
      </div>
    </div>
  </div>

  <div class="connector">
    ${step(1, "push, pull request")}
    <div class="line"></div>
  </div>

  <div class="group" style="width:330px">
    <div class="head h-gate">
      <img class="mono" src="${L.actions}" alt="">Continuous integration gate
    </div>
    <div class="body">
      <div class="sub-group">
        <div class="sname">scanners, run by GitHub Actions</div>
        <div class="tiles">
          ${tile("gitleaks", "Gitleaks")}${tile("checkov", "Checkov")}
          ${tile("trivy", "Trivy")}${tile("opa", "Conftest")}
        </div>
      </div>
      <div class="outcome">
        <div class="sname">gate decision</div>
        <div class="verdicts">
          <div class="verdict passed">all clear<br>change merged</div>
          <div class="verdict blocked">critical finding<br>build stops</div>
        </div>
      </div>
    </div>
  </div>

  <div class="connector">
    ${step(2, "terraform apply")}
    ${step(3, "helm install")}
    <div class="line"></div>
  </div>

  <div class="group panel-cluster" style="width:606px">
    <div class="head h-cluster">
      <img src="${L.kubernetes}" alt=""><img src="${L.docker}" alt="">Local cluster, kind on Docker, namespace exposure
    </div>
    <div class="body">
      <div class="sub-group dashed-dark">
        <div class="sname">scan job, one pod per target image</div>
        <div class="tiles" style="align-items:center">
          ${tile("trivy", "Trivy initContainer", true)}
          <div class="connector" style="min-width:110px">
            <div class="step"><span class="num light">4</span><span class="lbl on-dark">writes report</span></div>
            <div class="line"></div>
          </div>
          ${tile("postgres", "psql loader", true)}
        </div>
      </div>

      <div class="vconn"><span class="num light">5</span><span class="lbl on-dark">insert scan and findings</span><span class="down">&darr;</span></div>

      <div class="sub-group dashed-dark">
        <div class="sname">storage, StatefulSet with a persistent volume</div>
        <div class="tiles">${tile("postgres", "PostgreSQL", true)}</div>
      </div>

      <div class="vconn"><span class="num light">6</span><span class="lbl on-dark">queried by</span><span class="down">&darr;</span></div>

      <div class="sub-group dashed-dark">
        <div class="sname">dashboard, provisioned from files</div>
        <div class="tiles">${tile("grafana", "Grafana", true)}</div>
      </div>
    </div>
  </div>

</div>

</body></html>`;

fs.writeFileSync(path.join(__dirname, "diagram.html"), html);
console.log("diagram.html written");
