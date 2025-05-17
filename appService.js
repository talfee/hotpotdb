const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

// run SQL to get recipes table from Db
async function fetchRecipesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Recipe');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// run SQL to get restaurants table from Db for projection aggregation
async function fetchRestaurantsFromDb(colsToDisplaySQL) {
    let colsToDisplaySQLString;
    if (colsToDisplaySQL) {
        colsToDisplaySQLString = colsToDisplaySQL.join(', ');
        return await withOracleDB(async (connection) => {
            const newQuery = `SELECT ${colsToDisplaySQLString} FROM Restaurant`;
            const result = await connection.execute(newQuery)
            return result.rows;
        }).catch(() => {
            return [];
        });
    }

}

// run SQL to get Made_for table from Db
async function fetchMadeForFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Made_For');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// run SQL to insert a new recipe tuple into the recipe, recipe_rating, made_for, and needs table
async function insertRecipe(recipeId, rating, servingSize, description, titleName, creationDate, displayName, ingredients, restaurants) {
    const res1 = await withOracleDB(async (connection) => {
        const descriptionExists = await connection.execute(
            `SELECT COUNT(*) AS count FROM Recipe_Rating WHERE Description = :description`,
            { description },
            { autoCommit: true }
        )
        let result1 = false;
        if (descriptionExists.rows[0][0] === 0) {
             result1 = await connection.execute(
                "INSERT INTO Recipe_Rating (Description, Rating) VALUES (:description, :rating)",
                [description, rating],
                { autoCommit: true }
            );
            return result1.rowsAffected && result1.rowsAffected > 0
        } else {
            return true;
        }
        
    }).catch(() => {
        return false;
    });

    const res2 = await withOracleDB(async (connection) => {

        const formattedCreationDate = `${creationDate.slice(0, 10)} ${creationDate.slice(11, 19)}`;
        const result2 = await connection.execute(
            `INSERT INTO Recipe (Recipe_ID, Update_Date, Serving_Size, Description, Title_Name, Creation_Date, Display_Name) 
            VALUES (:recipeID, null, :servingSize, :description, :titleName, TIMESTAMP '${formattedCreationDate}', :displayName)`,
            [recipeId, servingSize, description, titleName, displayName],
            { autoCommit: true }
        );

        return result2.rowsAffected && result2.rowsAffected > 0;
    }).catch(() => {
        return false;
    });

    return res1 && res2 && await withOracleDB(async (connection) => {
        let results = [];
        for (ingr of ingredients) {
            const result = await connection.execute(
                `INSERT INTO Needs (Recipe_ID, Ingredient_Name) 
                VALUES (:recipeID, :ingr)`,
                [recipeId, ingr],
                { autoCommit: true }
            );

            results.push(result);
        }

        for (rest of restaurants) {
            const result = await connection.execute(
                `INSERT INTO Made_For (Recipe_ID, Full_Address) 
                VALUES (:recipeID, :irest)`,
                [recipeId, rest],
                { autoCommit: true }
            );

            results.push(result);
        }

        let retValue = true;
        for (r of results) {
            if (!r.rowsAffected || r.rowsAffected <= 0) {
                retValue = false;
                break;
            }
        }
        return retValue;
    }).catch(() => {
        return false;
    });
}

// run SQL to retrieve all tuple content from recipe table
async function currentRecipe(recipeID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            "SELECT * FROM Recipe WHERE recipe_id = :recipeID",
            [recipeID],
            { autoCommit: true }
        );

        return result;
    }).catch(() => {
        return -1;
    });
}

// run SQL to update a tuple for the recipe table
async function updateRecipe(recipeID, servingSize, olddescription, newdescription, title) {
    return await withOracleDB(async (connection) => {
        const current = new Date();
        const updateDate = `${current.toISOString().slice(0, 10)} ${current.toISOString().slice(11, 19)}`;
        const descriptionExists = await connection.execute(
            `SELECT COUNT(*) AS count FROM Recipe_Rating WHERE Description = :newdescription`,
            { newdescription },
            { autoCommit: true }
        )

        await connection.execute(
            `UPDATE Recipe SET Description = NULL WHERE Recipe_ID = :recipeID`,
            [recipeID],
            { autoCommit: true }
        );

        if (descriptionExists.rows[0][0] === 0) {
            console.log("Old: " + olddescription);
            console.log("New: " + newdescription);
            await connection.execute(
                `UPDATE Recipe_Rating SET Description = :newdescription WHERE Description = :olddescription`,
                { newdescription, olddescription },
                { autoCommit: true }
            );
        }

        const result = await connection.execute(
            `UPDATE Recipe SET Update_Date = TIMESTAMP '${updateDate}', Serving_Size = :servingSize, Description = :newdescription, Title_Name = :title WHERE Recipe_ID = :recipeID`,
            [servingSize, newdescription, title, recipeID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// run SQL to fetch all ingredient names from Ingredients table
async function fetchIngredients() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute("SELECT Name FROM Ingredients");

        return result.rows.map(row => row[0]);
    }).catch(() => {
        return -1;
    });
}

// run SQL to fetch all restaurants names from Restaurants table
async function fetchRestaurants() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute("SELECT Full_Address FROM Restaurant");

        return result.rows.map(row => row[0]);
    }).catch(() => {
        return -1;
    });
}

