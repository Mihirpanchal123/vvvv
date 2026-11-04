import type { Recipe } from "@/lib/domain/types";

/** Quantities are grams for the whole recipe; all recipes here serve 1 unless stated. */
export const BREAKFASTS: Recipe[] = [
  {
    id: "overnight-oats-blueberry", title: "Blueberry overnight oats", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "rolled_oats", g: 40 }, { id: "lactose_free_milk", g: 150 }, { id: "chia_seeds", g: 10 },
      { id: "blueberries", g: 60 }, { id: "maple_syrup", g: 5 }, { id: "cinnamon", g: 1 },
    ],
    steps: [
      "Stir oats, chia, cinnamon and milk together in a jar.",
      "Refrigerate overnight (or at least 4 hours).",
      "Top with blueberries and a drizzle of maple syrup before eating.",
    ],
    tags: ["make-ahead", "vegetarian"],
  },
  {
    id: "egg-white-scramble-sourdough", title: "Egg-white scramble with pepper on sourdough", slots: ["breakfast"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "egg_white", g: 120 }, { id: "egg", g: 50 }, { id: "red_pepper", g: 40 },
      { id: "sourdough", g: 60 }, { id: "olive_oil", g: 5 }, { id: "black_pepper", g: 0.5 },
    ],
    steps: [
      "Dice the pepper and soften in the oil for 3 minutes.",
      "Whisk egg and egg whites, pour into the pan and stir gently until just set.",
      "Season with black pepper (no salt needed) and serve on toasted sourdough.",
    ],
    tags: ["vegetarian", "high-protein"],
  },
  {
    id: "yogurt-parfait-strawberry", title: "Strawberry & walnut yogurt parfait", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "lf_greek_yogurt", g: 170 }, { id: "strawberries", g: 65 }, { id: "walnuts", g: 10 },
      { id: "rolled_oats", g: 25 }, { id: "maple_syrup", g: 8 },
    ],
    steps: [
      "Toast the oats in a dry pan for 2–3 minutes until fragrant.",
      "Layer yogurt, sliced strawberries, oats and chopped walnuts.",
      "Finish with maple syrup.",
    ],
    tags: ["vegetarian", "no-cook"],
  },
  {
    id: "cream-cheese-cucumber-toast", title: "Cream cheese, cucumber & dill toast", slots: ["breakfast", "snack"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "sourdough", g: 60 }, { id: "cream_cheese", g: 30 }, { id: "cucumber", g: 60 }, { id: "dill", g: 0.5 },
    ],
    steps: ["Toast the bread.", "Spread with cream cheese, top with thin cucumber slices and a pinch of dill."],
    tags: ["vegetarian", "renal-friendly"],
  },
  {
    id: "apple-cinnamon-oatmeal", title: "Apple cinnamon oatmeal", slots: ["breakfast"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "rolled_oats", g: 40 }, { id: "milk", g: 120 }, { id: "apple", g: 80 },
      { id: "walnuts", g: 10 }, { id: "cinnamon", g: 1 },
    ],
    steps: [
      "Simmer oats with milk and 100 ml water for 5 minutes, stirring.",
      "Stir in diced apple and cinnamon; cook 2 minutes more.",
      "Top with chopped walnuts.",
    ],
    tags: ["vegetarian"],
  },
  {
    id: "veggie-omelet-toast", title: "Zucchini & tomato omelet with toast and berries", slots: ["breakfast"], servings: 1, prepMin: 12,
    ingredients: [
      { id: "egg", g: 100 }, { id: "zucchini", g: 50 }, { id: "tomato", g: 40 }, { id: "cheddar", g: 15 },
      { id: "white_bread", g: 24 }, { id: "strawberries", g: 65 }, { id: "olive_oil", g: 5 },
    ],
    steps: [
      "Sauté diced zucchini in oil for 3 minutes; add tomato.",
      "Pour in beaten eggs, cook until nearly set, sprinkle cheddar and fold.",
      "Serve with a slice of toast and strawberries.",
    ],
    tags: ["vegetarian", "renal-friendly"],
  },
  {
    id: "pb-banana-toast", title: "Peanut butter & banana toast", slots: ["breakfast"], servings: 1, prepMin: 4,
    ingredients: [{ id: "whole_wheat_bread", g: 70 }, { id: "peanut_butter", g: 16 }, { id: "banana", g: 50 }],
    steps: ["Toast the bread.", "Spread peanut butter and top with sliced banana."],
    tags: ["vegetarian", "quick"],
  },
  {
    id: "breakfast-tacos", title: "Egg & pepper breakfast tacos", slots: ["breakfast"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "corn_tortilla", g: 60 }, { id: "egg", g: 100 }, { id: "red_pepper", g: 30 },
      { id: "scallion_greens", g: 10 }, { id: "cheddar", g: 15 }, { id: "olive_oil", g: 4 },
    ],
    steps: [
      "Cook diced pepper in oil for 3 minutes, add beaten eggs and scramble.",
      "Warm tortillas in a dry pan.",
      "Fill with eggs, cheddar and sliced scallion greens.",
    ],
    tags: ["vegetarian"],
  },
  {
    id: "chia-pudding-raspberry", title: "Raspberry chia pudding", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "chia_seeds", g: 24 }, { id: "almond_milk", g: 200 }, { id: "raspberries", g: 60 },
      { id: "maple_syrup", g: 10 }, { id: "rolled_oats", g: 20 },
    ],
    steps: [
      "Whisk chia, oats, almond milk and maple syrup; rest 10 minutes and whisk again.",
      "Refrigerate overnight.",
      "Top with raspberries.",
    ],
    tags: ["vegan", "make-ahead"],
  },
  {
    id: "ginger-rice-congee", title: "Ginger rice congee with egg", slots: ["breakfast"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "white_rice", g: 40 }, { id: "chicken_broth_low_na", g: 300 }, { id: "egg", g: 50 },
      { id: "scallion_greens", g: 10 }, { id: "ginger", g: 5 }, { id: "soy_sauce_low_na", g: 4 },
    ],
    steps: [
      "Simmer rice with broth, 200 ml water and sliced ginger for 30 minutes, stirring often.",
      "Stir in a beaten egg in a thin stream.",
      "Top with scallion greens and a few drops of soy sauce.",
    ],
    tags: ["comfort"],
  },
  {
    id: "berry-smoothie-bowl", title: "Berry smoothie bowl", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "lf_greek_yogurt", g: 150 }, { id: "blueberries", g: 80 }, { id: "banana", g: 35 },
      { id: "almond_milk", g: 80 }, { id: "chia_seeds", g: 10 }, { id: "rolled_oats", g: 20 },
    ],
    steps: ["Blend yogurt, blueberries, banana and almond milk until thick.", "Top with oats and chia seeds."],
    tags: ["vegetarian", "no-cook"],
  },
  {
    id: "french-toast-berries", title: "Cinnamon French toast with strawberries", slots: ["breakfast"], servings: 1, prepMin: 12,
    ingredients: [
      { id: "white_bread", g: 48 }, { id: "sourdough", g: 20 }, { id: "egg", g: 50 }, { id: "lactose_free_milk", g: 40 },
      { id: "butter", g: 8 }, { id: "strawberries", g: 65 }, { id: "maple_syrup", g: 8 }, { id: "cinnamon", g: 1 },
    ],
    steps: [
      "Whisk egg, milk and cinnamon; soak the bread slices briefly.",
      "Cook in butter over medium heat, 2–3 minutes per side.",
      "Serve with sliced strawberries and maple syrup.",
    ],
    tags: ["vegetarian", "renal-friendly"],
  },
  {
    id: "quinoa-breakfast-bowl", title: "Cinnamon quinoa breakfast bowl", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "quinoa", g: 40 }, { id: "almond_milk", g: 150 }, { id: "blueberries", g: 60 },
      { id: "almonds", g: 10 }, { id: "cinnamon", g: 1 },
    ],
    steps: [
      "Rinse quinoa; simmer in almond milk with cinnamon for 12–15 minutes until tender.",
      "Top with blueberries and chopped almonds.",
    ],
    tags: ["vegetarian"],
  },
  {
    id: "rice-flour-crepes-blueberries", title: "Rice-flour crêpes with blueberries & maple", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "rice_flour", g: 45 }, { id: "egg", g: 50 }, { id: "lactose_free_milk", g: 80 },
      { id: "butter", g: 8 }, { id: "blueberries", g: 60 }, { id: "maple_syrup", g: 8 },
    ],
    steps: [
      "Whisk rice flour, egg and milk into a thin batter; rest 5 minutes.",
      "Melt a little butter in a non-stick pan and cook thin crêpes about 1 minute per side.",
      "Fill with blueberries and drizzle with maple syrup.",
    ],
    tags: ["low-fodmap", "renal-friendly", "gluten-free"],
  },
  {
    id: "polenta-fried-egg-chives", title: "Soft polenta with a fried egg & chives", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "cornmeal", g: 45 }, { id: "egg", g: 50 }, { id: "butter", g: 8 },
      { id: "parmesan", g: 5 }, { id: "chives", g: 3 }, { id: "black_pepper", g: 0.3 },
    ],
    steps: [
      "Whisk cornmeal into 200 ml simmering water; cook, stirring, for 8–10 minutes until thick.",
      "Stir in half the butter and the parmesan.",
      "Fry the egg in the remaining butter and serve on the polenta with chives and pepper.",
    ],
    tags: ["low-fodmap", "renal-friendly", "gluten-free"],
  },
  {
    id: "cinnamon-rice-porridge-macadamia", title: "Creamy cinnamon rice porridge with strawberries & macadamias", slots: ["breakfast"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "white_rice", g: 45 }, { id: "lactose_free_milk", g: 150 }, { id: "butter", g: 8 },
      { id: "cinnamon", g: 0.5 }, { id: "strawberries", g: 50 }, { id: "macadamia", g: 10 },
    ],
    steps: [
      "Simmer rice in 150 ml water until absorbed, then add milk and cinnamon and cook 8 minutes more until creamy.",
      "Stir in butter.",
      "Top with sliced strawberries and chopped macadamias.",
    ],
    tags: ["low-fodmap", "renal-friendly", "energy-dense"],
  },
  {
    id: "avocado-egg-sourdough", title: "Avocado & egg sourdough toast", slots: ["breakfast"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "sourdough", g: 60 }, { id: "avocado", g: 25 }, { id: "egg", g: 50 },
      { id: "lemon_juice", g: 3 }, { id: "chili_flakes", g: 0.2 }, { id: "olive_oil", g: 3 },
    ],
    steps: [
      "Toast the sourdough.",
      "Mash avocado with lemon juice and spread on the toast.",
      "Top with a poached or fried egg and a pinch of chili flakes.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "tofu-pepper-scramble-tortillas", title: "Tofu & pepper scramble with warm corn tortillas", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "tofu_firm", g: 100 }, { id: "corn_tortilla", g: 60 }, { id: "red_pepper", g: 30 }, { id: "spinach", g: 20 },
      { id: "cumin", g: 0.5 }, { id: "olive_oil", g: 8 }, { id: "chives", g: 3 },
    ],
    steps: [
      "Crumble tofu into hot oil with cumin; cook 4 minutes.",
      "Add diced pepper and spinach and cook until wilted.",
      "Warm the tortillas and fill with the scramble; top with chives.",
    ],
    tags: ["vegan", "low-fodmap", "gluten-free"],
  },
  {
    id: "banana-rice-flour-pancakes", title: "Banana rice-flour pancakes", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "rice_flour", g: 35 }, { id: "banana", g: 30 }, { id: "egg", g: 50 },
      { id: "lactose_free_milk", g: 60 }, { id: "canola_oil", g: 8 }, { id: "maple_syrup", g: 8 }, { id: "cinnamon", g: 0.3 },
    ],
    steps: [
      "Mash the banana and whisk with egg, milk, rice flour and cinnamon.",
      "Cook small pancakes in a lightly oiled pan, 2 minutes per side.",
      "Serve with maple syrup.",
    ],
    tags: ["low-fodmap", "gluten-free", "renal-friendly"],
  },
  {
    id: "spinach-brie-omelette-toast", title: "Spinach & brie omelette with sourdough", slots: ["breakfast"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "egg", g: 100 }, { id: "spinach", g: 30 }, { id: "brie", g: 20 },
      { id: "butter", g: 5 }, { id: "sourdough", g: 60 }, { id: "black_pepper", g: 0.3 },
    ],
    steps: [
      "Wilt the spinach in the butter.",
      "Pour in beaten eggs, cook until nearly set, then add sliced brie and fold.",
      "Serve with toasted sourdough.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "kiwi-pecan-yogurt-bowl", title: "Kiwi & pecan yogurt bowl with toasted oats", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "lf_greek_yogurt", g: 150 }, { id: "kiwi", g: 75 }, { id: "pecans", g: 10 },
      { id: "rolled_oats", g: 25 }, { id: "maple_syrup", g: 5 },
    ],
    steps: [
      "Toast oats in a dry pan for 3 minutes until fragrant.",
      "Spoon yogurt into a bowl and top with sliced kiwi, oats, chopped pecans and maple syrup.",
    ],
    tags: ["low-fodmap", "high-fibre"],
  },
  {
    id: "egg-white-cups-cantaloupe", title: "Baked egg-white veggie cups with toast & cantaloupe", slots: ["breakfast"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "egg_white", g: 120 }, { id: "egg", g: 50 }, { id: "red_pepper", g: 30 },
      { id: "chives", g: 3 }, { id: "olive_oil", g: 3 }, { id: "gf_bread", g: 50 }, { id: "cantaloupe", g: 80 },
    ],
    steps: [
      "Whisk egg whites and egg with diced pepper and chives.",
      "Pour into 4 oiled muffin cups and bake at 180 °C for 18 minutes.",
      "Serve with toast and cantaloupe wedges.",
    ],
    tags: ["high-protein", "low-fodmap", "renal-friendly"],
  },
  {
    id: "cornmeal-blueberry-pancakes", title: "Cornmeal blueberry pancakes", slots: ["breakfast"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "cornmeal", g: 30 }, { id: "rice_flour", g: 15 }, { id: "egg", g: 50 },
      { id: "lactose_free_milk", g: 70 }, { id: "butter", g: 8 }, { id: "blueberries", g: 60 },
    ],
    steps: [
      "Separate the egg; whisk the yolk with milk, cornmeal and rice flour and rest 5 minutes.",
      "Beat the white to soft peaks and fold in (no baking powder needed).",
      "Cook in butter, scattering blueberries on each pancake before flipping.",
    ],
    tags: ["low-fodmap", "gluten-free", "renal-friendly"],
  },
  {
    id: "brie-jam-sourdough", title: "Brie & strawberry jam on sourdough", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [{ id: "sourdough", g: 60 }, { id: "brie", g: 25 }, { id: "strawberry_jam", g: 10 }],
    steps: ["Toast the sourdough.", "Top with sliced brie and a thin layer of jam; warm under the grill for 1 minute if you like."],
    tags: ["low-fodmap", "renal-friendly"],
  },
  {
    id: "turkey-egg-breakfast-sandwich", title: "Turkey patty & egg breakfast sandwich", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "ground_turkey", g: 50 }, { id: "egg", g: 50 }, { id: "sourdough", g: 60 },
      { id: "romaine", g: 10 }, { id: "olive_oil", g: 4 }, { id: "paprika", g: 0.3 }, { id: "black_pepper", g: 0.3 },
    ],
    steps: [
      "Season turkey with paprika and pepper (no salt) and shape into a thin patty.",
      "Cook in oil for 3–4 minutes per side; fry the egg in the same pan.",
      "Sandwich patty, egg and lettuce in toasted sourdough.",
    ],
    tags: ["low-fodmap", "high-protein"],
  },
  {
    id: "sweet-potato-egg-hash", title: "Sweet potato, pepper & egg hash", slots: ["breakfast"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "sweet_potato", g: 70 }, { id: "egg", g: 100 }, { id: "red_pepper", g: 30 },
      { id: "chives", g: 3 }, { id: "olive_oil", g: 8 }, { id: "sourdough", g: 30 }, { id: "paprika", g: 0.5 },
    ],
    steps: [
      "Dice sweet potato small and fry in oil for 8–10 minutes until tender.",
      "Add pepper and paprika for 2 minutes.",
      "Make two wells, crack in the eggs, cover and cook until set. Serve with toast.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "pb-rice-cakes-yogurt-berries", title: "Peanut butter rice cakes with yogurt & strawberries", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "rice_cakes", g: 27 }, { id: "peanut_butter", g: 15 }, { id: "lf_greek_yogurt", g: 100 }, { id: "strawberries", g: 40 },
    ],
    steps: ["Spread peanut butter on the rice cakes.", "Serve with yogurt topped with sliced strawberries."],
    tags: ["low-fodmap", "gluten-free", "no-cook"],
  },
  {
    id: "egg-white-omelette-hash-browns", title: "Herbed egg-white omelette with leached hash browns", slots: ["breakfast"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "egg_white", g: 120 }, { id: "egg", g: 50 }, { id: "potato", g: 180, leached: true },
      { id: "canola_oil", g: 10 }, { id: "chives", g: 3 }, { id: "parsley", g: 2 },
    ],
    steps: [
      "Leach the potato: grate, soak in warm water 2 hours, then boil in fresh water 5 minutes, drain and squeeze dry. (Can be done the night before.)",
      "Fry the potato in most of the oil as a flat cake, 5 minutes per side.",
      "Whisk egg whites, egg and herbs and cook as an omelette in the remaining oil.",
    ],
    tags: ["high-protein", "renal-friendly", "low-fodmap", "gluten-free"],
  },
  {
    id: "blueberry-cream-cheese-toast", title: "Blueberry & cream cheese sourdough toast", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [{ id: "sourdough", g: 60 }, { id: "cream_cheese", g: 20 }, { id: "blueberries", g: 50 }, { id: "cinnamon", g: 0.2 }],
    steps: ["Toast the sourdough.", "Spread with cream cheese, top with blueberries and a pinch of cinnamon."],
    tags: ["low-fodmap", "renal-friendly", "no-cook"],
  },
  {
    id: "cinnamon-polenta-porridge-raspberries", title: "Cinnamon polenta porridge with raspberries", slots: ["breakfast"], servings: 1, prepMin: 12,
    ingredients: [
      { id: "cornmeal", g: 45 }, { id: "lactose_free_milk", g: 150 }, { id: "cinnamon", g: 0.5 },
      { id: "maple_syrup", g: 6 }, { id: "raspberries", g: 40 }, { id: "butter", g: 5 },
    ],
    steps: [
      "Whisk cornmeal into the milk and 100 ml water; simmer, stirring, for 8 minutes.",
      "Stir in butter and cinnamon.",
      "Top with raspberries and maple syrup.",
    ],
    tags: ["low-fodmap", "gluten-free", "renal-friendly"],
  },
  {
    id: "egg-cheese-tortilla-quesadilla", title: "Egg & cheddar corn-tortilla quesadilla with salsa", slots: ["breakfast"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "corn_tortilla", g: 65 }, { id: "egg", g: 50 }, { id: "cheddar", g: 15 },
      { id: "tomato", g: 50 }, { id: "cilantro", g: 3 }, { id: "lemon_juice", g: 3 }, { id: "olive_oil", g: 3 },
    ],
    steps: [
      "Scramble the egg in oil.",
      "Fill tortillas with egg and grated cheddar; toast in a dry pan until the cheese melts.",
      "Serve with diced tomato mixed with cilantro and lemon juice.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "rice-egg-spinach-bowl", title: "Breakfast rice bowl with egg, spinach & carrot", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "white_rice", g: 45 }, { id: "egg", g: 50 }, { id: "spinach", g: 40 }, { id: "carrot", g: 30 },
      { id: "garlic_oil", g: 6 }, { id: "soy_sauce_low_na", g: 4 }, { id: "scallion_greens", g: 5 },
    ],
    steps: [
      "Use cooked rice (leftover is ideal) and warm it through.",
      "Stir-fry grated carrot and spinach in garlic oil for 2 minutes.",
      "Top rice with vegetables and a fried egg; season with soy sauce and scallion greens.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "mandarin-macadamia-yogurt-rice-cakes", title: "Mandarin & macadamia yogurt with rice cakes", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "lf_greek_yogurt", g: 120 }, { id: "mandarin", g: 75 }, { id: "macadamia", g: 12 },
      { id: "rice_cakes", g: 18 }, { id: "maple_syrup", g: 5 },
    ],
    steps: ["Segment the mandarin over the yogurt.", "Top with chopped macadamias and maple syrup; serve with rice cakes."],
    tags: ["low-fodmap", "gluten-free", "no-cook"],
  },
  {
    id: "savory-chive-crepes", title: "Savoury chive & egg-white crêpes with spinach", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "rice_flour", g: 40 }, { id: "egg_white", g: 90 }, { id: "egg", g: 25 }, { id: "lactose_free_milk", g: 50 },
      { id: "chives", g: 4 }, { id: "spinach", g: 20 }, { id: "canola_oil", g: 6 },
    ],
    steps: [
      "Whisk rice flour, egg white, egg, milk and chopped chives into a batter.",
      "Cook thin crêpes in a lightly oiled pan.",
      "Fill with quickly wilted spinach and fold.",
    ],
    tags: ["high-protein", "renal-friendly", "low-fodmap", "gluten-free"],
  },
  {
    id: "pineapple-ginger-yogurt-toast", title: "Ginger-pineapple yogurt with buttered toast", slots: ["breakfast"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "lf_greek_yogurt", g: 120 }, { id: "pineapple", g: 80 }, { id: "ginger", g: 2 },
      { id: "gf_bread", g: 45 }, { id: "butter", g: 6 },
    ],
    steps: ["Dice pineapple and toss with finely grated ginger.", "Spoon over yogurt; serve with buttered toast."],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "coconut-rice-porridge-macadamia", title: "Coconut rice porridge with macadamias & strawberries", slots: ["breakfast"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "white_rice", g: 45 }, { id: "coconut_milk", g: 50 }, { id: "macadamia", g: 15 },
      { id: "strawberries", g: 40 }, { id: "maple_syrup", g: 5 },
    ],
    steps: [
      "Simmer rice in 250 ml water until soft and creamy, about 20 minutes.",
      "Stir in coconut milk and maple syrup.",
      "Top with sliced strawberries and chopped macadamias.",
    ],
    tags: ["energy-dense", "renal-friendly", "low-fodmap", "vegan"],
  },
  {
    id: "crepes-whipped-cream-raspberries", title: "Rice-flour crêpes with whipped cream & raspberries", slots: ["breakfast"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "rice_flour", g: 45 }, { id: "egg_white", g: 30 }, { id: "lactose_free_milk", g: 60 },
      { id: "canola_oil", g: 8 }, { id: "heavy_cream", g: 30 }, { id: "raspberries", g: 40 },
    ],
    steps: [
      "Whisk rice flour, egg white and milk into a thin batter.",
      "Cook thin crêpes in a lightly oiled pan.",
      "Fill with softly whipped cream and raspberries.",
    ],
    tags: ["energy-dense", "renal-friendly", "low-fodmap", "gluten-free"],
  },
];
