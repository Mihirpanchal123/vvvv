# MedPlate — meal planner for medical diets

Weekly meal plans and grocery lists for **diabetic**, **chronic kidney disease (CKD)** and **low-FODMAP** diets, including combinations such as diabetes + CKD. It isn't a calorie counter. Each day is solved so that it stays within the user's medical limits, and every meal explains how it fits.

> MedPlate is a planning tool, not medical advice. Default limits come from published guidance (ADA, KDOQI 2020, the Monash low-FODMAP protocol) and can all be overridden with values from the user's care team.

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
```

The app works with no configuration in **guest mode**, where data is kept in `localStorage`. To turn on accounts and cross-device sync, see [Accounts (Supabase)](#accounts-supabase).

| Command | What it does |
|---|---|
| `npm test` | Vitest unit tests: rules, engine, grocery list, content integrity |
| `npm run validate:recipes` | Checks that every recipe ingredient is mapped and its nutrient data is sane |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm run build && npx playwright test` | End-to-end flows on desktop and mobile Chrome |

## How it works

```
UserProfile ──resolveRules──▶ ResolvedRules ──buildCandidates──▶ options per slot × portion
                                    │                                       │
                                    └──────────────── solveWeek (0/1 integer LP per day) ◀┘
                                                              │
                                    WeekPlan ──▶ explainMeal / swapOptions / buildGroceryList
```

- **`lib/rules/`** turns the profile into limits.
  - Diabetes: a hard 30–60 g carbohydrate band at each main meal, plus fibre, added-sugar and saturated-fat targets.
  - CKD: sodium, potassium, phosphorus and protein limits by stage or dialysis type, tightened by lab values (K > 5.0, PO₄ > 4.5), with a fluid budget on dialysis.
  - FODMAP: the restricted groups depend on the phase.
  - When diets are combined, each nutrient takes the strictest limit. Contradictions, such as a minimum above a safety maximum, are surfaced to the user: the maximum is kept and the minimum is dropped.
  - User and clinician overrides replace the defaults.
- **`lib/engine/`** builds the plan.
  - `recipe-info`: per-serving nutrients, glycaemic load, allergens, and FODMAP load summed across every ingredient in a meal. It also accounts for potassium lost by leaching.
  - `candidates`: filters recipes by allergens, dislikes, phosphate additives, and FODMAP load at each portion size (0.5–1.5×).
  - `solve`: each day is a binary integer program built with `javascript-lp-solver`. It tries three solves in order:
    1. A shortlist of recipes, with hard (medical) limits as true constraints. The shortlist is the cheapest recipes plus the most energy-efficient ones, i.e. the most kcal per unit of the tightest budget, such as phosphorus.
    2. Every candidate recipe, still with hard limits as true constraints.
    3. An *elastic* model where any limit may be broken at a heavy penalty. This only runs for genuinely infeasible days, so the user still gets the closest plan and a warning naming the exact limit that couldn't be met.

    Pruning and timeouts can therefore never cause a violation on a day that could have been planned within limits. The objective covers soft targets, the energy target, variety across the week, reuse of ingredients already on the grocery list, favourites, glycaemic load (for diabetes) and a seeded random term, so "Regenerate" gives a different but reproducible plan. Locked meals are fixed.
  - **Performance:** measured over 15 seeds per diet combination, a week takes 0.2–2 s at the median and at most about 4 s (CKD profiles are the slowest). Each day's solve is capped at 1.5 s and keeps the best feasible plan found by then. The solve is synchronous CPU work: on a single long-running Node server, concurrent requests queue behind each other. Serverless functions isolate requests; otherwise, move the solve to a worker thread.
  - `swap`: lists ranked alternatives for one slot that keep the rest of the day within limits.
  - `explain`: gives the per-meal "how it fits your day" breakdown.
- **`lib/grocery/`** aggregates meals × portions × household size, converts to purchase units, sorts by store aisle, separates pantry staples, and adds diet-specific label tips (e.g. "no salt added", "avoid phos- additives", "garlic-infused oil is low FODMAP").
- **`lib/data/`** holds the curated content: 115 ingredients and 157 recipes as typed TypeScript, plus the FODMAP reintroduction challenges. Recipes tagged `energy-dense` get their energy from unsaturated fats rather than protein or phosphorus, so renal plans can reach their energy target. Content is versioned in git so dietitian review happens through pull requests.

