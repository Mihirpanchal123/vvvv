import type { Recipe } from "@/lib/domain/types";

export const DINNERS: Recipe[] = [
  {
    id: "lemon-salmon-rice-beans", title: "Lemon-herb salmon with rice & green beans", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "salmon", g: 120 }, { id: "white_rice", g: 55 }, { id: "green_beans", g: 75 },
      { id: "olive_oil", g: 8 }, { id: "lemon_juice", g: 10 }, { id: "parsley", g: 3 },
    ],
    steps: [
      "Cook rice.",
      "Bake salmon at 200 °C for 12–14 minutes with lemon juice and half the oil.",
      "Steam green beans 5 minutes; toss with remaining oil and parsley.",
    ],
    tags: ["omega-3", "low-fodmap"],
  },
  {
    id: "chicken-bok-choy-stir-fry", title: "Chicken & bok choy stir-fry", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "chicken_breast", g: 110 }, { id: "bok_choy", g: 80 }, { id: "red_pepper", g: 40 }, { id: "carrot", g: 40 },
      { id: "white_rice", g: 55 }, { id: "garlic_oil", g: 10 }, { id: "soy_sauce_low_na", g: 8 },
      { id: "ginger", g: 5 }, { id: "cornstarch", g: 5 },
    ],
    steps: [
      "Cook rice.",
      "Toss sliced chicken with cornstarch; stir-fry in garlic-infused oil with ginger.",
      "Add pepper, carrot, then bok choy; cook 3 minutes.",
      "Add soy sauce and 2 tbsp water to make a glossy sauce.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "turkey-meatballs-gf-pasta", title: "Turkey meatballs with tomato sauce & pasta", slots: ["dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "ground_turkey", g: 100 }, { id: "egg", g: 15 }, { id: "gf_pasta", g: 60 }, { id: "canned_tomatoes", g: 90 },
      { id: "garlic_oil", g: 10 }, { id: "oregano", g: 1 }, { id: "parmesan", g: 8 },
    ],
    steps: [
      "Mix turkey, egg and oregano; roll into 6 meatballs.",
      "Brown in garlic-infused oil, add tomatoes and simmer 15 minutes.",
      "Cook pasta and toss with sauce; top with parmesan.",
    ],
    tags: ["family", "low-fodmap"],
  },
  {
    id: "pork-leached-potatoes", title: "Herb pork tenderloin with leached potatoes & carrots", slots: ["dinner"], servings: 1, prepMin: 45,
    ingredients: [
      { id: "pork_tenderloin", g: 110 }, { id: "potato", g: 150, leached: true }, { id: "carrot", g: 70 },
      { id: "olive_oil", g: 10 }, { id: "oregano", g: 1 }, { id: "black_pepper", g: 0.5 },
    ],
    steps: [
      "Leach the potatoes: peel and dice small, soak in warm water 2 hours, then boil in fresh water for 10 minutes and drain; repeat the boil with fresh water.",
      "Rub pork with half the oil, oregano and pepper; roast at 200 °C for 20–25 minutes.",
      "Toss leached potatoes and carrots in remaining oil; roast alongside for 20 minutes.",
    ],
    tags: ["renal-friendly"],
  },
  {
    id: "beef-broccoli", title: "Garlic beef & broccoli with rice", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "lean_beef", g: 100 }, { id: "broccoli", g: 75 }, { id: "white_rice", g: 55 }, { id: "garlic", g: 5 },
      { id: "soy_sauce_low_na", g: 8 }, { id: "cornstarch", g: 5 }, { id: "olive_oil", g: 8 }, { id: "ginger", g: 3 },
    ],
    steps: [
      "Cook rice.",
      "Slice beef thinly and toss with cornstarch.",
      "Sear beef in oil, add garlic, ginger and broccoli florets; stir-fry 4 minutes.",
      "Add soy sauce and a splash of water.",
    ],
  },
  {
    id: "cod-sweet-potato", title: "Paprika cod with sweet potato & zucchini", slots: ["dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "cod", g: 130 }, { id: "sweet_potato", g: 70 }, { id: "zucchini", g: 60 }, { id: "white_rice", g: 30 },
      { id: "olive_oil", g: 10 }, { id: "paprika", g: 1 }, { id: "lemon_juice", g: 10 },
    ],
    steps: [
      "Roast sweet potato cubes with half the oil at 200 °C for 20 minutes; add zucchini for the last 10.",
      "Cook rice.",
      "Season cod with paprika; bake for 10–12 minutes and finish with lemon.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "tofu-coconut-curry", title: "Tofu & vegetable coconut curry", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "tofu_firm", g: 120 }, { id: "coconut_milk", g: 50 }, { id: "zucchini", g: 60 }, { id: "red_pepper", g: 40 },
      { id: "spinach", g: 30 }, { id: "white_rice", g: 55 }, { id: "ginger", g: 5 }, { id: "cumin", g: 2 },
      { id: "garlic_oil", g: 5 },
    ],
    steps: [
      "Cook rice.",
      "Fry tofu cubes in garlic-infused oil until golden; add ginger and cumin.",
      "Add zucchini and pepper, then coconut milk and 100 ml water; simmer 8 minutes.",
      "Stir in spinach until wilted.",
    ],
    tags: ["vegan", "low-fodmap"],
  },
  {
    id: "shrimp-zucchini-pasta", title: "Lemon shrimp & zucchini pasta", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "shrimp", g: 100 }, { id: "gf_pasta", g: 65 }, { id: "zucchini", g: 60 }, { id: "garlic_oil", g: 10 },
      { id: "lemon_juice", g: 10 }, { id: "parmesan", g: 8 }, { id: "chili_flakes", g: 0.5 },
    ],
    steps: [
      "Cook pasta.",
      "Sauté shrimp in garlic-infused oil with chili flakes 3 minutes; add sliced zucchini.",
      "Toss with pasta, lemon juice and parmesan.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "chicken-fajita-bowl", title: "Chicken fajita rice bowl", slots: ["dinner", "lunch"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "chicken_breast", g: 100 }, { id: "red_pepper", g: 40 }, { id: "scallion_greens", g: 15 },
      { id: "white_rice", g: 50 }, { id: "avocado", g: 25 }, { id: "lemon_juice", g: 10 },
      { id: "cumin", g: 2 }, { id: "paprika", g: 1 }, { id: "olive_oil", g: 8 },
    ],
    steps: [
      "Cook rice.",
      "Toss chicken strips with cumin and paprika; sear in oil with sliced pepper.",
      "Serve over rice with avocado, scallion greens and lemon.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "spaghetti-bolognese", title: "Spaghetti bolognese", slots: ["dinner"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "lean_beef", g: 90 }, { id: "pasta", g: 60 }, { id: "canned_tomatoes", g: 120 }, { id: "onion", g: 40 },
      { id: "garlic", g: 5 }, { id: "carrot", g: 30 }, { id: "olive_oil", g: 8 }, { id: "parmesan", g: 8 }, { id: "oregano", g: 1 },
    ],
    steps: [
      "Sauté chopped onion, garlic and carrot in oil 6 minutes.",
      "Add minced beef and brown; add tomatoes and oregano and simmer 20 minutes.",
      "Serve over spaghetti with parmesan.",
    ],
    tags: ["family"],
  },
  {
    id: "chickpea-vegetable-stew", title: "Spiced chickpea & vegetable stew with brown rice", slots: ["dinner"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "chickpeas_canned", g: 120 }, { id: "canned_tomatoes", g: 120 }, { id: "zucchini", g: 80 }, { id: "onion", g: 40 },
      { id: "garlic", g: 5 }, { id: "spinach", g: 30 }, { id: "cumin", g: 2 }, { id: "olive_oil", g: 10 }, { id: "brown_rice", g: 25 },
    ],
    steps: [
      "Cook brown rice.",
      "Sauté onion and garlic in oil, add cumin, tomatoes, chickpeas and zucchini; simmer 15 minutes.",
      "Stir in spinach and serve over rice.",
    ],
    tags: ["vegan", "high-fibre"],
  },
  {
    id: "herb-chicken-rice-cabbage", title: "Herb roast chicken with rice pilaf & buttered cabbage", slots: ["dinner"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "chicken_breast", g: 110 }, { id: "white_rice", g: 55 }, { id: "cabbage", g: 75 },
      { id: "butter", g: 5 }, { id: "olive_oil", g: 5 }, { id: "parsley", g: 3 }, { id: "oregano", g: 1 },
    ],
    steps: [
      "Rub chicken with oil and oregano; roast at 200 °C for 20–25 minutes.",
      "Cook rice and stir through chopped parsley.",
      "Sauté shredded cabbage in butter until tender.",
    ],
    tags: ["renal-friendly", "low-fodmap"],
  },
  {
    id: "salmon-teriyaki-noodles", title: "Maple-soy salmon with bok choy & rice noodles", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "salmon", g: 110 }, { id: "bok_choy", g: 80 }, { id: "rice_noodles", g: 55 }, { id: "soy_sauce_low_na", g: 8 },
      { id: "maple_syrup", g: 5 }, { id: "ginger", g: 5 }, { id: "garlic_oil", g: 5 },
    ],
    steps: [
      "Mix soy sauce, maple syrup and grated ginger; brush over salmon.",
      "Bake salmon at 200 °C for 12 minutes.",
      "Cook noodles; stir-fry bok choy in garlic-infused oil and toss with noodles.",
    ],
    tags: ["omega-3", "low-fodmap"],
  },
  {
    id: "turkey-stuffed-peppers", title: "Turkey & quinoa stuffed peppers", slots: ["dinner"], servings: 1, prepMin: 40,
    ingredients: [
      { id: "quinoa", g: 45 }, { id: "red_pepper", g: 120 }, { id: "ground_turkey", g: 80 }, { id: "canned_tomatoes", g: 60 },
      { id: "cheddar", g: 15 }, { id: "cumin", g: 1 }, { id: "olive_oil", g: 5 },
    ],
    steps: [
      "Cook quinoa.",
      "Brown turkey in oil with cumin; stir in tomatoes and quinoa.",
      "Halve the pepper, fill, top with cheddar and bake at 190 °C for 25 minutes.",
    ],
  },
  {
    id: "pasta-aglio-olio-zucchini", title: "Garlic-oil pasta with zucchini, lemon & herbs", slots: ["dinner", "lunch"], servings: 1, prepMin: 15,
    ingredients: [
      { id: "gf_pasta", g: 75 }, { id: "garlic_oil", g: 15 }, { id: "zucchini", g: 60 }, { id: "parsley", g: 5 },
      { id: "parmesan", g: 5 }, { id: "lemon_juice", g: 5 }, { id: "chili_flakes", g: 0.5 },
    ],
    steps: [
      "Cook pasta; reserve a splash of the cooking water.",
      "Warm garlic-infused oil with chili flakes; add thinly sliced zucchini and cook 3 minutes.",
      "Toss with pasta, a little pasta water, lemon, parsley and parmesan.",
    ],
    tags: ["vegetarian", "renal-friendly", "low-fodmap"],
  },
  {
    id: "coconut-rice-ginger-chicken", title: "Coconut rice with ginger chicken & bok choy", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "white_rice", g: 60 }, { id: "coconut_milk", g: 50 }, { id: "chicken_breast", g: 75 },
      { id: "bok_choy", g: 60 }, { id: "ginger", g: 5 }, { id: "garlic_oil", g: 8 }, { id: "scallion_greens", g: 10 },
    ],
    steps: [
      "Cook rice with the coconut milk plus enough water to make up the usual amount of liquid.",
      "Stir-fry sliced chicken with ginger in garlic-infused oil; add bok choy for the last 2 minutes.",
      "Serve over coconut rice with scallion greens.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "pork-pineapple-rice", title: "Pork & pineapple fried rice", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "pork_tenderloin", g: 100 }, { id: "pineapple", g: 60 }, { id: "white_rice", g: 50 }, { id: "red_pepper", g: 30 },
      { id: "scallion_greens", g: 10 }, { id: "soy_sauce_low_na", g: 8 }, { id: "garlic_oil", g: 8 },
    ],
    steps: [
      "Cook rice (day-old is best).",
      "Stir-fry diced pork in garlic-infused oil until cooked; add pepper and pineapple.",
      "Add rice and soy sauce; toss over high heat and finish with scallion greens.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "chicken-thigh-potato-tray-bake", title: "Chicken thigh, leached potato & green bean tray bake", slots: ["dinner"], servings: 1, prepMin: 45,
    ingredients: [
      { id: "chicken_thigh", g: 100 }, { id: "potato", g: 180, leached: true }, { id: "green_beans", g: 60 },
      { id: "olive_oil", g: 12 }, { id: "lemon_juice", g: 8 }, { id: "oregano", g: 1 }, { id: "black_pepper", g: 0.3 },
    ],
    steps: [
      "Leach the potatoes: peel, cut into wedges, soak in warm water 2 hours, then boil in fresh water 10 minutes and drain.",
      "Toss potatoes and chicken with oil, lemon, oregano and pepper; roast at 210 °C for 25 minutes.",
      "Add green beans for the last 10 minutes.",
    ],
    tags: ["low-fodmap", "gluten-free", "one-pan"],
  },
  {
    id: "tilapia-lemon-rice-zucchini", title: "Lemon tilapia with herbed rice & zucchini", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "tilapia", g: 120 }, { id: "white_rice", g: 55 }, { id: "zucchini", g: 60 },
      { id: "olive_oil", g: 10 }, { id: "lemon_juice", g: 10 }, { id: "parsley", g: 3 }, { id: "paprika", g: 0.5 },
    ],
    steps: [
      "Cook rice and stir through chopped parsley.",
      "Season tilapia with paprika and bake at 200 °C for 10–12 minutes with half the oil and lemon juice.",
      "Sauté sliced zucchini in the remaining oil.",
    ],
    tags: ["low-fodmap", "renal-friendly", "gluten-free"],
  },
  {
    id: "chicken-thigh-teriyaki-rice", title: "Chicken thigh teriyaki with rice & green beans", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "chicken_thigh", g: 100 }, { id: "white_rice", g: 55 }, { id: "green_beans", g: 60 },
      { id: "soy_sauce_low_na", g: 8 }, { id: "maple_syrup", g: 6 }, { id: "ginger", g: 4 }, { id: "cornstarch", g: 3 }, { id: "canola_oil", g: 8 },
    ],
    steps: [
      "Cook rice; steam the green beans.",
      "Pan-fry chicken pieces in oil until golden and cooked through.",
      "Mix soy sauce, maple syrup, grated ginger, cornstarch and 3 tbsp water; add to the pan and bubble until glossy.",
    ],
    tags: ["low-fodmap", "family"],
  },
  {
    id: "beef-pepper-rice-noodles", title: "Beef & pepper rice-noodle stir-fry", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "lean_beef", g: 90 }, { id: "rice_noodles", g: 55 }, { id: "red_pepper", g: 40 }, { id: "bok_choy", g: 60 },
      { id: "garlic_oil", g: 10 }, { id: "soy_sauce_low_na", g: 7 }, { id: "ginger", g: 3 }, { id: "scallion_greens", g: 6 },
    ],
    steps: [
      "Soak noodles per packet; drain.",
      "Stir-fry thinly sliced beef in garlic oil 2 minutes; remove.",
      "Stir-fry pepper, bok choy and ginger, return beef, add noodles, soy sauce and 2 tbsp water; toss with scallion greens.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "spaghetti-squash-turkey-ragu", title: "Spaghetti squash & pasta with turkey ragù", slots: ["dinner"], servings: 1, prepMin: 50,
    ingredients: [
      { id: "spaghetti_squash", g: 150 }, { id: "gf_pasta", g: 40 }, { id: "ground_turkey", g: 90 }, { id: "canned_tomatoes", g: 80 },
      { id: "carrot", g: 30 }, { id: "garlic_oil", g: 10 }, { id: "basil", g: 3 }, { id: "parmesan", g: 5 },
    ],
    steps: [
      "Halve the squash, roast cut-side down at 200 °C for 35 minutes, then scrape into strands.",
      "Brown turkey and grated carrot in garlic oil; add tomatoes and simmer 15 minutes.",
      "Cook pasta, toss with the squash strands and top with ragù, basil and parmesan.",
    ],
    tags: ["low-fodmap", "gluten-free", "family"],
  },
  {
    id: "creamy-chicken-spinach-pasta", title: "Creamy chicken & spinach pasta", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "gf_pasta", g: 55 }, { id: "chicken_breast", g: 70 }, { id: "spinach", g: 30 }, { id: "heavy_cream", g: 30 },
      { id: "garlic_oil", g: 8 }, { id: "parmesan", g: 5 }, { id: "black_pepper", g: 0.3 },
    ],
    steps: [
      "Cook pasta.",
      "Pan-fry sliced chicken in garlic oil until cooked; add spinach to wilt.",
      "Stir in cream, parmesan, pepper and a splash of pasta water; toss with the pasta.",
    ],
    tags: ["low-fodmap", "gluten-free", "energy-dense"],
  },
  {
    id: "polenta-beef-pepper-ragu", title: "Soft polenta with braised beef & peppers", slots: ["dinner"], servings: 1, prepMin: 40,
    ingredients: [
      { id: "cornmeal", g: 50 }, { id: "lean_beef", g: 80 }, { id: "red_pepper", g: 40 }, { id: "canned_tomatoes", g: 60 },
      { id: "olive_oil", g: 10 }, { id: "butter", g: 5 }, { id: "oregano", g: 1 }, { id: "paprika", g: 0.5 },
    ],
    steps: [
      "Brown diced beef in oil; add pepper, paprika and oregano.",
      "Add tomatoes and 100 ml water; cover and simmer 25 minutes.",
      "Cook polenta in 220 ml water for 10 minutes and finish with butter; spoon the beef over.",
    ],
    tags: ["gluten-free"],
  },
  {
    id: "herb-crumb-cod-leached-potatoes", title: "Herb-crumbed cod with leached potatoes & carrots", slots: ["dinner"], servings: 1, prepMin: 40,
    ingredients: [
      { id: "cod", g: 120 }, { id: "sourdough", g: 20 }, { id: "parsley", g: 4 }, { id: "potato", g: 150, leached: true },
      { id: "carrot", g: 60 }, { id: "olive_oil", g: 12 }, { id: "lemon_juice", g: 8 },
    ],
    steps: [
      "Leach the potatoes (peel, dice, soak 2 hours, boil in fresh water) and roast with carrots in half the oil for 20 minutes.",
      "Blitz sourdough with parsley and remaining oil into crumbs.",
      "Press crumbs onto the cod and bake at 200 °C for 12 minutes; finish with lemon.",
    ],
    tags: ["low-fodmap"],
  },
  {
    id: "salmon-rice-cucumber-dill-sauce", title: "Baked salmon with rice & cucumber-dill sauce", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "salmon", g: 100 }, { id: "white_rice", g: 50 }, { id: "cucumber", g: 50 }, { id: "sour_cream", g: 30 },
      { id: "dill", g: 0.5 }, { id: "lemon_juice", g: 5 }, { id: "green_beans", g: 50 },
    ],
    steps: [
      "Cook rice; steam the green beans.",
      "Bake salmon at 200 °C for 12 minutes.",
      "Mix grated cucumber with sour cream, dill and lemon; spoon over the salmon.",
    ],
    tags: ["omega-3", "low-fodmap", "gluten-free"],
  },
  {
    id: "lemon-herb-chicken-couscous", title: "Lemon-herb chicken with couscous & roasted vegetables", slots: ["dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "chicken_breast", g: 100 }, { id: "couscous", g: 50 }, { id: "zucchini", g: 60 }, { id: "red_pepper", g: 40 },
      { id: "olive_oil", g: 12 }, { id: "lemon_juice", g: 10 }, { id: "oregano", g: 1 }, { id: "parsley", g: 3 },
    ],
    steps: [
      "Roast zucchini and pepper with half the oil at 210 °C for 20 minutes.",
      "Marinate chicken in lemon, oregano and the remaining oil; grill 6 minutes per side.",
      "Prepare couscous with 80 ml boiling water and fold through the vegetables and parsley.",
    ],
  },
  {
    id: "pork-braised-cabbage-rice", title: "Pork tenderloin with braised cabbage & rice", slots: ["dinner"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "pork_tenderloin", g: 100 }, { id: "cabbage", g: 70 }, { id: "white_rice", g: 50 }, { id: "carrot", g: 30 },
      { id: "butter", g: 8 }, { id: "dijon", g: 4 }, { id: "rice_vinegar", g: 5 }, { id: "black_pepper", g: 0.3 },
    ],
    steps: [
      "Cook rice.",
      "Sear the pork, then roast at 200 °C for 15–18 minutes; rest and slice.",
      "Braise shredded cabbage and carrot in butter with vinegar and 3 tbsp water for 10 minutes; stir in mustard.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "tilapia-turnip-potato-mash", title: "Herb-crusted tilapia with turnip & potato mash", slots: ["dinner"], servings: 1, prepMin: 40,
    ingredients: [
      { id: "tilapia", g: 120 }, { id: "turnip", g: 70 }, { id: "potato", g: 150, leached: true }, { id: "butter", g: 10 },
      { id: "lactose_free_milk", g: 30 }, { id: "parsley", g: 3 }, { id: "chives", g: 3 }, { id: "olive_oil", g: 5 },
    ],
    steps: [
      "Leach the potatoes (peel, dice, soak 2 hours), then boil with the diced turnip in fresh water until soft.",
      "Mash with butter, milk and chives.",
      "Coat tilapia with chopped parsley and oil; bake at 200 °C for 10–12 minutes.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "beef-soft-tacos", title: "Beef soft tacos with lettuce, tomato & sour cream", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "lean_beef", g: 80 }, { id: "corn_tortilla", g: 65 }, { id: "iceberg", g: 30 }, { id: "tomato", g: 40 },
      { id: "sour_cream", g: 20 }, { id: "cumin", g: 0.5 }, { id: "paprika", g: 0.5 }, { id: "olive_oil", g: 5 }, { id: "cilantro", g: 3 },
    ],
    steps: [
      "Brown minced beef in oil with cumin and paprika (no salt or packet seasoning).",
      "Warm the tortillas.",
      "Fill with beef, shredded lettuce, tomato, sour cream and cilantro.",
    ],
    tags: ["low-fodmap", "gluten-free", "family"],
  },
  {
    id: "ginger-chicken-noodle-soup", title: "Ginger chicken & rice-noodle soup", slots: ["dinner", "lunch"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "chicken_breast", g: 80 }, { id: "rice_noodles", g: 50 }, { id: "chicken_broth_low_na", g: 300 }, { id: "bok_choy", g: 60 },
      { id: "carrot", g: 30 }, { id: "ginger", g: 5 }, { id: "soy_sauce_low_na", g: 4 }, { id: "scallion_greens", g: 5 }, { id: "garlic_oil", g: 5 },
    ],
    steps: [
      "Simmer broth with sliced ginger and carrot for 10 minutes.",
      "Poach thinly sliced chicken in the broth for 5 minutes; add bok choy for the last 2.",
      "Pour over cooked rice noodles; season with soy sauce, garlic oil and scallion greens.",
    ],
  },
  {
    id: "eggplant-tomato-pasta", title: "Eggplant & tomato pasta with basil & parmesan", slots: ["dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "gf_pasta", g: 60 }, { id: "eggplant", g: 70 }, { id: "canned_tomatoes", g: 80 }, { id: "garlic_oil", g: 12 },
      { id: "basil", g: 4 }, { id: "parmesan", g: 8 }, { id: "chili_flakes", g: 0.2 },
    ],
    steps: [
      "Fry cubed eggplant in garlic oil until golden and soft.",
      "Add tomatoes and chili; simmer 10 minutes.",
      "Toss with cooked pasta, basil and parmesan.",
    ],
    tags: ["vegetarian", "low-fodmap", "gluten-free"],
  },
  {
    id: "chicken-thigh-polenta-zucchini", title: "Paprika chicken thigh with polenta & roasted zucchini", slots: ["dinner"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "chicken_thigh", g: 100 }, { id: "cornmeal", g: 45 }, { id: "zucchini", g: 60 },
      { id: "olive_oil", g: 10 }, { id: "butter", g: 5 }, { id: "paprika", g: 1 }, { id: "basil", g: 2 },
    ],
    steps: [
      "Rub chicken with paprika and half the oil; roast at 210 °C for 22 minutes with the sliced zucchini.",
      "Cook polenta in 200 ml water for 10 minutes and finish with butter.",
      "Serve with torn basil.",
    ],
    tags: ["low-fodmap", "gluten-free", "renal-friendly"],
  },
  {
    id: "beef-lentil-chili-rice", title: "Mild beef & lentil chili with rice", slots: ["dinner"], servings: 2, prepMin: 45,
    ingredients: [
      { id: "lean_beef", g: 160 }, { id: "lentils_canned", g: 80 }, { id: "canned_tomatoes", g: 160 }, { id: "red_pepper", g: 60 },
      { id: "white_rice", g: 80 }, { id: "olive_oil", g: 12 }, { id: "cumin", g: 1.5 }, { id: "paprika", g: 1.5 }, { id: "cilantro", g: 4 },
    ],
    steps: [
      "Brown the beef in oil with cumin and paprika.",
      "Add diced pepper, tomatoes, rinsed lentils and 150 ml water; simmer 25 minutes.",
      "Serve over rice with cilantro.",
    ],
    tags: ["batch", "high-fibre", "family"],
  },
  {
    id: "cod-potato-fishcakes", title: "Cod & potato fishcakes with lemony salad", slots: ["dinner"], servings: 1, prepMin: 45,
    ingredients: [
      { id: "cod", g: 90 }, { id: "potato", g: 150, leached: true }, { id: "egg", g: 25 }, { id: "rice_flour", g: 10 },
      { id: "canola_oil", g: 12 }, { id: "romaine", g: 40 }, { id: "cucumber", g: 40 }, { id: "lemon_juice", g: 8 }, { id: "parsley", g: 3 },
    ],
    steps: [
      "Leach the potatoes (peel, dice, soak 2 hours, boil in fresh water until soft), then mash.",
      "Poach the cod 6 minutes and flake into the mash with parsley and half the egg; shape into 2 cakes.",
      "Dip in remaining egg and rice flour; pan-fry in oil 4 minutes per side. Serve with salad dressed in lemon.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "garlic-shrimp-spaghetti-squash-rice", title: "Lemon-garlic shrimp with spaghetti squash & rice", slots: ["dinner"], servings: 1, prepMin: 45,
    ingredients: [
      { id: "shrimp", g: 100 }, { id: "spaghetti_squash", g: 120 }, { id: "white_rice", g: 40 }, { id: "garlic_oil", g: 12 },
      { id: "lemon_juice", g: 10 }, { id: "parsley", g: 4 }, { id: "chili_flakes", g: 0.2 },
    ],
    steps: [
      "Roast the halved squash cut-side down at 200 °C for 35 minutes; scrape into strands.",
      "Cook rice.",
      "Sauté shrimp in garlic oil with chili for 3 minutes; add lemon and parsley and toss with the squash. Serve with rice.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "garlic-butter-salmon-pasta-spinach", title: "Garlic-butter salmon with pasta & spinach", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "salmon", g: 90 }, { id: "gf_pasta", g: 50 }, { id: "spinach", g: 30 }, { id: "butter", g: 8 },
      { id: "garlic_oil", g: 5 }, { id: "lemon_juice", g: 8 }, { id: "parsley", g: 3 },
    ],
    steps: [
      "Cook the pasta.",
      "Pan-sear salmon in garlic oil 4 minutes per side; flake.",
      "Melt butter in the pan, wilt spinach, then toss with pasta, salmon, lemon and parsley.",
    ],
    tags: ["omega-3", "low-fodmap", "gluten-free"],
  },
  {
    id: "turkey-meatloaf-leached-mash", title: "Turkey meatloaf with leached mash & green beans", slots: ["dinner"], servings: 4, prepMin: 70,
    ingredients: [
      { id: "ground_turkey", g: 360 }, { id: "egg", g: 50 }, { id: "sourdough", g: 40 }, { id: "carrot", g: 60 },
      { id: "canned_tomatoes", g: 60 }, { id: "oregano", g: 2 }, { id: "potato", g: 600, leached: true }, { id: "butter", g: 30 },
      { id: "lactose_free_milk", g: 80 }, { id: "green_beans", g: 240 },
    ],
    steps: [
      "Mix turkey, egg, sourdough crumbs, grated carrot and oregano; press into a loaf tin and spread tomatoes on top.",
      "Bake at 180 °C for 50 minutes.",
      "Leach the potatoes (peel, dice, soak 2 hours, boil in fresh water), then mash with butter and milk.",
      "Steam green beans and serve with slices of meatloaf.",
    ],
    tags: ["batch", "low-fodmap", "family"],
  },
  {
    id: "maple-dijon-pork-rice-carrots", title: "Maple-dijon pork tenderloin with rice & glazed carrots", slots: ["dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "pork_tenderloin", g: 100 }, { id: "white_rice", g: 50 }, { id: "carrot", g: 80 },
      { id: "maple_syrup", g: 6 }, { id: "dijon", g: 5 }, { id: "olive_oil", g: 8 }, { id: "butter", g: 5 }, { id: "parsley", g: 2 },
    ],
    steps: [
      "Brush pork with maple syrup, mustard and oil; roast at 200 °C for 18 minutes and rest.",
      "Cook rice.",
      "Simmer sliced carrots in a little water with butter until glazed.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "chicken-vegetable-kebabs-rice", title: "Chicken & vegetable kebabs with rice", slots: ["dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "chicken_breast", g: 90 }, { id: "red_pepper", g: 40 }, { id: "zucchini", g: 60 }, { id: "white_rice", g: 55 },
      { id: "olive_oil", g: 10 }, { id: "oregano", g: 1 }, { id: "lemon_juice", g: 8 },
    ],
    steps: [
      "Marinate cubed chicken in oil, lemon and oregano for 15 minutes.",
      "Thread onto skewers with pepper and zucchini; grill 10–12 minutes, turning.",
      "Serve with rice.",
    ],
    tags: ["low-fodmap", "gluten-free", "renal-friendly"],
  },
  {
    id: "tofu-green-bean-stir-fry", title: "Tofu & green bean stir-fry with rice", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "tofu_firm", g: 100 }, { id: "green_beans", g: 70 }, { id: "red_pepper", g: 30 }, { id: "white_rice", g: 55 },
      { id: "garlic_oil", g: 10 }, { id: "soy_sauce_low_na", g: 6 }, { id: "ginger", g: 3 }, { id: "cornstarch", g: 4 },
    ],
    steps: [
      "Cook rice.",
      "Toss cubed tofu in cornstarch and fry in garlic oil until crisp; remove.",
      "Stir-fry beans, pepper and ginger 4 minutes; return tofu and add soy sauce with 2 tbsp water.",
    ],
    tags: ["vegan", "low-fodmap"],
  },
  {
    id: "chicken-mushroom-risotto", title: "Chicken & mushroom risotto", slots: ["dinner"], servings: 1, prepMin: 35,
    ingredients: [
      { id: "white_rice", g: 60 }, { id: "chicken_breast", g: 70 }, { id: "mushrooms", g: 60 }, { id: "chicken_broth_low_na", g: 220 },
      { id: "parmesan", g: 8 }, { id: "butter", g: 8 }, { id: "olive_oil", g: 5 }, { id: "parsley", g: 3 },
    ],
    steps: [
      "Brown diced chicken and mushrooms in oil; remove.",
      "Toast the rice in half the butter, then add hot broth a ladle at a time, stirring, for 18 minutes.",
      "Return chicken and mushrooms; finish with remaining butter, parmesan and parsley.",
    ],
    tags: ["gluten-free"],
  },
  {
    id: "chicken-pad-thai-style", title: "Chicken pad thai-style rice noodles", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "rice_noodles", g: 60 }, { id: "chicken_breast", g: 70 }, { id: "egg", g: 25 }, { id: "bean_sprouts", g: 40 },
      { id: "scallion_greens", g: 8 }, { id: "peanut_butter", g: 8 }, { id: "lemon_juice", g: 10 }, { id: "soy_sauce_low_na", g: 6 },
      { id: "garlic_oil", g: 8 }, { id: "maple_syrup", g: 4 },
    ],
    steps: [
      "Soak noodles per packet.",
      "Stir-fry sliced chicken in garlic oil; push aside and scramble the egg.",
      "Add noodles with peanut butter, lemon, soy sauce and maple syrup thinned with 3 tbsp water; toss with bean sprouts and scallion greens.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "cod-tomato-zucchini-rice", title: "Cod in tomato & zucchini sauce with rice", slots: ["dinner"], servings: 1, prepMin: 25,
    ingredients: [
      { id: "cod", g: 120 }, { id: "canned_tomatoes", g: 80 }, { id: "zucchini", g: 60 }, { id: "white_rice", g: 50 },
      { id: "olive_oil", g: 10 }, { id: "paprika", g: 0.5 }, { id: "parsley", g: 3 },
    ],
    steps: [
      "Cook rice.",
      "Sauté diced zucchini in oil with paprika; add tomatoes and simmer 8 minutes.",
      "Nestle the cod into the sauce, cover and cook 8 minutes until it flakes. Finish with parsley.",
    ],
    tags: ["low-fodmap", "gluten-free", "one-pan"],
  },
  {
    id: "roast-chicken-thigh-sweet-potato", title: "Herb-roast chicken thigh with sweet potato, beans & rice", slots: ["dinner"], servings: 1, prepMin: 40,
    ingredients: [
      { id: "chicken_thigh", g: 110 }, { id: "sweet_potato", g: 70 }, { id: "green_beans", g: 60 }, { id: "white_rice", g: 30 },
      { id: "olive_oil", g: 10 }, { id: "oregano", g: 1 }, { id: "paprika", g: 0.5 },
    ],
    steps: [
      "Roast chicken and cubed sweet potato with oil, oregano and paprika at 210 °C for 25 minutes.",
      "Cook rice; steam the green beans.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "turkey-polenta-green-beans", title: "Herbed turkey patties with polenta & green beans", slots: ["dinner"], servings: 1, prepMin: 30,
    ingredients: [
      { id: "ground_turkey", g: 90 }, { id: "cornmeal", g: 45 }, { id: "green_beans", g: 70 }, { id: "parsley", g: 3 },
      { id: "chives", g: 3 }, { id: "olive_oil", g: 8 }, { id: "butter", g: 5 },
    ],
    steps: [
      "Mix turkey with chopped herbs (no salt) and shape into 2 patties; pan-fry in oil 5 minutes per side.",
      "Cook polenta in 200 ml water for 10 minutes and finish with butter.",
      "Steam green beans.",
    ],
    tags: ["low-fodmap", "gluten-free", "renal-friendly"],
  },
  {
    id: "pork-green-bean-rice-noodles", title: "Ginger pork & green bean rice noodles", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "pork_tenderloin", g: 90 }, { id: "rice_noodles", g: 55 }, { id: "green_beans", g: 60 }, { id: "carrot", g: 30 },
      { id: "garlic_oil", g: 10 }, { id: "ginger", g: 4 }, { id: "soy_sauce_low_na", g: 6 }, { id: "rice_vinegar", g: 5 },
    ],
    steps: [
      "Soak noodles per packet.",
      "Stir-fry thin strips of pork in garlic oil with ginger for 3 minutes.",
      "Add beans and carrot for 3 minutes, then noodles, soy sauce and vinegar; toss well.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "turkey-rice-stuffed-zucchini", title: "Turkey & rice stuffed zucchini boats", slots: ["dinner"], servings: 1, prepMin: 40,
    ingredients: [
      { id: "zucchini", g: 60 }, { id: "ground_turkey", g: 80 }, { id: "white_rice", g: 45 }, { id: "canned_tomatoes", g: 60 },
      { id: "olive_oil", g: 8 }, { id: "oregano", g: 1 }, { id: "parmesan", g: 6 }, { id: "basil", g: 2 },
    ],
    steps: [
      "Cook rice. Halve the zucchini lengthways and scoop out the centres; chop the flesh.",
      "Brown turkey in oil with the chopped zucchini and oregano; stir in tomatoes and rice.",
      "Fill the zucchini, top with parmesan and bake at 190 °C for 20 minutes. Finish with basil.",
    ],
    tags: ["low-fodmap", "gluten-free"],
  },
  {
    id: "salmon-polenta-spinach", title: "Seared salmon with buttery polenta & spinach", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "salmon", g: 90 }, { id: "cornmeal", g: 45 }, { id: "spinach", g: 40 }, { id: "butter", g: 8 },
      { id: "olive_oil", g: 5 }, { id: "lemon_juice", g: 5 }, { id: "chives", g: 2 },
    ],
    steps: [
      "Cook polenta in 200 ml water for 10 minutes and stir in the butter.",
      "Sear salmon in oil 4 minutes per side.",
      "Wilt spinach in the pan with lemon juice. Serve with chives.",
    ],
    tags: ["omega-3", "low-fodmap", "gluten-free"],
  },
  {
    id: "macadamia-basil-pesto-pasta", title: "Macadamia-basil pesto pasta with green beans", slots: ["dinner", "lunch"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "gf_pasta", g: 55 }, { id: "basil", g: 10 }, { id: "macadamia", g: 15 }, { id: "olive_oil", g: 15 },
      { id: "parmesan", g: 5 }, { id: "green_beans", g: 50 }, { id: "lemon_juice", g: 5 },
    ],
    steps: [
      "Blend basil, macadamias, oil, parmesan and lemon with 2 tbsp water into a pesto (garlic-free).",
      "Cook the pasta, adding the green beans for the last 4 minutes.",
      "Drain and toss with the pesto.",
    ],
    tags: ["energy-dense", "renal-friendly", "low-fodmap", "vegetarian", "gluten-free"],
  },
  {
    id: "veg-egg-white-noodle-stir-fry", title: "Vegetable & egg-white rice-noodle stir-fry with macadamias", slots: ["dinner"], servings: 1, prepMin: 20,
    ingredients: [
      { id: "rice_noodles", g: 60 }, { id: "egg_white", g: 60 }, { id: "bok_choy", g: 60 }, { id: "carrot", g: 40 },
      { id: "bean_sprouts", g: 30 }, { id: "garlic_oil", g: 15 }, { id: "macadamia", g: 12 }, { id: "soy_sauce_low_na", g: 5 },
    ],
    steps: [
      "Soak noodles per the packet.",
      "Scramble egg whites in a little of the oil; set aside.",
      "Stir-fry carrot, bok choy and sprouts in the remaining oil, add noodles, egg and soy sauce, and toss with chopped macadamias.",
    ],
    tags: ["energy-dense", "renal-friendly", "low-fodmap"],
  },
];
