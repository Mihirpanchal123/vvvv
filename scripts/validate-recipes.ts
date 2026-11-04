import { RECIPES } from "@/lib/data/recipes";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { validateContent } from "@/lib/data/validate";

const problems = validateContent();
if (problems.length) {
  console.error(`✗ ${problems.length} content problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ ${RECIPES.length} recipes and ${INGREDIENTS.length} ingredients validated, 0 unmapped ingredients.`);
