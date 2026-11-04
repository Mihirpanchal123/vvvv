import type { Recipe } from "@/lib/domain/types";

export const LUNCHES: Recipe[] = [
  {
    id: "chicken-rice-bowl", title: "Ginger chicken & rice bowl", slots: ["lunch", "dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "chicken_breast", g: 100 }, { id: "white_rice", g: 60 }, { id: "zucchini", g: 60 },
      { id: "carrot", g: 50 }, { id: "garlic_oil", g: 10 }, { id: "soy_sauce_low_na", g: 8 },
      { id: "scallion_greens", g: 10 }, { id: "ginger", g: 4 },
    ],
    steps: [
      "Cook rice according to the package (no salt).",
      "Stir-fry sliced chicken in garlic-infused oil with grated ginger until cooked through.",
      "Add sliced zucchini and carrot; cook 4 minutes.",
      "Season with soy sauce and serve over rice with scallion greens.",
    ],
    tags: ["renal-friendly", "low-fodmap"],
  },
  {
    id: "tuna-sandwich", title: "Lemony tuna salad sandwich", slots: ["lunch"], servings: 1, prepMin: 8,
    ingredients: [
      { id: "tuna_canned", g: 80 }, { id: "lf_greek_yogurt", g: 30 }, { id: "lemon_juice", g: 5 },
      { id: "white_bread", g: 24 }, { id: "sourdough", g: 35 }, { id: "romaine", g: 20 }, { id: "cucumber", g: 40 },
      { id: "black_pepper", g: 0.5 },
    ],
    steps: [
      "Mix tuna with yogurt, lemon juice and black pepper.",
      "Layer on bread with lettuce and cucumber.",
    ],
    tags: ["quick", "renal-friendly"],
  },
  {
    id: "quinoa-feta-salad", title: "Mediterranean quinoa & chickpea salad", slots: ["lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "quinoa", g: 50 }, { id: "cucumber", g: 60 }, { id: "tomato", g: 60 }, { id: "feta", g: 20 },
      { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 10 }, { id: "parsley", g: 5 }, { id: "chickpeas_canned", g: 40 },
    ],
    steps: [
      "Cook quinoa and cool.",
      "Toss with diced cucumber, tomato, rinsed chickpeas and parsley.",
      "Dress with olive oil and lemon; crumble feta on top.",
    ],
    tags: ["vegetarian", "make-ahead"],
  },
  {
    id: "turkey-lettuce-wraps", title: "Turkey lettuce wraps with rice", slots: ["lunch", "dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "ground_turkey", g: 100 }, { id: "white_rice", g: 50 }, { id: "romaine", g: 60 }, { id: "carrot", g: 40 },
      { id: "garlic_oil", g: 8 }, { id: "ginger", g: 5 }, { id: "soy_sauce_low_na", g: 8 }, { id: "rice_vinegar", g: 5 },
    ],
    steps: [
      "Cook rice.",
      "Brown turkey in garlic-infused oil with grated ginger and shredded carrot.",
      "Season with soy sauce and rice vinegar.",
      "Spoon rice and turkey into lettuce leaves.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "lentil-soup", title: "Hearty lentil & tomato soup", slots: ["lunch", "dinner"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "lentils_canned", g: 120 }, { id: "carrot", g: 60 }, { id: "onion", g: 40 }, { id: "garlic", g: 5 },
      { id: "canned_tomatoes", g: 100 }, { id: "chicken_broth_low_na", g: 250 }, { id: "olive_oil", g: 8 },
      { id: "cumin", g: 2 }, { id: "sourdough", g: 30 },
    ],
    steps: [
      "Sauté onion, garlic and carrot in oil for 6 minutes.",
      "Add cumin, tomatoes, broth and rinsed lentils; simmer 20 minutes.",
      "Serve with a slice of sourdough.",
    ],
    tags: ["high-fibre"],
  },
  {
    id: "chicken-caesar-salad", title: "Chicken Caesar-style salad with yogurt dressing", slots: ["lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "chicken_breast", g: 90 }, { id: "romaine", g: 100 }, { id: "parmesan", g: 8 },
      { id: "lf_greek_yogurt", g: 30 }, { id: "lemon_juice", g: 10 }, { id: "olive_oil", g: 8 },
      { id: "sourdough", g: 50 }, { id: "dijon", g: 3 },
    ],
    steps: [
      "Grill or pan-fry chicken; slice.",
      "Cube and toast sourdough with half the oil to make croutons.",
      "Whisk yogurt, lemon, mustard and remaining oil; toss with romaine.",
      "Top with chicken, croutons and parmesan.",
    ],
  },
  {
    id: "egg-fried-rice", title: "Vegetable egg fried rice", slots: ["lunch", "dinner"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "white_rice", g: 60 }, { id: "egg", g: 100 }, { id: "carrot", g: 40 }, { id: "green_beans", g: 50 },
      { id: "scallion_greens", g: 15 }, { id: "garlic_oil", g: 10 }, { id: "soy_sauce_low_na", g: 8 },
    ],
    steps: [
      "Use day-old cooked rice if possible.",
      "Scramble eggs in half the oil; set aside.",
      "Stir-fry carrot and green beans in remaining oil, add rice and eggs.",
      "Season with soy sauce and scallion greens.",
    ],
    tags: ["vegetarian", "low-fodmap"],
  },
  {
    id: "shrimp-tacos", title: "Shrimp tacos with cabbage slaw", slots: ["lunch", "dinner"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "corn_tortilla", g: 60 }, { id: "shrimp", g: 100 }, { id: "cabbage", g: 50 }, { id: "lemon_juice", g: 10 },
      { id: "avocado", g: 25 }, { id: "olive_oil", g: 5 }, { id: "paprika", g: 1 }, { id: "cumin", g: 1 },
    ],
    steps: [
      "Toss shrimp with paprika and cumin; sear in oil 2 minutes per side.",
      "Shred cabbage and toss with lemon juice.",
      "Fill warm tortillas with shrimp, slaw and avocado.",
    ],
  },
  {
    id: "chicken-pasta-salad", title: "Chicken & pepper pasta salad", slots: ["lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "gf_pasta", g: 60 }, { id: "chicken_breast", g: 70 }, { id: "cucumber", g: 50 },
      { id: "red_pepper", g: 40 }, { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 10 }, { id: "oregano", g: 0.5 },
    ],
    steps: [
      "Cook pasta, rinse under cold water.",
      "Cook and dice chicken.",
      "Toss with diced cucumber and pepper, oil, lemon and oregano.",
    ],
    tags: ["make-ahead", "low-fodmap"],
  },
  {
    id: "chickpea-spinach-toast", title: "Smashed chickpea & spinach toast", slots: ["lunch"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "chickpeas_canned", g: 80 }, { id: "spinach", g: 40 }, { id: "lemon_juice", g: 10 },
      { id: "olive_oil", g: 8 }, { id: "sourdough", g: 60 }, { id: "tomato", g: 50 },
    ],
    steps: [
      "Smash chickpeas with lemon juice and half the oil.",
      "Wilt spinach in remaining oil.",
      "Pile onto toasted sourdough with sliced tomato.",
    ],
    tags: ["vegan", "high-fibre"],
  },
  {
    id: "rice-noodle-tofu-salad", title: "Cold rice-noodle salad with tofu & peanut dressing", slots: ["lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "rice_noodles", g: 55 }, { id: "carrot", g: 40 }, { id: "cucumber", g: 60 }, { id: "tofu_firm", g: 100 },
      { id: "peanut_butter", g: 15 }, { id: "soy_sauce_low_na", g: 8 }, { id: "lemon_juice", g: 10 },
    ],
    steps: [
      "Soak or cook noodles; rinse cold.",
      "Pan-fry cubed tofu until golden.",
      "Whisk peanut butter, soy sauce, lemon juice and 2 tbsp warm water.",
      "Toss noodles with julienned carrot, cucumber, tofu and dressing.",
    ],
    tags: ["vegan", "low-fodmap"],
  },
  {
    id: "rice-noodle-egg-cabbage", title: "Stir-fried rice noodles with egg & cabbage", slots: ["lunch", "dinner"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "rice_noodles", g: 60 }, { id: "egg", g: 50 }, { id: "cabbage", g: 70 }, { id: "carrot", g: 30 },
      { id: "garlic_oil", g: 12 }, { id: "soy_sauce_low_na", g: 6 }, { id: "maple_syrup", g: 3 }, { id: "scallion_greens", g: 10 },
    ],
    steps: [
      "Soak noodles in hot water until pliable; drain.",
      "Scramble the egg in a little oil and push to the side.",
      "Add remaining oil, shredded cabbage and carrot; stir-fry 3 minutes.",
      "Add noodles, soy sauce and maple syrup; toss until glossy. Finish with scallion greens.",
    ],
    tags: ["vegetarian", "renal-friendly", "low-fodmap"],
  },
  {
    id: "roast-chicken-sandwich", title: "Roast chicken & cream cheese sandwich", slots: ["lunch"], servings: 1, prepMin: 8,
    ingredients: [
      { id: "chicken_breast", g: 80 }, { id: "sourdough", g: 70 }, { id: "romaine", g: 20 },
      { id: "cream_cheese", g: 15 }, { id: "cucumber", g: 40 }, { id: "black_pepper", g: 0.5 },
    ],
    steps: [
      "Use leftover roast chicken (unsalted) or poach a breast for 12 minutes.",
      "Spread bread with cream cheese; layer chicken, lettuce and cucumber.",
    ],
    tags: ["quick", "renal-friendly"],
  },
  {
    id: "chicken-salad-sourdough", title: "Herbed chicken salad sandwich", slots: ["lunch"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "chicken_breast", g: 70 }, { id: "mayonnaise", g: 15 }, { id: "chives", g: 3 },
      { id: "cucumber", g: 30 }, { id: "romaine", g: 15 }, { id: "sourdough", g: 70 },
    ],
    steps: [
      "Dice cooked chicken and cucumber; mix with mayonnaise and chopped chives.",
      "Pile onto sourdough with lettuce.",
    ],
    tags: ["low-fodmap", "renal-friendly"],
  },
  {
    id: "egg-salad-sourdough", title: "Dijon egg salad sandwich", slots: ["lunch"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "egg", g: 100 }, { id: "mayonnaise", g: 12 }, { id: "dijon", g: 3 },
      { id: "chives", g: 3 }, { id: "iceberg", g: 20 }, { id: "sourdough", g: 65 },
    ],
    steps: [
      "Boil eggs 10 minutes, cool and chop.",
      "Mix with mayonnaise, mustard and chives.",
      "Serve on sourdough with shredded lettuce.",
    ],
    tags: ["low-fodmap", "vegetarian"],
  },
  {
    id: "tuna-rice-salad", title: "Tuna, cucumber & pepper rice salad", slots: ["lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "tuna_canned", g: 60 }, { id: "white_rice", g: 50 }, { id: "cucumber", g: 50 }, { id: "red_pepper", g: 30 },
      { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 10 }, { id: "parsley", g: 3 },
    ],
    steps: [
      "Cook rice and cool.",
      "Toss with drained tuna, diced cucumber and pepper.",
      "Dress with oil, lemon juice and parsley.",
    ],
    tags: ["low-fodmap", "renal-friendly", "make-ahead"],
  },
  {
    id: "shrimp-rice-noodle-salad", title: "Shrimp rice-noodle salad with herbs", slots: ["lunch", "dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "shrimp", g: 80 }, { id: "rice_noodles", g: 50 }, { id: "cucumber", g: 50 }, { id: "carrot", g: 30 },
      { id: "bean_sprouts", g: 30 }, { id: "cilantro", g: 3 }, { id: "garlic_oil", g: 10 },
      { id: "rice_vinegar", g: 10 }, { id: "soy_sauce_low_na", g: 5 }, { id: "chili_flakes", g: 0.2 },
    ],
    steps: [
      "Soak or boil the rice noodles per the packet; rinse in cold water.",
      "Cook shrimp in a little of the oil for 2–3 minutes.",
      "Toss noodles, shrimp, shredded vegetables and herbs with oil, vinegar, soy sauce and chili.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "lemon-chicken-couscous-salad", title: "Lemon chicken couscous salad", slots: ["lunch", "dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "couscous", g: 50 }, { id: "chicken_breast", g: 70 }, { id: "cucumber", g: 60 }, { id: "red_pepper", g: 30 },
      { id: "parsley", g: 5 }, { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 10 },
    ],
    steps: [
      "Pour 80 ml boiling water over couscous, cover 5 minutes, then fluff.",
      "Grill or pan-fry the chicken and slice.",
      "Toss couscous with diced vegetables, parsley, oil and lemon; top with chicken.",
    ],
    tags: ["renal-friendly"],
  },
  {
    id: "polenta-roasted-pepper-egg-bowl", title: "Polenta bowl with roasted peppers, zucchini & egg", slots: ["lunch", "dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "cornmeal", g: 50 }, { id: "egg", g: 50 }, { id: "red_pepper", g: 40 }, { id: "zucchini", g: 60 },
      { id: "olive_oil", g: 10 }, { id: "parmesan", g: 5 }, { id: "basil", g: 3 },
    ],
    steps: [
      "Roast sliced pepper and zucchini with half the oil at 210 °C for 15 minutes.",
      "Cook polenta in 220 ml water for 10 minutes; stir in parmesan and the remaining oil.",
      "Top with vegetables, a soft-boiled egg and torn basil.",
    ],
    tags: ["low-fodmap", "renal-friendly", "gluten-free", "vegetarian"],
  },
  {
    id: "leached-potato-egg-salad", title: "Potato & egg salad with dill (leached potatoes)", slots: ["lunch"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "potato", g: 200, leached: true }, { id: "egg", g: 50 }, { id: "mayonnaise", g: 15 },
      { id: "dijon", g: 3 }, { id: "chives", g: 3 }, { id: "cucumber", g: 40 }, { id: "dill", g: 0.5 },
    ],
    steps: [
      "Leach the potatoes: peel, dice, soak in warm water 2 hours, then boil in fresh water until tender; drain.",
      "Boil the egg 10 minutes and chop.",
      "Fold potatoes, egg and cucumber with mayonnaise, mustard, chives and dill. Chill.",
    ],
    tags: ["renal-friendly", "low-fodmap", "gluten-free", "make-ahead"],
  },
  {
    id: "salmon-poke-rice-bowl", title: "Salmon rice bowl with cucumber & avocado", slots: ["lunch", "dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "salmon", g: 90 }, { id: "white_rice", g: 50 }, { id: "cucumber", g: 50 }, { id: "avocado", g: 25 },
      { id: "carrot", g: 20 }, { id: "scallion_greens", g: 5 }, { id: "soy_sauce_low_na", g: 6 }, { id: "rice_vinegar", g: 5 },
    ],
    steps: [
      "Cook rice and season with rice vinegar.",
      "Bake or pan-sear salmon 8–10 minutes; flake into chunks.",
      "Top rice with salmon, cucumber, grated carrot and avocado; drizzle with soy sauce and scallion greens.",
    ],
    tags: ["omega-3", "low-fodmap"],
  },
  {
    id: "lentil-rice-feta-salad", title: "Lentil, brown rice & feta salad", slots: ["lunch"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "lentils_canned", g: 45 }, { id: "brown_rice", g: 35 }, { id: "spinach", g: 30 }, { id: "tomato", g: 40 },
      { id: "feta", g: 15 }, { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 8 }, { id: "cumin", g: 0.3 },
    ],
    steps: [
      "Cook brown rice and cool slightly.",
      "Rinse lentils well (rinsing lowers the FODMAP content).",
      "Toss rice, lentils, spinach and tomato with oil, lemon and cumin; crumble feta over.",
    ],
    tags: ["high-fibre", "vegetarian", "low-fodmap"],
  },
  {
    id: "chickpea-cucumber-feta-salad", title: "Chickpea, cucumber & feta salad with sourdough", slots: ["lunch"], servings: 1, prepMin: 10,
    ingredients: [
      { id: "chickpeas_canned", g: 40 }, { id: "cucumber", g: 60 }, { id: "tomato", g: 40 }, { id: "parsley", g: 4 },
      { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 8 }, { id: "feta", g: 15 }, { id: "sourdough", g: 45 },
    ],
    steps: [
      "Rinse and drain the chickpeas.",
      "Toss with diced cucumber, tomato, parsley, oil and lemon; crumble feta over.",
      "Serve with toasted sourdough.",
    ],
    tags: ["vegetarian", "high-fibre", "low-fodmap", "no-cook"],
  },
  {
    id: "turkey-burger-sourdough", title: "Turkey burger with lettuce & tomato on sourdough", slots: ["lunch", "dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "ground_turkey", g: 90 }, { id: "sourdough", g: 60 }, { id: "iceberg", g: 20 }, { id: "tomato", g: 30 },
      { id: "dijon", g: 5 }, { id: "olive_oil", g: 4 }, { id: "paprika", g: 0.5 },
    ],
    steps: [
      "Season turkey with paprika (no salt) and shape into a patty.",
      "Cook in oil 5 minutes per side until cooked through.",
      "Serve on toasted sourdough with mustard, lettuce and tomato.",
    ],
    tags: ["low-fodmap", "family"],
  },
  {
    id: "chicken-butternut-rice-salad", title: "Warm chicken, butternut & spinach rice salad", slots: ["lunch", "dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "chicken_breast", g: 70 }, { id: "butternut", g: 45 }, { id: "white_rice", g: 40 }, { id: "spinach", g: 20 },
      { id: "pecans", g: 8 }, { id: "olive_oil", g: 8 }, { id: "lemon_juice", g: 5 },
    ],
    steps: [
      "Roast diced butternut with half the oil at 200 °C for 20 minutes.",
      "Cook rice; pan-fry and slice the chicken.",
      "Toss rice, squash, spinach and chicken with the remaining oil and lemon; scatter with pecans.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "chicken-rice-soup", title: "Chicken, rice & vegetable soup", slots: ["lunch"], servings: 2, prepMin: 35,
    ingredients: [
      { id: "chicken_breast", g: 140 }, { id: "white_rice", g: 80 }, { id: "carrot", g: 80 }, { id: "zucchini", g: 80 },
      { id: "chicken_broth_low_na", g: 600 }, { id: "parsley", g: 6 }, { id: "olive_oil", g: 10 }, { id: "black_pepper", g: 0.5 },
    ],
    steps: [
      "Soften diced carrot in oil for 5 minutes.",
      "Add broth and rice and simmer 12 minutes.",
      "Add diced chicken and zucchini; simmer 8 minutes more. Finish with parsley and pepper.",
    ],
    tags: ["batch"],
  },
  {
    id: "tuna-gf-pasta-salad", title: "Tuna, pepper & basil pasta salad", slots: ["lunch"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "gf_pasta", g: 55 }, { id: "tuna_canned", g: 50 }, { id: "red_pepper", g: 30 }, { id: "cucumber", g: 40 },
      { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 8 }, { id: "basil", g: 3 },
    ],
    steps: [
      "Cook pasta, rinse under cold water and drain.",
      "Toss with tuna, diced pepper and cucumber, oil, lemon and torn basil.",
    ],
    tags: ["low-fodmap", "gluten-free", "make-ahead"],
  },
  {
    id: "chicken-quesadilla-salsa", title: "Chicken & cheddar corn-tortilla quesadillas with salsa", slots: ["lunch", "dinner"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "corn_tortilla", g: 65 }, { id: "chicken_breast", g: 60 }, { id: "cheddar", g: 15 },
      { id: "tomato", g: 50 }, { id: "cilantro", g: 3 }, { id: "lemon_juice", g: 3 }, { id: "olive_oil", g: 4 }, { id: "cumin", g: 0.3 },
    ],
    steps: [
      "Cook chicken with cumin in oil and shred.",
      "Fill tortillas with chicken and cheddar; toast in a dry pan until crisp.",
      "Serve with a quick salsa of tomato, cilantro and lemon.",
    ],
    tags: ["low-fodmap", "gluten-free", "family"],
  },
  {
    id: "chicken-turnip-slaw-sourdough", title: "Grilled chicken with crunchy turnip-carrot slaw & toast", slots: ["lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "chicken_breast", g: 80 }, { id: "turnip", g: 50 }, { id: "carrot", g: 40 }, { id: "cabbage", g: 30 },
      { id: "mayonnaise", g: 10 }, { id: "rice_vinegar", g: 5 }, { id: "gf_bread", g: 55 }, { id: "olive_oil", g: 3 },
    ],
    steps: [
      "Grill the chicken in a little oil and slice.",
      "Grate turnip and carrot, shred the cabbage and toss with mayonnaise and vinegar.",
      "Serve with toast.",
    ],
    tags: ["renal-friendly", "low-fodmap"],
  },
  {
    id: "sweet-potato-spinach-frittata", title: "Sweet potato, spinach & feta frittata with toast", slots: ["lunch", "dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "egg", g: 100 }, { id: "sweet_potato", g: 60 }, { id: "spinach", g: 30 }, { id: "feta", g: 15 },
      { id: "olive_oil", g: 6 }, { id: "sourdough", g: 40 }, { id: "chives", g: 2 },
    ],
    steps: [
      "Fry thin slices of sweet potato in oil in an oven-proof pan until tender, then add the spinach.",
      "Pour over beaten eggs, crumble feta on top and cook gently 5 minutes.",
      "Finish under the grill until set. Serve with toast.",
    ],
    tags: ["vegetarian", "low-fodmap"],
  },
  {
    id: "salmon-leached-potato-salad", title: "Warm salmon & potato salad with green beans", slots: ["lunch", "dinner"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "salmon", g: 80 }, { id: "potato", g: 160, leached: true }, { id: "green_beans", g: 50 },
      { id: "dijon", g: 4 }, { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 8 }, { id: "dill", g: 0.5 },
    ],
    steps: [
      "Leach the potatoes (peel, dice, soak 2 hours, boil in fresh water until tender).",
      "Bake the salmon 12 minutes; blanch the green beans 4 minutes.",
      "Whisk oil, lemon, mustard and dill; toss with potatoes and beans and top with flaked salmon.",
    ],
    tags: ["omega-3", "low-fodmap", "gluten-free"],
  },
  {
    id: "tofu-banh-mi-sandwich", title: "Tofu bánh mì-style sandwich", slots: ["lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "tofu_firm", g: 70 }, { id: "sourdough", g: 65 }, { id: "carrot", g: 25 }, { id: "cucumber", g: 30 },
      { id: "cilantro", g: 3 }, { id: "mayonnaise", g: 10 }, { id: "rice_vinegar", g: 8 }, { id: "soy_sauce_low_na", g: 3 },
      { id: "chili_flakes", g: 0.2 },
    ],
    steps: [
      "Quick-pickle shredded carrot and cucumber in rice vinegar for 10 minutes.",
      "Slice tofu, brush with soy sauce and pan-fry until golden.",
      "Spread sourdough with chili mayonnaise and fill with tofu, pickles and cilantro.",
    ],
    tags: ["vegetarian", "low-fodmap"],
  },
  {
    id: "tilapia-tartare-sandwich", title: "Crispy tilapia sandwich with dill tartare", slots: ["lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "tilapia", g: 80 }, { id: "sourdough", g: 65 }, { id: "mayonnaise", g: 10 }, { id: "dill", g: 0.5 },
      { id: "lemon_juice", g: 5 }, { id: "iceberg", g: 20 }, { id: "canola_oil", g: 5 }, { id: "rice_flour", g: 5 },
    ],
    steps: [
      "Dust tilapia in rice flour and pan-fry in oil 3 minutes per side.",
      "Mix mayonnaise with dill and lemon juice.",
      "Sandwich fish, tartare and lettuce in toasted sourdough.",
    ],
    tags: ["low-fodmap", "renal-friendly"],
  },
  {
    id: "polenta-crusted-chicken-slaw", title: "Polenta-crusted chicken tenders with cabbage slaw", slots: ["lunch", "dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "chicken_breast", g: 90 }, { id: "cornmeal", g: 35 }, { id: "egg", g: 15 }, { id: "canola_oil", g: 10 },
      { id: "cabbage", g: 50 }, { id: "carrot", g: 30 }, { id: "mayonnaise", g: 8 }, { id: "rice_vinegar", g: 5 }, { id: "paprika", g: 0.5 },
    ],
    steps: [
      "Cut chicken into strips, dip in beaten egg and coat in cornmeal mixed with paprika.",
      "Bake on an oiled tray at 220 °C for 15 minutes, turning once.",
      "Toss shredded cabbage and carrot with mayonnaise and vinegar.",
    ],
    tags: ["low-fodmap", "gluten-free", "family"],
  },
  {
    id: "egg-white-fried-rice", title: "Egg-white fried rice with green beans & carrot", slots: ["lunch", "dinner"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "white_rice", g: 55 }, { id: "egg_white", g: 120 }, { id: "carrot", g: 30 }, { id: "green_beans", g: 30 },
      { id: "scallion_greens", g: 8 }, { id: "garlic_oil", g: 10 }, { id: "soy_sauce_low_na", g: 5 }, { id: "ginger", g: 2 },
    ],
    steps: [
      "Use cold cooked rice.",
      "Scramble egg whites in half the oil and set aside.",
      "Stir-fry diced vegetables and ginger in the rest of the oil, add rice and toss until hot; return the egg and season with soy sauce and scallion greens.",
    ],
    tags: ["high-protein", "renal-friendly", "low-fodmap"],
  },
  {
    id: "chicken-strawberry-spinach-salad", title: "Chicken, strawberry & spinach salad with pecans", slots: ["lunch"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "chicken_breast", g: 70 }, { id: "spinach", g: 50 }, { id: "strawberries", g: 50 }, { id: "pecans", g: 10 },
      { id: "olive_oil", g: 8 }, { id: "rice_vinegar", g: 5 }, { id: "sourdough", g: 50 },
    ],
    steps: [
      "Grill and slice the chicken.",
      "Toss spinach and sliced strawberries with oil and vinegar; top with chicken and pecans.",
      "Serve with toasted sourdough.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "roasted-veg-rice-salad-brie", title: "Roasted vegetable rice salad with brie & lemon-oil dressing", slots: ["lunch"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "white_rice", g: 50 }, { id: "zucchini", g: 50 }, { id: "red_pepper", g: 30 }, { id: "eggplant", g: 50 },
      { id: "olive_oil", g: 18 }, { id: "brie", g: 20 }, { id: "lemon_juice", g: 8 }, { id: "basil", g: 3 },
    ],
    steps: [
      "Roast diced zucchini, pepper and eggplant with half the oil at 210 °C for 20 minutes.",
      "Cook rice.",
      "Toss rice and vegetables with the remaining oil, lemon and basil; top with cubes of brie.",
    ],
    tags: ["energy-dense", "renal-friendly", "low-fodmap", "vegetarian"],
  },
  {
    id: "roasted-veg-noodle-salad-macadamia", title: "Roasted vegetable rice-noodle salad with macadamias", slots: ["lunch", "dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "rice_noodles", g: 55 }, { id: "eggplant", g: 50 }, { id: "red_pepper", g: 30 }, { id: "carrot", g: 40 },
      { id: "olive_oil", g: 20 }, { id: "macadamia", g: 15 }, { id: "basil", g: 3 }, { id: "lemon_juice", g: 8 },
    ],
    steps: [
      "Roast diced eggplant, pepper and carrot with half the oil at 210 °C for 20 minutes.",
      "Cook noodles per the packet and rinse.",
      "Toss with the vegetables, remaining oil, lemon and basil; scatter with toasted chopped macadamias.",
    ],
    tags: ["energy-dense", "renal-friendly", "low-fodmap", "vegan", "gluten-free"],
  },
];
