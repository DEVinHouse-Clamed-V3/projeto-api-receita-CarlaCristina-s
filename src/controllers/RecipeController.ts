import { AppDataSource } from "../data-source";
import { Recipe } from "../entities/Recipe";
import { RecipeIngredient } from "../entities/RecipeIngredient";
import { RecipeStep } from "../entities/RecipeStep";
import { Request, Response } from "express";

class RecipeController {
  private recipeRepository = AppDataSource.getRepository(Recipe);
  private recipeIngredientRepository = AppDataSource.getRepository(RecipeIngredient);
  private recipeStepRepository = AppDataSource.getRepository(RecipeStep);

  create = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const recipe = await this.recipeRepository.save(body);

      body.ingredients.forEach(async (ingredient: { name: string }) => {
        await this.recipeIngredientRepository.save({
          ...ingredient,
          recipe_id: recipe.id,
        });
      });

      res.status(201).json(recipe);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const recipes = await this.recipeRepository.find({relations: ["ingredients"]});
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default RecipeController;