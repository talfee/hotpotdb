/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

let ingredients = [];
let restaurants = [];

// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

// Fetches data from the recipe table and displays it.
async function fetchAndDisplayRecipes() {
    const tableElement = document.getElementById('Recipes');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/recipes', {
        method: 'GET'
    });

    const responseData = await response.json();
    const reciptTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    reciptTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            if(index === 1 || index === 5) {
                if (field) {
                    const date = new Date(field);
                    cell.textContent = date.toISOString().replace('T', ' ').slice(0, 19);
                } else {
                    cell.textContent = field;
                }
            } else {
                cell.textContent = field;
            }
        });
    });
}
// Fetches data from the restaurants table and displays it.
async function fetchAndDisplayRestaurants(colsToDisplaySQL) {
    const tableElement = document.getElementById('Restaurants');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/restaurants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            colsToDisplaySQL: colsToDisplaySQL
        })
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from the Made_For table and displays it.
async function fetchAndDisplayMadeFor() {
    const tableElement = document.getElementById('MadeFor');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/madeFor', {
        method: 'GET'
    });

    const responseData = await response.json();
    const reciptTableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    reciptTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Inserts new use inputted values into the recipe table. (for insert feature)
async function insertRecipe(event) {
    event.preventDefault();

    const title = document.getElementById('insertTitle').value;
    const description = document.getElementById('insertDescription').value;
    const rating = 0.000;
    let now = new Date();
    const creationDate = now.toISOString().slice(0, 19).concat("Z")
    const recipeId = await getMaxRecipeID() + 1;
    const displayName = document.getElementById("userSelectDropdown").value;
    const servingSize = document.getElementById("insertServingSize").value;
    const ingredientList = ingredients;
    const restaurantList = restaurants;


    const response = await fetch('/insert-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipeId: recipeId,
            rating: rating,
            servingSize: servingSize,
            description: description,
            titleName: title,
            creationDate: creationDate,
            displayName: displayName,
            ingredients: ingredientList,
            restaurants: restaurantList
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Recipe posted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error adding recipe post!";
    }
}

// Gets the curernt recipe post info for updating.
async function getRecipeToUpdate(event) {
    event.preventDefault();

    const recipeToUpdate = document.getElementById('updateRecipeID').value;

    const response = await fetch('/recipe-to-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipeID: recipeToUpdate,
        })
    });

    document.getElementById("fieldsForUpdating").style.display = "block";

    const responseData = await response.json();
    const recipeIngredientTable = responseData.data;

    document.getElementById("updateServingSize").style.fontWeight = "bold";
    document.getElementById("updateDescription").style.fontWeight = "bold";
    document.getElementById("updateTitle").style.fontWeight = "bold";

    document.getElementById("updateServingSize").textContent = recipeIngredientTable.rows[0][2];
    document.getElementById("updateDescription").textContent = recipeIngredientTable.rows[0][3];
    document.getElementById("updateTitle").textContent = recipeIngredientTable.rows[0][4];

}

// Updates recipe post using user input in recipe table (for update feature)
document.getElementById("update").addEventListener("click", async function () {
    const recipeToUpdate = document.getElementById('updateRecipeID').value;
    let newServingSize = document.getElementById("newServingSize").value;
    if (!newServingSize) {
        newServingSize = document.getElementById("updateServingSize").textContent;
    }
    let oldDescription = document.getElementById("updateDescription").textContent;

    let newDescription = document.getElementById("newDescription").value;
    if (!newDescription) {
        newDescription = document.getElementById("updateDescription").textContent;
    }
    let newTitle = document.getElementById("newTitle").value;
    if (!newTitle) {
        newTitle = document.getElementById("updateTitle").textContent;
    }

    const response = await fetch('/update-recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipeID: recipeToUpdate,
            servingSize: newServingSize,
            oldDescription: oldDescription,
            newDescription: newDescription,
            title: newTitle
        })
    });

    const responseData = await response.json();

    const messageElement = document.getElementById('updateRecipeResultMsg');

    if (responseData.success) {
        document.getElementById("fieldsForUpdating").style.display = "none";
        messageElement.textContent = "Recipe Updated Successfully";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating recipe!";
    }
});

