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

// The two themes differ only in these tokens. The structure is identical, so
// the light and the dark image always describe exactly the same architecture.
const THEMES = {
  dark: {
    page: "#0d1117",
    title: "#ffffff",
    subtitle: "#98a2b3",
    card: "#ffffff",
    cardShadow: "0 2px 6px rgba(0,0,0,.45), 0 16px 36px rgba(0,0,0,.32)",
    zoneBorder: "#c7ccd5",
    zoneName: "#5b6270",
    tileText: "#1a1d23",
    logoChip: "none",
    arrow: "#7d8796",
    numOnPageBg: "#ffffff",
    numOnPageFg: "#0d1117",
    numOnCardBg: "#1a1d23",
    numOnCardFg: "#ffffff",
    labelOnPage: "#dbe1ea",
    labelOnCard: "#2b3038",
    tip: "#6f7784",
  },
  light: {
    page: "#ffffff",
    title: "#0d1117",
    subtitle: "#5b6270",
    card: "#161b22",
    cardShadow: "0 2px 6px rgba(16,24,40,.14), 0 16px 36px rgba(16,24,40,.12)",
    zoneBorder: "#3b434f",
    zoneName: "#aab3c0",
    tileText: "#e9edf3",
    logoChip: "#ffffff",
    arrow: "#5f6773",
    numOnPageBg: "#16181d",
    numOnPageFg: "#ffffff",
    numOnCardBg: "#ffffff",
    numOnCardFg: "#16181d",
    labelOnPage: "#2b3038",
    labelOnCard: "#dbe1ea",
    tip: "#96a0ad",
  },
};

const tile = (logo, name) => `
  <div class="tile"><img src="${L[logo]}" alt="${name}"><span>${name}</span></div>`;

const across = (n, ...labels) => `
  <div class="connector">
    ${labels.map((l, i) => `<div class="step"><span class="num">${n + i}</span><span class="lbl">${l}</span></div>`).join("")}
    <div class="line"></div>
  </div>`;

const down = (n, label) => `
  <div class="vconn"><span class="num dark">${n}</span><span class="lbl on-card">${label}</span><span class="tip">&darr;</span></div>`;

