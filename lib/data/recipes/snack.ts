import type { Recipe } from "@/lib/domain/types";

export const SNACKS: Recipe[] = [
  {
    id: "apple-peanut-butter", title: "Apple slices with peanut butter", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "apple", g: 120 }, { id: "peanut_butter", g: 15 }],
    steps: ["Slice the apple and serve with peanut butter."],
  },
  {
    id: "rice-cakes-cream-cheese-strawberry", title: "Rice cakes with cream cheese & strawberries", slots: ["snack"], servings: 1, prepMin: 3,
    ingredients: [{ id: "rice_cakes", g: 18 }, { id: "cream_cheese", g: 15 }, { id: "strawberries", g: 50 }],
    steps: ["Spread rice cakes with cream cheese and top with sliced strawberries."],
    tags: ["renal-friendly"],
  },
  {
    id: "yogurt-blueberries", title: "Greek yogurt with blueberries", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "lf_greek_yogurt", g: 120 }, { id: "blueberries", g: 60 }],
    steps: ["Top yogurt with blueberries."],
  },
  {
    id: "veggies-herb-dip", title: "Carrot & cucumber sticks with herbed cream cheese", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [{ id: "carrot", g: 60 }, { id: "cucumber", g: 80 }, { id: "cream_cheese", g: 25 }, { id: "dill", g: 0.5 }, { id: "rice_cakes", g: 9 }],
    steps: ["Mix cream cheese with dill and a splash of water.", "Serve with vegetable sticks and a rice cake."],
    tags: ["renal-friendly"],
  },
  {
    id: "egg-grapes", title: "Hard-boiled egg & grapes", slots: ["snack"], servings: 1, prepMin: 12,
    ingredients: [{ id: "egg", g: 50 }, { id: "grapes", g: 100 }],
    steps: ["Boil the egg for 9 minutes, cool in cold water and peel.", "Serve with grapes."],
  },
  {
    id: "walnuts-orange", title: "Orange & walnuts", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "walnuts", g: 15 }, { id: "orange", g: 130 }],
    steps: ["Peel and segment the orange; serve with walnuts."],
  },
  {
    id: "air-popped-popcorn", title: "Unsalted air-popped popcorn with cinnamon", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [{ id: "popcorn_kernels", g: 22 }, { id: "olive_oil", g: 3 }, { id: "cinnamon", g: 0.5 }],
    steps: ["Air-pop the kernels.", "Toss with a little oil and cinnamon — no salt."],
    tags: ["renal-friendly", "vegan"],
  },
  {
    id: "rice-cakes-peanut-butter", title: "Rice cakes with peanut butter", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "rice_cakes", g: 18 }, { id: "peanut_butter", g: 16 }],
    steps: ["Spread peanut butter on the rice cakes."],
    tags: ["vegan"],
  },
  {
    id: "almonds-strawberries", title: "Strawberries & almonds", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "almonds", g: 12 }, { id: "strawberries", g: 65 }, { id: "rice_cakes", g: 9 }],
    steps: ["Serve strawberries with almonds and a rice cake."],
    tags: ["vegan"],
  },
  {
    id: "mini-chia-pudding", title: "Mini raspberry chia pudding", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [{ id: "chia_seeds", g: 15 }, { id: "almond_milk", g: 120 }, { id: "raspberries", g: 50 }, { id: "maple_syrup", g: 5 }],
    steps: ["Whisk chia, almond milk and maple syrup; chill at least 2 hours.", "Top with raspberries."],
    tags: ["vegan", "make-ahead"],
  },
  {
    id: "tomato-olive-oil-toast", title: "Tomato & olive-oil sourdough toast", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [{ id: "sourdough", g: 40 }, { id: "olive_oil", g: 8 }, { id: "tomato", g: 50 }, { id: "oregano", g: 0.3 }],
    steps: ["Toast the bread, drizzle with olive oil.", "Rub or top with ripe tomato and a pinch of oregano — no salt."],
    tags: ["vegan", "renal-friendly"],
  },
  {
    id: "pineapple-cream-cheese-toast", title: "Pineapple cream-cheese toast", slots: ["snack"], servings: 1, prepMin: 4,
    ingredients: [{ id: "white_bread", g: 24 }, { id: "cream_cheese", g: 15 }, { id: "pineapple", g: 60 }],
    steps: ["Toast the bread, spread cream cheese and top with diced pineapple."],
    tags: ["renal-friendly"],
  },
  {
    id: "macadamia-mandarin", title: "Mandarin & macadamias", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "macadamia", g: 15 }, { id: "mandarin", g: 75 }],
    steps: ["Peel the mandarin and serve with the macadamias."],
    tags: ["low-fodmap", "renal-friendly", "energy-dense", "no-cook"],
  },
  {
    id: "cucumber-brie-rice-cake", title: "Brie & cucumber on a rice cake", slots: ["snack"], servings: 1, prepMin: 3,
    ingredients: [{ id: "brie", g: 20 }, { id: "cucumber", g: 60 }, { id: "rice_cakes", g: 9 }],
    steps: ["Top the rice cake with sliced brie and cucumber rounds; serve the extra cucumber alongside."],
    tags: ["low-fodmap", "renal-friendly", "no-cook"],
  },
  {
    id: "cantaloupe-yogurt", title: "Cantaloupe with yogurt & cinnamon", slots: ["snack"], servings: 1, prepMin: 3,
    ingredients: [{ id: "cantaloupe", g: 100 }, { id: "lf_greek_yogurt", g: 80 }, { id: "cinnamon", g: 0.2 }],
    steps: ["Cube the melon and serve over yogurt with a pinch of cinnamon."],
    tags: ["low-fodmap", "no-cook"],
  },
  {
    id: "kiwi-pecans", title: "Kiwi & pecans", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "kiwi", g: 75 }, { id: "pecans", g: 10 }],
    steps: ["Halve the kiwi and scoop out; serve with pecans."],
    tags: ["low-fodmap", "vegan", "no-cook"],
  },
  {
    id: "rice-cakes-jam-cream-cheese", title: "Rice cakes with cream cheese & jam", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "rice_cakes", g: 18 }, { id: "cream_cheese", g: 15 }, { id: "strawberry_jam", g: 10 }],
    steps: ["Spread rice cakes with cream cheese and a thin layer of jam."],
    tags: ["low-fodmap", "renal-friendly", "no-cook"],
  },
  {
    id: "egg-white-pepper-bites", title: "Egg-white & pepper bites with rice cakes", slots: ["snack"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "egg_white", g: 90 }, { id: "red_pepper", g: 30 }, { id: "chives", g: 2 },
      { id: "olive_oil", g: 3 }, { id: "rice_cakes", g: 18 },
    ],
    steps: ["Whisk egg whites with diced pepper and chives; bake in oiled mini-muffin cups at 180 °C for 12 minutes.", "Serve with rice cakes. Keeps 3 days in the fridge."],
    tags: ["high-protein", "renal-friendly", "low-fodmap", "make-ahead"],
  },
  {
    id: "devilled-eggs-cucumber", title: "Devilled eggs with cucumber & a rice cake", slots: ["snack"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "egg", g: 50 }, { id: "mayonnaise", g: 8 }, { id: "paprika", g: 0.2 }, { id: "chives", g: 1 },
      { id: "cucumber", g: 50 }, { id: "rice_cakes", g: 9 },
    ],
    steps: ["Halve a hard-boiled egg, mash the yolk with mayonnaise and spoon back in.", "Dust with paprika and chives; serve with cucumber and a rice cake."],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "strawberries-cream-macadamia", title: "Strawberries & whipped cream with macadamias", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [{ id: "strawberries", g: 60 }, { id: "heavy_cream", g: 30 }, { id: "macadamia", g: 8 }],
    steps: ["Whip the cream to soft peaks (no sugar needed).", "Spoon over sliced strawberries and scatter with chopped macadamias."],
    tags: ["low-fodmap", "renal-friendly", "energy-dense"],
  },
  {
    id: "pineapple-macadamia", title: "Pineapple & macadamias", slots: ["snack"], servings: 1, prepMin: 3,
    ingredients: [{ id: "pineapple", g: 95 }, { id: "macadamia", g: 12 }],
    steps: ["Cut the pineapple into chunks and serve with macadamias."],
    tags: ["low-fodmap", "renal-friendly", "vegan", "no-cook"],
  },
  {
    id: "baked-tortilla-chips-salsa", title: "Baked corn tortilla chips with fresh salsa", slots: ["snack"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "corn_tortilla", g: 30 }, { id: "olive_oil", g: 4 }, { id: "tomato", g: 50 },
      { id: "cilantro", g: 2 }, { id: "lemon_juice", g: 5 },
    ],
    steps: ["Cut tortillas into wedges, brush with oil and bake at 190 °C for 8–10 minutes (no salt).", "Serve with diced tomato mixed with cilantro and lemon."],
    tags: ["low-fodmap", "vegan", "gluten-free"],
  },
  {
    id: "chicken-cucumber-roll-ups", title: "Chicken & cream cheese cucumber roll-ups", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [{ id: "chicken_breast", g: 40 }, { id: "cucumber", g: 60 }, { id: "cream_cheese", g: 15 }, { id: "rice_cakes", g: 9 }],
    steps: ["Slice cucumber lengthways into ribbons.", "Spread with cream cheese, add a strip of cooked chicken and roll up. Serve with a rice cake."],
    tags: ["low-fodmap", "high-protein"],
  },
  {
    id: "radish-cucumber-sour-cream-dip", title: "Radish & cucumber with herbed sour-cream dip", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "radish", g: 50 }, { id: "cucumber", g: 50 }, { id: "sour_cream", g: 30 },
      { id: "chives", g: 2 }, { id: "dill", g: 0.3 }, { id: "rice_cakes", g: 18 },
    ],
    steps: ["Stir chives and dill into the sour cream.", "Serve with radishes, cucumber sticks and rice cakes."],
    tags: ["low-fodmap", "renal-friendly", "vegetarian"],
  },
  {
    id: "tuna-mayo-rice-cakes", title: "Tuna mayo rice cakes", slots: ["snack"], servings: 1, prepMin: 3,
    ingredients: [{ id: "tuna_canned", g: 40 }, { id: "mayonnaise", g: 8 }, { id: "rice_cakes", g: 18 }, { id: "cucumber", g: 20 }],
    steps: ["Mix drained tuna with mayonnaise.", "Spoon onto rice cakes and top with cucumber slices."],
    tags: ["low-fodmap", "high-protein", "gluten-free"],
  },
  {
    id: "grapes-brie", title: "Grapes & brie", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "grapes", g: 80 }, { id: "brie", g: 20 }],
    steps: ["Serve grapes with a wedge of brie."],
    tags: ["low-fodmap", "renal-friendly", "no-cook"],
  },
  {
    id: "raspberry-yogurt-macadamia", title: "Raspberry yogurt with macadamias", slots: ["snack"], servings: 1, prepMin: 2,
    ingredients: [{ id: "lf_greek_yogurt", g: 100 }, { id: "raspberries", g: 50 }, { id: "macadamia", g: 8 }],
    steps: ["Top yogurt with raspberries and chopped macadamias."],
    tags: ["low-fodmap", "no-cook"],
  },
  {
    id: "cinnamon-butter-toast", title: "Cinnamon butter toast", slots: ["snack"], servings: 1, prepMin: 4,
    ingredients: [{ id: "sourdough", g: 40 }, { id: "butter", g: 8 }, { id: "cinnamon", g: 0.3 }, { id: "maple_syrup", g: 4 }],
    steps: ["Toast the sourdough and spread with butter.", "Dust with cinnamon and drizzle a little maple syrup."],
    tags: ["low-fodmap", "renal-friendly", "energy-dense"],
  },
  {
    id: "veggie-sticks-herb-mayo", title: "Carrot & pepper sticks with herb-mayo dip", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [
      { id: "carrot", g: 60 }, { id: "red_pepper", g: 40 }, { id: "mayonnaise", g: 10 },
      { id: "dill", g: 0.3 }, { id: "lemon_juice", g: 3 }, { id: "rice_cakes", g: 9 },
    ],
    steps: ["Mix mayonnaise with dill and lemon juice.", "Serve with vegetable sticks and a rice cake."],
    tags: ["low-fodmap", "renal-friendly", "gluten-free"],
  },
  {
    id: "parmesan-polenta-bites", title: "Crispy parmesan polenta bites", slots: ["snack"], servings: 2, prepMin: 30,
    ingredients: [{ id: "cornmeal", g: 40 }, { id: "parmesan", g: 10 }, { id: "butter", g: 10 }, { id: "chives", g: 3 }, { id: "olive_oil", g: 6 }],
    steps: [
      "Cook cornmeal in 180 ml water for 10 minutes; stir in butter, parmesan and chives.",
      "Spread 1 cm thick on a tray and chill until firm.",
      "Cut into squares, brush with oil and bake at 220 °C for 15 minutes until crisp.",
    ],
    tags: ["low-fodmap", "renal-friendly", "gluten-free", "make-ahead"],
  },
  {
    id: "frozen-yogurt-berry-bark", title: "Frozen yogurt & blueberry bark", slots: ["snack"], servings: 1, prepMin: 5,
    ingredients: [{ id: "lf_greek_yogurt", g: 100 }, { id: "blueberries", g: 30 }, { id: "maple_syrup", g: 5 }, { id: "macadamia", g: 6 }],
    steps: [
      "Stir maple syrup into the yogurt and spread thinly on a lined tray.",
      "Scatter with blueberries and chopped macadamias; freeze 2 hours and break into pieces.",
    ],
    tags: ["low-fodmap", "make-ahead"],
  },
];
