### Hi, I'm Henrique 👋

**AI coding agents in practice: real workflows from a production SaaS.**

I'm a Kotlin & Flutter engineer from São Paulo. I started with Android libraries. Today I build and run a full SaaS with a team of AI coding agents: backend, app, infra and release. Here I share what works, what breaks and the guardrails in between.

> 🇧🇷 **Resumo:** Sou engenheiro Kotlin e Flutter em São Paulo. Comecei com bibliotecas Android e hoje toco um SaaS inteiro em produção com um time de agentes de IA (backend, app, infra e release). Aqui compartilho o que funciona, o que quebra e as travas de segurança que uso no dia a dia.

<br>

**🧑‍🍳 What I'm building: FoodBot**

A SaaS for delivery restaurants in Brazil: orders, reviews, menu, stock and payouts in one place, with Burg, its virtual assistant. It is integrated with iFood through the official partner API.

| | |
|---|---|
| **Stack** | Kotlin · Ktor · Exposed · PostgreSQL · Redis · Flutter Web · Riverpod · AWS (ECS Fargate, RDS) · Claude |
| **Codebase** | ~3,000 Kotlin files in 17 Gradle modules · ~1,600 Dart files · 199 Flyway migrations · 2,500+ app tests |
| **Agent team** | 13 role-based agents per release (planner, backend, app, design, copy, QA, merge gates) |
| **Pace** | ~1,400 merged PRs in the last 30 days · 12,000+ contributions in the last year |

The code is private. The workflow is not: I am opening it as a template (see below). 👉 [foodbotbrasil.com.br](https://foodbotbrasil.com.br)

<br>

**🤖 How the agent team works**

- **Roles, not one big prompt:** each agent owns one area and has its own skills, notes and limits.
- **A shared brain:** an Obsidian vault is the source of truth for decisions, rules and each agent's state.
- **A message protocol:** `DONE / ASK / BLOCK / FYI`, at most 8 lines, links instead of pasted content.
- **Hard guardrails:** hooks block merges to `main`, production deploys and secrets without a human OK.
- **One worktree per task** and a FIFO queue for heavy commands, so parallel agents do not fight over CPU and the test database.
- **One full verification per PR**, and reviewer agents gate every merge.

📦 *Agent team template for Claude Code: coming soon.*

<br>

**🛠️ Open source & projects**

| Project | What it is |
|---|---|
| [EasyFingerPrint](https://github.com/HenriqueMachine/EasyFingerPrint) | Android fingerprint authentication library · Material Design |
| [Deepdeck](https://github.com/HenriqueMachine/Deepdeck) | AntaresOS: a keyboard-driven, composable macOS workspace |
| [distributed-consistency-jvm](https://github.com/HenriqueMachine/distributed-consistency-jvm) | Sagas and failure as part of the flow, in Kotlin |
| [sdui-backend](https://github.com/HenriqueMachine/sdui-backend) · [sdui-app](https://github.com/HenriqueMachine/sdui-app) | Server-driven UI: a Ktor backend and a Flutter renderer with a shared JSON Schema contract |
| [Pokedex](https://github.com/HenriqueMachine/Pokedex) | Android with Clean Architecture · Compose · Paging 3 |
| [OdinEngine](https://github.com/HenriqueMachine/OdinEngine) | Personal DevX CLI toolkit in Go |

<br>

**🧰 Stack**

![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat&logo=kotlin&logoColor=white)
![Ktor](https://img.shields.io/badge/Ktor-087CFA?style=flat&logo=ktor&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack_Compose-4285F4?style=flat&logo=jetpackcompose&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=flat&logo=dart&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat&logo=amazonwebservices&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=flat&logo=go&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_Code-D97757?style=flat&logo=anthropic&logoColor=white)

<br>

**📊 Activity** (public and private contributions, updated daily)

<img src="metrics.svg" alt="GitHub metrics of HenriqueMachine" width="100%">

<br>

**📫 Connect**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/henrique-p-4141a8142/)
![Blog](https://img.shields.io/badge/Blog-coming_soon-555?style=flat)
