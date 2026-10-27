# Design skills

This repository vendors the official Impeccable and Taste Skill packages so they are available to Codex tasks using `HabibElias/beria-cms`.

Start a new task/session after installation so Codex can discover the skills. Select a workflow explicitly, for example:

```text
Use $impeccable to audit the frontend login page.
Use $design-taste-frontend to improve the library dashboard.
```

The React application is in `front-end-r/`. Run the chosen skill's scripts from that application directory when inspecting or working on its UI. Resolve script paths from the skill directory, which is `../.agents/skills/<skill-name>/` relative to the application.

## Sources and licenses

- [Impeccable](https://github.com/pbakaus/impeccable): skill version 4.8.0, engine 0.1.18, Apache-2.0 with bundled third-party notices.
- [Taste Skill](https://github.com/Leonxlnx/taste-skill): installed as `design-taste-frontend`, MIT.

Each skill includes its license. `skills/sources.json` records the exact source commit and every local adaptation. When updating, copy the complete upstream skill folder, preserve the license and notices, reapply the documented cloud adaptations, and update the source revision.

## Cloud runtime

- Impeccable downloads its pinned engine on first use, verifies the upstream SHA-256 checksum, and caches it under `skills/impeccable/scripts/.cache/`. The cache is ignored by Git. `IMPECCABLE_HOME` can override that location.
- Taste Skill needs Node 22+ and Chromium/Chrome; both are installed in this environment. Its page and app direction histories stay beside their generated direction sheets instead of requiring writes to the home directory. `TASTE_SKILL_HISTORY` can override the history path.
- Chromium cannot use its OS sandbox in this cloud execution environment. For Taste's browser inspector, use `TASTE_SKILL_NO_SANDBOX=1 node ../.agents/skills/design-taste-frontend/scripts/inspect.mjs http://localhost:5173 --app`. This opt-in applies only to the browser process. Browser config and caches are isolated in the temporary profile and removed when it closes.
- Impeccable's first engine download requires GitHub access. Taste's image searches require access to the upstream image collections; its local direction generation and browser checks work without that access.

For a quick engine check from the repository root:

```sh
.agents/skills/impeccable/scripts/impeccable engine-probe
node .agents/skills/design-taste-frontend/scripts/draw.mjs --app --list kinds
```
