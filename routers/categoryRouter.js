// "use strict";

// module.exports = (express) => {
//   const router = express.Router();
//   const axios = require("axios");

//   //   router.route("/").get(getSearch);
//   //   router.route("/:cuisine").get(getSearchQuery);

//   // Knex Setup
//   require("dotenv").config();
//   const knex = require("knex")({
//     client: "postgresql",
//     connection: {
//       database: process.env.DATABASE,
//       user: process.env.USERNAME,
//       password: process.env.PASSWORD,
//     },
//   });
// };

const express = require("express");

class categoryRouter {
  constructor(recipeService, ingredientService, reviewService, categoryService, userService) {
    this.recipeService = recipeService;
    this.ingredientService = ingredientService;
    this.reviewService = reviewService;
    this.categoryService = categoryService;
    this.userService = userService;
  }

  router() {
    let router = express.Router();
    // router.get("/api/users", this.getAllRecipe.bind(this));
    router.get("", this.getRecipes.bind(this));
    router.get("/:cuisine", this.getCuisineRecipes.bind(this));
    router.get("/:cuisine/bookmark", this.getBookmark.bind(this));
    router.post("/:cuisine/bookmark/:id", this.postBookmark.bind(this));

    // router.put("/api/users/:id", this.editUser.bind(this));
    // router.delete("/api/users/:id", this.deleteUser.bind(this));
    return router;
  }

  async getRecipes(request, response){
    console.log(request.params);
    let cuisine = request.params.cuisine;
    console.log(`Get ${cuisine} Recipes`);

    let recipes_res = await this.recipeService.getRecipes(6);

    console.log(recipes_res);

    response.render("category", {cuisine: cuisine, recipes: recipes_res});
  }

  async getCuisineRecipes(request, response){
    console.log(request.params);
    let cuisine = request.params.cuisine;
    console.log(`Get ${cuisine} Recipes`);

    let recipes_res = await this.categoryService.getRecipeByCuisine(cuisine);

    let recipe_array = [];
    for(let i = 0;i < Math.min(recipes_res.length, 6);i++){
      recipe_array.push(recipes_res[i])
    }
    console.log(recipe_array);

    response.render("category", {cuisine: cuisine, recipes: recipe_array});
  }

  async getBookmark(request, response){
    console.log("bookmark_recipe_id");
    let bookmark_recipe_id = await this.userService.getFavoriteRecipe(1); //hardcode
    let bookmark_recipes = [];
    for(let i=0;i<bookmark_recipe_id.length;i++){
      let bookmark_recipe = await this.recipeService.getRecipeById(bookmark_recipe_id[i]["recipe_id"])
      bookmark_recipes.push(bookmark_recipe[0]);
    }
    console.log(bookmark_recipes);
    // bookmark_recipes is like this:
    // [
    //   {
    //     id: 1905,
    //     api_id: 637908,
    //     title: 'Chicken and Miso Ramen Noodle Soup',
    //     author: 'Foodista',
    //     summary: 'xxxxxxxxxx',
    //     instructions: 'xxxxxxxxxxx',
    //     preparation_time: 30,
    //     image_path: 'https://spoonacular.com/recipeImages/637908-312x231.jpg',
    //     servings: '2',
    //     difficulty: null,
    //     created_at: 2021-03-19T09:20:38.817Z,
    //     updated_at: 2021-03-19T09:20:38.817Z,
    //     rating: null
    //   },
    // ]
    response.render("category", {cuisine: "bookmark", recipes: bookmark_recipes});
  }

  async postBookmark(request, response){
    let body = request.body;
    console.log(body);

    let recipe_id = 0;
    let user_id = 1;

    let addFavoriteRecipe = await this.userService.addFavoriteRecipe(user_id, recipe_id);
  }

}

module.exports = categoryRouter;