// Builds contrib.json and contrib.svg (neon contribution calendar, activity radar, top repositories)
// from the GitHub GraphQL API. Needs GH_TOKEN with repo + read:user to count private contributions.
import { writeFileSync } from "node:fs";

const login = process.env.LOGIN || "HenriqueMachine";
const token = process.env.GH_TOKEN;
if (!token) throw new Error("GH_TOKEN is missing");

const query = `query($login: String!) { user(login: $login) { contributionsCollection {
  contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
  totalCommitContributions totalIssueContributions totalPullRequestContributions totalPullRequestReviewContributions
  totalRepositoriesWithContributedCommits restrictedContributionsCount
  commitContributionsByRepository(maxRepositories: 5) { repository { nameWithOwner } contributions { totalCount } } } } }`;

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "contrib-card" },
  body: JSON.stringify({ query, variables: { login } }),
});
const body = await res.json();
if (!res.ok || body.errors) throw new Error(JSON.stringify(body.errors || body));
const c = body.data.user.contributionsCollection;

const days = c.contributionCalendar.weeks.flatMap((w) => w.contributionDays).map((d) => [d.date, d.contributionCount]);
const kinds = { commits: c.totalCommitContributions, pullRequests: c.totalPullRequestContributions, issues: c.totalIssueContributions, reviews: c.totalPullRequestReviewContributions };
const kindTotal = Object.values(kinds).reduce((a, b) => a + b, 0) || 1;
const pct = Object.fromEntries(Object.entries(kinds).map(([k, v]) => [k, Math.round((v / kindTotal) * 100)]));
const repos = c.commitContributionsByRepository.map((r) => ({ name: r.repository.nameWithOwner, commits: r.contributions.totalCount }));
let best = 0, cur = 0; for (const [, n] of days) { cur = n > 0 ? cur + 1 : 0; best = Math.max(best, cur); }
const data = {
  generatedAt: new Date().toISOString(), login, total: c.contributionCalendar.totalContributions,
  kinds, pct, repos, repoCount: c.totalRepositoriesWithContributedCommits,
  bestStreak: best, currentStreak: cur, busiestDay: days.reduce((a, b) => (b[1] > a[1] ? b : a), ["", 0]), days,
};
writeFileSync("contrib.json", JSON.stringify(data));

