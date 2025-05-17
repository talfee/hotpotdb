const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

// get recipes table from Db
router.get('/recipes', async (req, res) => {
    const tableContent = await appService.fetchRecipesFromDb();
    res.json({data: tableContent});
});

// get restaurants table from Db for projection aggregation
router.post('/restaurants', async (req, res) => {
    let {colsToDisplaySQL} = req.body;
    const tableContent = await appService.fetchRestaurantsFromDb(colsToDisplaySQL);
    res.json({data: tableContent});
});

// get madeFor table from Db
router.get('/madeFor', async (req, res) => {
    const tableContent = await appService.fetchMadeForFromDb();
    res.json({data: tableContent});
});

// get recipes for specific resteraunts
router.post('/recipe_rest', async (req, res) => {
    const {cityProv} = req.body;
    const tableContent = await appService.getRecipeRest(cityProv);
    if (tableContent.length > 0) {
        res.json({ success: true,
                    data: tableContent});
    } else {
        res.status(500).json(
            {success: false,
            data: tableContent});
    }
});

// send use info to insert new recipe tuple
router.post("/insert-recipe", async (req, res) => {
    const {recipeId, rating, servingSize, description, titleName, creationDate, displayName, ingredients, restaurants} = req.body;
    const insertResult = await appService.insertRecipe(recipeId, rating, servingSize, description, titleName, creationDate, displayName, ingredients, restaurants);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// get the recipe info based on user inputted recipeID 
router.post("/recipe-to-update", async (req, res) => {
    const {recipeID} = req.body;
    const currentResult = await appService.currentRecipe(recipeID);
    if (currentResult) {
        res.json({data: currentResult});
    } else {
        console.error("Error getting recipe with recipeID: " + recipeID);
        res.status(500).json({ success: false });
    }
});

// update recipe with recipeID based on user info
router.post("/update-recipe", async (req, res) => {
    const {recipeID, servingSize, oldDescription, newDescription, title} = req.body;
    const currentResult = await appService.updateRecipe(recipeID, servingSize, oldDescription, newDescription, title);
    if (currentResult) {
        res.json({success: true});
    } else {
        res.status(500).json({ success: false });
    }
});

// delete recipe with recipeID from database
router.post("/delete-tuple-recipeTable", async (req, res) => {
    const { recipeId} = req.body;
    const updateResult = await appService.deleteTupleRecipetable(recipeId);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// get the ingredient names from the database
router.get('/ingredients', async (req, res) => {
    try {
        
        const ingredients = await appService.fetchIngredients(); 
        res.json(ingredients); 
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        res.status(500).json({ success: false});
    }
});

// get the restaurant's full address from the database
router.get('/restaurant', async (req, res) => {
    try {
        const restaurants = await appService.fetchRestaurants(); 
        res.json(restaurants); 
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ success: false});
    }
});

// get the display_names for all user in database
router.get('/users', async (req, res) => {
    try {
        
        const users = await appService.fetchUsers(); 
        res.json(users); 
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false});
    }
});

// get the max recipeID in recipe table
router.get('/getMax-recipeID', async (req, res) => {
    const result = await appService.getMaxRecipeID();
    if (result) {
        res.json({
            success: true,
            data: result
        });
    } else {
        res.status(500).json({ 
            success: false,
            data: result 
        });
    }
});

// get the avg ratings for each serving size in the recipe table
router.get('/rate-servingSize-RecipeTable', async (req, res) => {
    const tableContent = await appService.rateServingSizeRecipeTable();
    if (tableContent) {
        res.json({data: tableContent});
    }
});

// Division for restaurant table
router.get('/allRecipes-RestaurantTable', async (req, res) => {
    const restaurantsWithAllRecipes = await appService.allRecipesRestaurantTable();
    if (restaurantsWithAllRecipes) {
        res.json({ 
            success: true,  
            restaurants: restaurantsWithAllRecipes
        });
    } else {
        res.status(500).json({ 
            success: false, 
            restaurants: restaurantsWithAllRecipes
        });
    }
});

// aggregation with having (Hot cities)
router.get('/hot_cities', async (req, res) => {
    const hotCities = await appService.getHotCities();
    if (hotCities) {
        res.json({ 
            success: true,  
            data: hotCities
        });
    } else {
        res.status(500).json({ 
            success: false, 
            data: hotCities
        });
    }
});

// get the month with the lowest average rating from recipe table (nested aggregation)
router.get('/month', async (req, res) => {
    const newestRecipes = await appService.getMonth();
    if (newestRecipes) {
        res.json({ 
            success: true,  
            data: newestRecipes
        });
    } else {
        res.status(500).json({ 
            success: false, 
            data: newestRecipes
        });
    }
});


// get restaurants with user inputed WHERE clauses
router.post("/search-restaurants", async (req, res) => {
    try {
        const { sql } = req.body;     
        const searchResults = await appService.fetchRestaurantsWithFilters(sql);
        res.json({ data: searchResults });
    } catch (error) {
        console.error("Error searching restaurants:", error);
        res.status(500).json({ error: "Failed to fetch restaurant data" });
    }
});

module.exports = router;