const page = (t) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1790px;
    font-family: "Segoe UI", system-ui, sans-serif;
    background: ${t.page};
    padding: 40px 44px 34px;
  }
  h1 { font-size: 33px; font-weight: 700; letter-spacing: -0.4px; color: ${t.title}; }
  .sub { font-size: 17px; color: ${t.subtitle}; margin-top: 6px; margin-bottom: 32px; }

  .canvas { display: flex; align-items: flex-start; }

  .card { border-radius: 12px; overflow: hidden; background: ${t.card}; box-shadow: ${t.cardShadow}; }
  .head {
    display: flex; align-items: center; justify-content: center; gap: 9px;
    padding: 13px 14px; font-size: 17px; font-weight: 680; color: #fff;
  }
  .head img { height: 23px; width: 23px; object-fit: contain; filter: brightness(0) invert(1); }
  .body { padding: 18px; display: flex; flex-direction: column; }

  .h-repo    { background: #c2701a; }
  .h-gate    { background: #2a6fb8; }
  .h-cluster { background: #17786a; }

  .zone { border: 1.5px dashed ${t.zoneBorder}; border-radius: 9px; padding: 26px 15px 15px; position: relative; }
  .zone > .zname {
    position: absolute; top: 6px; left: 0; right: 0; text-align: center;
    font-size: 13.5px; font-weight: 650; color: ${t.zoneName};
  }

  .tiles { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .tile { width: 118px; text-align: center; }
  .tile img {
    height: 46px; width: auto; max-width: 94px; object-fit: contain;
    ${t.logoChip === "none" ? "" : `background: ${t.logoChip}; border-radius: 11px; padding: 7px 9px; box-sizing: content-box;`}
  }
  .tile span { display: block; font-size: 14px; font-weight: 630; margin-top: 8px; color: ${t.tileText}; }

  .connector { align-self: center; display: flex; flex-direction: column; align-items: center; padding: 0 12px; min-width: 176px; }
  .connector .line { width: 100%; height: 3px; background: ${t.arrow}; position: relative; }
  .connector .line::after {
    content: ""; position: absolute; right: -1px; top: -6.5px;
    border-left: 14px solid ${t.arrow}; border-top: 8px solid transparent; border-bottom: 8px solid transparent;
  }
  .step { display: flex; align-items: center; gap: 7px; margin-bottom: 7px; }
  .num {
    width: 25px; height: 25px; border-radius: 50%;
    background: ${t.numOnPageBg}; color: ${t.numOnPageFg};
    font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex: none;
  }
  .num.dark { background: ${t.numOnCardBg}; color: ${t.numOnCardFg}; }
  .lbl { font-size: 14.5px; color: ${t.labelOnPage}; font-weight: 620; white-space: nowrap; }
  .lbl.on-card { color: ${t.labelOnCard}; }

  .vconn { display: flex; align-items: center; gap: 9px; justify-content: center; padding: 9px 0; }
  .vconn .tip { font-size: 26px; color: ${t.tip}; line-height: .75; }

  .verdicts { display: flex; gap: 18px; justify-content: center; }
  .mark {
    width: 62px; height: 62px; border-radius: 50%; display: flex;
    align-items: center; justify-content: center; font-size: 32px; font-weight: 800; line-height: 1;
  }
  .ok   { background: #e4f6ea; color: #157a35; border: 2.5px solid #8fd3a6; }
  .fail { background: #fdeaec; color: #b3202c; border: 2.5px solid #eda2aa; }
</style></head><body>

<h1>CI/CD Pipeline Exposure Management</h1>
<div class="sub">Four scanners gate every change, findings land in a database, the dashboard shows exposure over time.</div>

<div class="canvas">

  <div class="card" style="width:292px">
    <div class="head h-repo"><img src="${L.terraform}" alt="">Source repository</div>
    <div class="body">
      <div class="zone">
        <div class="zname">infrastructure as code</div>
        <div class="tiles">${tile("terraform", "Terraform")}${tile("helm", "Helm charts")}</div>
      </div>
      <div style="height:14px"></div>
      <div class="zone">
        <div class="zname">policy as code</div>
        <div class="tiles">${tile("opa", "Rego rules")}</div>
      </div>
    </div>
  </div>

  ${across(1, "push, pull request")}

  <div class="card" style="width:412px">
    <div class="head h-gate"><img src="${L.actions}" alt="">Continuous integration gate</div>
    <div class="body">
      <div class="zone">
        <div class="zname">scanners</div>
        <div class="tiles">
          ${tile("gitleaks", "Gitleaks")}${tile("checkov", "Checkov")}
          ${tile("trivy", "Trivy")}${tile("opa", "Conftest")}
        </div>
      </div>
      ${down(2, "verdict")}
      <div class="zone">
        <div class="zname">gate decision</div>
        <div class="verdicts">
          <div class="mark ok">&#10003;</div>
          <div class="mark fail">&#10007;</div>
        </div>
      </div>
    </div>
  </div>

  ${across(3, "terraform apply", "helm install")}

  <div class="card" style="width:748px">
    <div class="head h-cluster"><img src="${L.kubernetes}" alt=""><img src="${L.docker}" alt="">Local cluster</div>
    <div class="body">
      <div class="zone">
        <div class="zname">scan job</div>
        <div class="tiles" style="align-items:center">
          ${tile("trivy", "Trivy scan")}
          <div class="connector" style="min-width:152px">
            <div class="step"><span class="num dark">5</span><span class="lbl on-card">writes report</span></div>
            <div class="line"></div>
          </div>
          ${tile("postgres", "psql loader")}
        </div>
      </div>
      ${down(6, "insert findings")}
      <div class="zone">
        <div class="zname">storage</div>
        <div class="tiles">${tile("postgres", "PostgreSQL")}</div>
      </div>
      ${down(7, "queried by")}
      <div class="zone">
        <div class="zname">dashboard</div>
        <div class="tiles">${tile("grafana", "Grafana")}</div>
      </div>
    </div>
  </div>

</div>

</body></html>`;

for (const [name, tokens] of Object.entries(THEMES)) {
  fs.writeFileSync(path.join(__dirname, `diagram-${name}.html`), page(tokens));
  console.log(`diagram-${name}.html written`);
}