// ---------- SVG ----------
const C = { bg: "#05070b", line: "#1c2230", lineHi: "#2c3547", text: "#f5f5f5", muted: "#a7aebe", faint: "#6b7385", cyan: "#05d9e8", mag: "#ff2a6d", yel: "#f9f002" };
const W = 900, H = 370, cell = 12, gap = 3, left = 46, top = 74;
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
const fmt = (n) => n.toLocaleString("en-US");
const max = Math.max(1, ...days.map((d) => d[1]));
const shades = ["#0d1017", "#063d44", "#04707a", "#04a8b5", C.cyan];
const q = (n) => { if (!n) return 0; const r = n / max; return r < .08 ? 1 : r < .2 ? 2 : r < .45 ? 3 : 4; };
const first = new Date(days[0][0] + "T12:00:00Z"), off = first.getUTCDay();
const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let cells = "", months = "", lastM = -1;
days.forEach(([d, n], i) => {
  const k = i + off, col = Math.floor(k / 7), row = k % 7, x = left + col * (cell + gap), y = top + row * (cell + gap);
  const dt = new Date(d + "T12:00:00Z");
  if (row === 0 && dt.getUTCDate() <= 7 && dt.getUTCMonth() !== lastM) { lastM = dt.getUTCMonth(); months += `<text x="${x}" y="${top - 8}" class="t">${mon[lastM]}</text>`; }
  const hot = n >= max * .6;
  cells += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${hot ? C.mag : shades[q(n)]}"${hot || q(n) === 4 ? ' filter="url(#g)"' : ""}><title>${d}: ${n}</title></rect>`;
});
// radar
const rx = 190, ry = 290, R = 52;
const pts = [[rx - pct.commits / 100 * R, ry], [rx, ry - pct.reviews / 100 * R], [rx + pct.issues / 100 * R, ry], [rx, ry + pct.pullRequests / 100 * R]];
const radar = `<line x1="${rx - R}" y1="${ry}" x2="${rx + R}" y2="${ry}" class="ax"/><line x1="${rx}" y1="${ry - R}" x2="${rx}" y2="${ry + R}" class="ax"/>
  <polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${C.cyan}" fill-opacity=".18" stroke="${C.cyan}" stroke-width="1.6" filter="url(#g)"/>
  ${pts.map(([x, y]) => `<rect x="${x - 3}" y="${y - 3}" width="6" height="6" fill="${C.mag}" transform="rotate(45 ${x} ${y})"/>`).join("")}
  <text x="${rx - R - 10}" y="${ry - 4}" text-anchor="end" class="v">${pct.commits}%</text><text x="${rx - R - 10}" y="${ry + 10}" text-anchor="end" class="t">commits</text>
  <text x="${rx}" y="${ry - R - 18}" text-anchor="middle" class="v">${pct.reviews}%</text><text x="${rx}" y="${ry - R - 6}" text-anchor="middle" class="t">code review</text>
  <text x="${rx + R + 10}" y="${ry - 4}" class="v">${pct.issues}%</text><text x="${rx + R + 10}" y="${ry + 10}" class="t">issues</text>
  <text x="${rx}" y="${ry + R + 16}" text-anchor="middle" class="v">${pct.pullRequests}%</text><text x="${rx}" y="${ry + R + 28}" text-anchor="middle" class="t">pull requests</text>`;
// repos
const topRepos = repos.slice(0, 3), rmax = Math.max(1, ...topRepos.map((r) => r.commits));
const reposSvg = topRepos.map((r, i) => { const y = 252 + i * 30, w = Math.round((r.commits / rmax) * 260);
  return `<text x="420" y="${y}" class="r">${esc(r.name)}</text><text x="${W - 40}" y="${y}" text-anchor="end" class="v">${fmt(r.commits)}</text>
  <rect x="420" y="${y + 7}" width="${w}" height="3" fill="${i ? C.cyan : C.mag}" filter="url(#g)"/>`; }).join("")
  + `<text x="420" y="${252 + topRepos.length * 30 + 4}" class="t">and ${Math.max(0, data.repoCount - topRepos.length)} other repositories</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${fmt(data.total)} contributions in the last year">
<defs><filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<style>.t{font:500 10.5px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:${C.faint};letter-spacing:.06em}
.v{font:700 12px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:${C.text}}.r{font:600 12.5px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:${C.muted}}
.h{font:800 22px -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;fill:${C.text}}.k{font:600 10.5px ui-monospace,SFMono-Regular,Menlo,monospace;fill:${C.cyan};letter-spacing:.18em}
.ax{stroke:${C.lineHi};stroke-width:1}</style>
<path d="M1 1 H${W - 15} L${W - 1} 15 V${H - 1} H15 L1 ${H - 15} Z" fill="${C.bg}" stroke="${C.lineHi}"/>
<text x="24" y="30" class="k">ACTIVITY · LAST 12 MONTHS</text>
<text x="24" y="54" class="h">${fmt(data.total)} contributions</text>
<text x="${W - 24}" y="54" text-anchor="end" class="t">best streak ${data.bestStreak} days · busiest day ${fmt(data.busiestDay[1])}</text>
${months}<text x="14" y="${top + 1 * (cell + gap) + 10}" class="t">Mon</text><text x="14" y="${top + 3 * (cell + gap) + 10}" class="t">Wed</text><text x="14" y="${top + 5 * (cell + gap) + 10}" class="t">Fri</text>
${cells}
<line x1="24" y1="196" x2="${W - 24}" y2="196" stroke="${C.line}"/>
<text x="24" y="222" class="k">ACTIVITY OVERVIEW</text><text x="420" y="222" class="k">CONTRIBUTED TO</text>
${radar}
${reposSvg}
<text x="${W - 24}" y="${H - 14}" text-anchor="end" class="t">updated ${data.generatedAt.slice(0, 10)}</text>
</svg>`;
writeFileSync("contrib.svg", svg);
console.log(`total ${data.total} · ${JSON.stringify(pct)} · repos ${repos.map((r) => r.name).join(", ")}`);
