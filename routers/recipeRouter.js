"use strict";
module.exports = (express) => {
  console.log("router running");
  const router = express.Router();
  const axios = require("axios");

  // Knex Setup
  require("dotenv").config();
  const knex = require("knex")({
    client: "postgresql",
    connection: {
      database: process.env.DATABASE,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
    },
  });

  const RecipeService = require("../services/recipeService");
  const recipeService = new RecipeService(knex);

  router.route("/:recipeId").get(getRecipeData);

  function getRecipeData(req, res) {
    let apiData;
    return axios
      .get(
        `https://api.spoonacular.com/recipes/${req.params.recipeId}/information?&apiKey=ba5aba2ccf0049008995c74dfc10d62a`
      )
      .then((info) => {
        apiData = info.data;
        console.log(apiData);
        return recipeService.checkData(apiData.id);
      })
      .then((boolean) => {
        console.log("yes");
        if (!boolean) {
          return recipeService.insert(apiData);
        } else {
          return;
        }
      })
      .then(() => {
        //Send data to res.render
        res.render("recipes", {
          api_id: apiData.id,
          title: apiData.title,
          summary: apiData.summary,
          author: apiData.sourceName,
          preparation_time: apiData.readyInMinutes,
          image_path: apiData.image,
          //   instructions: apiData.analyzedInstructions[0].steps.map((x) => (x = x.step)).split("@@"),
          servings: apiData.servings,
          ingredients: apiData.ingredients,
        });
      })
      .catch((err) => {
        console.log("axios get err", err);
      });
    //Check if recipe already in database

    //   apiData = knex
    //     .select(
    //       "recipes.api_id",
    //       "recipes.title",
    //       "recipes.author",
    //       "recipes.summary",
    //       "recipes.instructions",
    //       "recipes.preparation_time",
    //       "recipes.image_path",
    //       "recipes.servings",
    //       "recipes.difficulty",
    //       "recipes_ingredients.ingredient_id",
    //       "recipes_ingredients.quantity",
    //       "recipes_ingredients.unit"
    //     )
    //     .from("recipes")
    //     .innerJoin(
    //       "recipes_ingredients",
    //       "recipes.api_id",
    //       "recipes_ingredients.api_id"
    //     )
    //     .innerJoin(
    //       "recipes_cuisines",
    //       "recipes.api_id",
    //       "recipes_cuisines.api_id"
    //     )
    //     .where("recipes.api_id", req.params.recipeId);
  }

  return router;
};