// run SQL to fetch all user's display names from Hotpot users table
async function fetchUsers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute("SELECT Display_Name FROM Hotpot_user");

        return result.rows.map(row => row[0]);
    }).catch(() => {
        return -1;
    });
}

// run SQL to find number of tuples/rows in recipe table
async function getMaxRecipeID() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Max(Recipe_ID) FROM RECIPE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

// run SQL to delete a single tuple/row from recipe table
async function deleteTupleRecipetable(recipeId) {
    return await withOracleDB(async (connection) => {

        const madeFor = await connection.execute(
            `DELETE FROM Made_For WHERE Recipe_ID=:recipeId`,
            [recipeId],
            { autoCommit: true }
        )

        const first = await connection.execute(
            `DELETE FROM NEEDS WHERE Recipe_ID=:recipeId`,
            [recipeId],
            { autoCommit: true }
        )
        const result = await connection.execute(
            `DELETE FROM RECIPE WHERE Recipe_ID=:recipeId`,
            [recipeId],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// run SQL to get the average rating of each serving size group
async function rateServingSizeRecipeTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT Serving_Size, AVG(Rating)
            FROM Recipe r, Recipe_Rating rr
            WHERE r.Description = rr.Description
            GROUP BY Serving_Size`);
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

// run SQL to get list of restaurants that make all recipes (division)
async function allRecipesRestaurantTable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT R.Full_Address
            FROM Restaurant R
            WHERE NOT EXISTS (
                SELECT Re.Recipe_ID
                FROM Recipe Re
                WHERE NOT EXISTS (
                    SELECT M.Recipe_ID
                    FROM Made_For M
                    WHERE M.Recipe_ID = Re.Recipe_ID
                    AND M.Full_Address = R.Full_Address
                )
            )`
        );

        return result.rows; 
    }).catch(() => {
        return -1;
    });
}

// run SQL to get all cities with 3 or more restaurants (aggregation with having) 
async function getHotCities() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `   SELECT City_Province, Count(*)
                FROM Restaurant 
                GROUP BY City_Province
                HAVING count(*) > 3`
        );

        return result.rows;
    }).catch(() => {
        return [];
    });
}

// run SQL to get month with lowest average rating across all months (nested aggregation)
async function getMonth() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT  TO_CHAR(Creation_Date, 'MM'), AVG(rating)
            FROM Recipe r, Recipe_rating rr
            WHERE r.description = rr.description
            GROUP BY TO_CHAR(Creation_Date, 'MM')
            HAVING AVG(rating) <= ALL (SELECT AVG(rating)
                                    FROM Recipe r2, Recipe_rating rr2
                                    WHERE r2.description = rr2.description
                                    GROUP BY TO_CHAR((r2.Creation_Date), 'MM'))`
        );

        return result.rows;
    }).catch(() => {
        return [];
    });
}

// run SQL to get all the restaurants in cityProv
async function getRecipeRest(cityProv) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT re.Full_Address, re.City_Province, re.Name, r.Recipe_ID, r.Update_Date, r.Serving_Size, r.Description, r.Title_Name, r.Creation_Date, r.Display_Name 
            FROM Recipe r, Made_for mf, Restaurant re 
            WHERE r.Recipe_ID = mf.Recipe_ID AND mf.Full_Address = re.Full_Address AND re.City_Province = :cityProv`,
            [cityProv],
            { autoCommit: true }
        )
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// run SQL to restaurants based on user inputted WHERE clauses (selection)
async function fetchRestaurantsWithFilters(sql) {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(
                `SELECT * 
                FROM Restaurant  
                WHERE ` + sql,
            );
            return result.rows;
        } catch (error) {
            console.error("Database query error:", error);
            return [];
        }
    }).catch(() => {
        return [];
    });
}


module.exports = {
    fetchRestaurantsWithFilters,
    testOracleConnection,
    fetchRecipesFromDb,
    fetchRestaurantsFromDb,
    fetchMadeForFromDb,
    insertRecipe,
    currentRecipe,
    fetchIngredients,
    fetchRestaurants,
    fetchUsers,
    getMaxRecipeID,
    rateServingSizeRecipeTable,
    deleteTupleRecipetable,
    updateRecipe,
    allRecipesRestaurantTable,
    getRecipeRest,
    getHotCities,
    getMonth
};