# Mubarok Gadget Hub — OpenCode Autonomous Agent Policy

## MODE

FULL AUTONOMOUS WITH SAFETY RAILS.

Work continuously without asking permission for routine technical decisions. Stop only when a Safety Rail is triggered.

## PROJECT

Repository: teknisiAkhirat/mubarok-gadget-hub
Development branch: clean-rebuild
Target branch: main

## SOURCE OF TRUTH

Read and follow:

- Blueprint
- PRD
- this policy

Do not invent requirements that conflict with project documentation.

## OBJECTIVE

Perform a CLEAN REBUILD of Mubarok Gadget Hub.

Priorities:

1. Stable application
2. Mobile-first UI/UX
3. Mock data
4. Production build
5. Remove unnecessary Supabase architecture
6. Prepare for Cloudflare backend

## TARGET ARCHITECTURE

Cloudflare Pages
Cloudflare Workers
Cloudflare D1
Cloudflare R2

Supabase is LEGACY and must not be used in the new architecture.

D1 = structured application data.
R2 = images/files.
Workers = backend/API boundary.

Do not connect production D1/R2 during the UI rebuild unless explicitly required.

## V1 FEATURES

Implement according to Blueprint/PRD:

- Homepage
- Product catalog
- Product detail
- Search
- Category/filter
- WhatsApp CTA
- Service
- Spareparts
- Trade-in
- About
- Mobile navigation
- Trust sections
- Structured mock data

Prioritize P0 before P1.

Do not add unnecessary features.

## AUTONOMOUS PERMISSIONS

Agent may autonomously:

- read/write project files
- create/delete obsolete project files
- refactor code
- install required dependencies
- create components
- create routes
- modify CSS/UI
- create mock data
- run build
- run lint
- run tests
- diagnose errors
- fix errors
- use Git
- create commits

Do NOT ask for confirmation for routine technical decisions.

## AUTONOMOUS LOOP

PLAN
→ INSPECT
→ IMPLEMENT
→ BUILD
→ DIAGNOSE
→ FIX
→ BUILD AGAIN
→ TEST
→ REVIEW
→ COMMIT
→ NEXT TASK

If build fails, diagnose and fix autonomously.

## GIT

Work only on clean-rebuild.

Never directly modify main.
Never force push.
Never reset --hard to destroy work without a strong reason.

Before commits:

- git status
- git diff

Use:
feat:
fix:
refactor:
chore:
docs:

## BUILD GATE

Milestone is not complete until:

npm run build

passes.

If lint/tests exist, run them and fix relevant failures.

## CLEAN REBUILD

Do not preserve obsolete architecture merely because it already exists.

Prefer a simpler architecture.

Remove unused Supabase code and dependencies when safe.

Do not blindly delete the entire project before auditing it.

Preserve useful assets and documentation.

## SAFETY RAILS

STOP AND ASK THE OWNER ONLY IF:

1. New credentials are required.
2. New secrets are required.
3. Access outside this repository is required.
4. sudo/root is required.
5. ~/.ssh or system credentials are required.
6. Another repository must be accessed.
7. Production DNS/domain must be changed.
8. Production data may be destroyed.
9. DROP/TRUNCATE/mass DELETE is proposed on production.
10. Production R2 data may be deleted.
11. A Cloudflare resource outside this project is required.
12. Fundamental architecture must change.
13. A genuinely ambiguous business decision must be made.

Otherwise continue autonomously.

## SECURITY

Never:

- hard-code secrets
- commit secrets
- commit production .env files
- print API keys
- print tokens
- print passwords
- access unrelated credentials
- expose secrets in reports

## WHATSAPP

Use one source of truth for WhatsApp configuration.
Do not hard-code WhatsApp URLs throughout components.

## REPORTING

Do not report every small action.

Work in batches.

At major milestones report:

- changes
- affected modules
- build/test result
- problems solved
- commit hash
- next milestone

Do not stop unless a Safety Rail is triggered.

## DEFINITION OF DONE

V1 must:

- run successfully
- have no runtime crash
- be mobile-first
- implement required P0 features
- use structured mock data
- not depend on Supabase
- have working WhatsApp CTA
- pass production build
- have clean Git commits

## START NOW

1. Check git status.
2. Confirm clean-rebuild branch.
3. Read available Blueprint and PRD documentation.
4. Audit the current repository.
5. Create an internal clean-rebuild plan.
6. Create a Git checkpoint.
7. Remove/refactor legacy architecture.
8. Build V1 progressively.
9. Run build.
10. Fix errors autonomously.
11. Continue through the next milestone without asking permission.
12. Commit milestones.
13. Never merge into main automatically.

BEGIN.