// Delete tuple in recipe table (for delete feature)
async function deleteTupleRecipetable(event) {
    event.preventDefault();

    const recipeIdValue = document.getElementById('recipeIdToDelete').value;

    const response = await fetch('/delete-tuple-recipeTable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipeId: recipeIdValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('deleteRecipeTupleResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Deleted tuple from recipe table successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error deleting tuple!";
    }
}

// Get max recipe ID from recipe table. (for new recipeID value when inserting a new recipe into table)
async function getMaxRecipeID() {
    const response = await fetch("/getMax-recipeID", {
        method: 'GET'
    });

    const responseData = await response.json();
    if (responseData.success) {
        const maxId = responseData.data;
        return maxId;
    } else {
        alert("Error in retrieving maxId!");
    }
}

// Gets avg rating for each serving size (for group by feature)
async function rateServingSizeRecipeTable(event) {
    event.preventDefault();

    const tableElement = document.getElementById('rateServingSizeRecipeResultTable');
    const tableBody = tableElement.querySelector('tbody');
    const response = await fetch("/rate-servingSize-RecipeTable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const reciptTableContent = responseData.data;
    const messageElement = document.getElementById("avergeRatingResultMsg");

    if (reciptTableContent.length <= 0) {
        messageElement.textContent = "No data loaded";
    } else {
        document.getElementById("rateServingSizeRecipeResultTable").style.display = "table";
        messageElement.textContent = "Data succesfully loaded for average ratings";

    }

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    reciptTableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });


}