### App (`app/`)

| Route | Purpose |
|---|---|
| `/onboarding` | Diet → CKD stage / FODMAP phase → body stats & labs → allergies & dislikes → review of resolved limits |
| `/plan` | 7-day view, daily nutrient meters, meal detail ("how it fits"), swap, lock, regenerate |
| `/grocery` | Aisle-sorted checklist (whole week or half week), pantry, copy/share, print |
| `/recipes`, `/recipes/[id]` | Library annotated with whether each recipe fits *your* rules, and why not |
| `/fodmap` | Guided reintroduction: 3-day dose escalation, symptom log, washout, then a switch to personalisation |
| `/settings` | Edit profile, labs, custom limits ("set by my dietitian"), export or delete data, account |
| `/report` | Printable summary for the care team (save as PDF from the print dialog) |
| `POST /api/plan`, `POST /api/swap` | Zod-validated engine endpoints |

## Accounts (Supabase)

1. Create a Supabase project and run `supabase/migrations/20261104000000_init.sql`. It creates the tables, and every table has Row Level Security scoped to `auth.uid()`.
2. In **Authentication → Sign In / Providers**, make sure **Email** is enabled. It is on by default.
   - **Confirm email** on (the default): new accounts must click a link in their inbox before they can sign in.
   - **Confirm email** off: new accounts are signed in immediately.
3. In **Authentication → URL Configuration**:
   - Set the Site URL to your production origin.
   - Add each `<origin>/auth/callback` to Redirect URLs, e.g. `http://localhost:3000/auth/callback` and `https://<site>.netlify.app/auth/callback`. For Netlify deploy previews, add `https://*--<site>.netlify.app/auth/callback`.

   Confirmation and password-reset emails link back through this route.
4. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Sign-in is by email and password (`/login`), with **Forgot password?** emailing a link that lands on `/reset-password`. Supabase's built-in mailer is rate-limited to a few emails per hour, so set up custom SMTP (Authentication → Emails) before launch.

When a user signs in, any data they created as a guest is uploaded. After that, `components/sync-provider.tsx` mirrors changes to Postgres; the newest whole state wins. "Delete all my data" removes the user's rows; deleting the auth user itself needs the Supabase admin API.

## Deploying to Netlify

`netlify.toml` holds the build settings. Netlify detects Next.js and turns pages and API routes into functions automatically.

1. Push the repo to GitHub, GitLab or Bitbucket. In Netlify, choose **Add new site → Import an existing project** and pick the repo. Alternatively, use `npx netlify-cli deploy --build --prod` from this folder.
2. Under **Site configuration → Environment variables**, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then trigger a redeploy. They are inlined at build time. Without them the site runs in guest mode, with no sign-in.
3. In Supabase, set the Site URL to the Netlify URL and add its `/auth/callback` to Redirect URLs, as described in [Accounts](#accounts-supabase).

Plan generation runs inside a function and takes up to about 4 s for the hardest CKD profiles. That fits within Netlify's default 10 s synchronous function timeout.

## Before a public launch

- **Clinical review.** Nutrient values are USDA SR Legacy approximations. FODMAP thresholds are approximations from published literature, and the Monash data is proprietary, so either license it or have a registered dietitian review `lib/data/ingredients.ts`. The recipe library and the reintroduction doses also need dietitian review.
- **Energy on renal diets.** With CKD protein and phosphorus caps combined with diabetic carb limits, plans average about 95% of the energy target. The hardest case is dialysis + diabetes + low-FODMAP for a large adult, which reaches about 72%: 1.0 g/kg protein under a 900 mg phosphorus cap with 60 g carb meals leaves little room. The app warns below 85%, and a dietitian may add a renal supplement.
- **Content scale.** There are 157 recipes, which meets the 150+ target. `npm run validate:recipes` and the per-diet coverage tests guard new content.
- **USDA import.** There is no automated FoodData Central import yet; nutrient values were entered by hand.
