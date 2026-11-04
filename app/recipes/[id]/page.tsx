import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fmtAmount, gramsLabel } from "@/components/nutrient-meter";
import { RecipeFit } from "@/components/recipe-fit";
import { Badge, Card } from "@/components/ui";
import { INGREDIENT_MAP } from "@/lib/data/ingredients";
import { RECIPES, RECIPE_MAP } from "@/lib/data/recipes";
import { NUTRIENTS, NUTRIENT_META } from "@/lib/domain/types";
import { getRecipeInfo } from "@/lib/engine/recipe-info";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: RECIPE_MAP.get(id)?.title ?? "Recipe" };
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!RECIPE_MAP.has(id)) notFound();
  const info = getRecipeInfo(id);
  const r = info.recipe;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/recipes" className="text-sm text-muted hover:text-fg">← All recipes</Link>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{r.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {r.slots.map((s) => <Badge key={s} tone="brand" className="capitalize">{s}</Badge>)}
        <Badge>{r.prepMin} min</Badge>
        <Badge>Serves {r.servings}</Badge>
        {r.tags?.map((t) => <Badge key={t}>{t}</Badge>)}
      </div>

      <div className="mt-6">
        <RecipeFit recipeId={id} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_260px]">
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-2 text-lg font-semibold">Ingredients</h2>
            <ul className="divide-y divide-line text-sm">
              {r.ingredients.map((line) => (
                <li key={line.id} className="flex justify-between gap-3 py-1.5">
                  <span>
                    {INGREDIENT_MAP.get(line.id)?.name}
                    {line.leached && <span className="text-muted"> (leached)</span>}
                  </span>
                  <span className="tabular-nums text-muted">{gramsLabel(line.g)}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-lg font-semibold">Method</h2>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {r.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </section>
        </div>

        <Card className="h-fit p-4">
          <h2 className="mb-2 font-semibold">Per serving</h2>
          <dl className="divide-y divide-line text-sm tabular-nums">
            {NUTRIENTS.filter((n) => n !== "fluid" || info.perServing.fluid > 0).map((n) => (
              <div key={n} className="flex justify-between py-1.5">
                <dt className="text-muted">{NUTRIENT_META[n].label}</dt>
                <dd>{fmtAmount(info.perServing[n], n)}</dd>
              </div>
            ))}
            <div className="flex justify-between py-1.5">
              <dt className="text-muted">Glycaemic load (est.)</dt>
              <dd>{Math.round(info.glycemicLoad)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">Estimated from USDA data; brands vary.</p>
        </Card>
      </div>
    </div>
  );
}