// Gets the resteraunts for which all recipes are made for (for division feature)
async function allRecipesRestaurantTable() {
    const response = await fetch("/allRecipes-RestaurantTable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('divisionResultMsg');

    if (responseData.success) {
        if(responseData.restaurants.length <= 0) {
            messageElement.textContent = `There are no restaurants for which all recipes are made for`;
        }

        const resultRestaurants = responseData.restaurants.join("; ")

        messageElement.textContent = `Restaurants with all recipes: ${resultRestaurants}`;
    } else {
        alert("Error in division with restaurant table!");
    }
}

// Fetch all ingredients from database for dropdown
async function fetchIngredients() {
    const ingredientDropdown = document.getElementById("ingredientSelectDropdown");

    try {
        const response = await fetch("/ingredients", {
            method: "GET"
        });
        
        const ingredients = await response.json();

        // Always clear old, already fetched data before new fetching process.
        ingredientDropdown.innerHTML = "";

        ingredients.forEach(ingredient => {
            const option = document.createElement("option");
            option.value = ingredient;
            option.textContent = ingredient;
            ingredientDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching ingredients:", error);
    }
}

// Add ingredient to the list for inserting
document.getElementById("addIngredient").addEventListener("click", function () {
    const ingredientDropdown = document.getElementById("ingredientSelectDropdown");
    const ingredientList = document.getElementById("ingredientList");
    const selectedIngredient = ingredientDropdown.value; 

    if (!selectedIngredient) return;

    
    const existingIngredients = [...ingredientList.children].map(item => item.textContent.trim());

    if (!existingIngredients.includes(selectedIngredient)) {
        
        const ingredientDiv = document.createElement("div");
        ingredientDiv.textContent = selectedIngredient;

        ingredientList.appendChild(ingredientDiv);
        ingredients.push(ingredientDiv.textContent);
    } else {
        alert(`${selectedIngredient} is already in the list!`);
    }
});

// Fetch all restaurants from table for dropdown
async function fetchRestaurants() {
    const restaurantDropdown = document.getElementById("restaurantSelectDropdown");

    try {
        const response = await fetch("/restaurant", {
            method: "GET"
        });
        
        const restaurants = await response.json();

        // Always clear old, already fetched data before new fetching process.
        restaurantDropdown.innerHTML = "";

        restaurants.forEach(restaurant => {
            const option = document.createElement("option");
            option.value = restaurant;
            option.textContent = restaurant;
            restaurantDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching restaurants:", error); 
    }
}

// Add restaurant to the list
document.getElementById("addRestaurant").addEventListener("click", function () {
    const restaurantDropdown = document.getElementById("restaurantSelectDropdown");
    const restaurantList = document.getElementById("restaurantList");
    const selectedRestaurant = restaurantDropdown.value; 

    if (!selectedRestaurant) return;


    const existingRestaurants = [...restaurantList.children].map(item => item.textContent.trim());

    if (!existingRestaurants.includes(selectedRestaurant)) {

        const restaurantDiv = document.createElement("div");
        restaurantDiv.textContent = selectedRestaurant;

        restaurantList.appendChild(restaurantDiv);
        restaurants.push(restaurantDiv.textContent);
    } else {
        alert(`${selectedRestaurant} is already in the list!`);
    }
});

// Fetch all users from databased for dropdown 
async function fetchUsers() {
    const userDropdown = document.getElementById("userSelectDropdown");

    try {
        const response = await fetch("/users", {
            method: "GET"
        });
        
        const users = await response.json();

        // Always clear old, already fetched data before new fetching process.
        userDropdown.innerHTML = "";

        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user;
            option.textContent = user;
            userDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching users:", error); 
    }
}


// toggles for restaurants table (projection feature)
async function toggleRestaurantTableContent() {

    let selectedSQL = ["Full_Address", "City_Province", "Name"];

    if (!document.getElementById("fullAddress").checked) {
        selectedSQL = selectedSQL.filter(col => col !== "Full_Address");
    }
    if (!document.getElementById("cityProvince").checked) {
        selectedSQL = selectedSQL.filter(col => col !== "City_Province");
    }
    if (!document.getElementById("Name").checked) {
        selectedSQL = selectedSQL.filter(col => col !== "Name");
    }
    const tableHeader = document.getElementById("restaurantTableHeader");

    tableHeader.innerHTML = "";

    const headerRow = document.createElement("tr");

    selectedSQL.forEach(column => {
        const th = document.createElement("th");
        th.textContent = column.replace("_", " ");
        headerRow.appendChild(th);
    });


    tableHeader.appendChild(headerRow);
    
    fetchAndDisplayRestaurants(selectedSQL)
}


// gets the recipes made for restaurants located in the city/prov given by user (for join feature)
async function getRecipesForRest(event) {
    event.preventDefault();

    const tableElement = document.getElementById('recipeRest');
    const tableBody = tableElement.querySelector('tbody');
    const cityProv = document.getElementById("joinCityProv").value;

    const response = await fetch('/recipe_rest', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            cityProv: cityProv
        })
    });

    const responseData = await response.json();
    const recipeRestContent = responseData.data;
    const messageElement = document.getElementById("RecipeRestJoinMsg");
    if (recipeRestContent.length <= 0) {
        messageElement.textContent = "No recipes found for restaurants in: " + cityProv;
    } else {
        document.getElementById("recipeRest").style.display = "table";
        messageElement.textContent = "Recipes succesfully loaded for restaurants in: " + cityProv;
    }

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    recipeRestContent.forEach(recipe => {
        const row = tableBody.insertRow();
        recipe.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}

// Gets cities that have 3 or more Hot Pot restaurants present in them (for having feature)
async function getHotCities() {
    const tableElement = document.getElementById('HotCitiesTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch("/hot_cities", {
        method: 'GET'
    });

    const responseData = await response.json();
    const hotCitiesContent = responseData.data
    const messageElement = document.getElementById('HotCitiesMsg');

    if (hotCitiesContent.length <= 0) {
        messageElement.textContent = "No cities found";
    } else {
        document.getElementById("HotCitiesTable").style.display = "table";
        messageElement.textContent = "Cities successfully loaded";
    }

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    hotCitiesContent.forEach(city => {
        const row = tableBody.insertRow();
        city.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}

// Gets the months where the avg recipe ratings is the lowest (for nested aggregation feature)
async function getMonth() {
    const tableElement = document.getElementById('MonthTable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch("/month", {
        method: 'GET'
    });

    const responseData = await response.json();
    const hotCitiesContent = responseData.data
    const messageElement = document.getElementById('MonthMsg');

    if (hotCitiesContent.length <= 0) {
        messageElement.textContent = "No Months found";
    } else {
        document.getElementById("MonthTable").style.display = "table";
        messageElement.textContent = "Month successfully loaded";
    }

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    hotCitiesContent.forEach(city => {
        const row = tableBody.insertRow();
        city.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    toggleRestaurantTableContent();

    document.getElementById("insertRecipe").addEventListener("submit", insertRecipe);
    document.getElementById("updateRecipeTable").addEventListener("submit", getRecipeToUpdate);
    document.getElementById("deleteRecipetable").addEventListener("submit", deleteTupleRecipetable);
    document.getElementById("rateServingSizeRecipeTable").addEventListener("click", rateServingSizeRecipeTable);
    document.getElementById("allRecipesRestaurantTable").addEventListener("click", allRecipesRestaurantTable);
    document.getElementById("RecipesForResteraunts").addEventListener("submit", getRecipesForRest);
    document.getElementById("HotCitiesBtn").addEventListener("click", getHotCities);
    document.getElementById("MonthBtn").addEventListener("click", getMonth);
    document.getElementById("restaurantSearchForm").addEventListener("submit", searchRestaurantsByFilters);
};

// General function to refresh the displayed table data.
function fetchTableData() {
    fetchAndDisplayRecipes();
    fetchAndDisplayMadeFor();
    fetchIngredients();
    fetchRestaurants();
    fetchUsers();
    fetchAndDisplayRestaurants();
    toggleRestaurantTableContent();
}

document.addEventListener("DOMContentLoaded", function () {
    const filtersContainer = document.getElementById("filtersContainer");

    // Add filter row
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-filter")) {
            addFilterRow(event.target);
        }
    });

    function addFilterRow(button) {
        const currentRow = button.closest(".filter-row");
        const currentActionsCol = currentRow.querySelector(".col-md-3:last-child");

        // replace current row's + sign with AND/OR dropdown and a '-' button
        currentActionsCol.innerHTML = `
            <select class="form-select logic-dropdown mb-2">
                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>
            <button type="button" class="btn btn-danger w-100 remove-filter">-</button>
        `;

        // create new row with dropdown, text box and + button
        const row = document.createElement("div");
        row.classList.add("row", "mb-3", "filter-row");

        row.innerHTML = `
            <div class="col-md-3">
                <select class="form-select column-dropdown">
                    <option value="Name">Restaurant Name</option>
                    <option value="Full_Address">Full Address</option>
                    <option value="City_Province">City/Province</option>
                </select>
            </div>
            <div class="col-md-6">
                <input type="text" class="form-control condition-input" placeholder="Enter filter condition">
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn-secondary w-100 add-filter">+</button>
            </div>
        `;

        filtersContainer.appendChild(row);
    }

    // Remove filter row
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-filter")) {
            event.target.closest(".filter-row").remove();
        }
    });
});

async function searchRestaurantsByFilters(event) {
    event.preventDefault();

    let conditions = [];
    let rows = document.querySelectorAll(".filter-row");
    let prevRow;

    rows.forEach((row, index) => {
        const column = row.querySelector(".column-dropdown").value;
        const condition = row.querySelector(".condition-input").value.trim();
        let logic;

        if (index > 0 && rows.length > 1) {
            const currentActionsCol = prevRow.querySelector(".col-md-3:last-child");
            logic = currentActionsCol.querySelector(".logic-dropdown").value;
        } else {
            logic = "";
        }

        if (column && condition) {
            conditions.push(`${logic} ${column} = '${condition}'`);

        }

        prevRow = row;
    });

    const sql = `${conditions.join(" ")}`;
    
    const response = await fetch("/search-restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql })
    });

    const responseData = await response.json();
    const recipeRestContent = responseData.data;
    
    const tableElement = document.getElementById("restaurantSearchResult");
    const tableBody = tableElement.querySelector("tbody");
    const messageElement = document.getElementById("restaurantSearchMsg");

    if (recipeRestContent.length <= 0) {
        messageElement.textContent = "No restaurants found";
        tableElement.style.display = "none";
    } else {
        messageElement.textContent = "Restaurants successfully loaded";
        tableElement.style.display = "table";
    }

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    recipeRestContent.forEach((restaurant) => {
        const row = tableBody.insertRow();
        restaurant.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}
