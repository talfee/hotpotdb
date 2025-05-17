drop table Admin CASCADE CONSTRAINTS PURGE;
drop table Hotpot_user CASCADE CONSTRAINTS PURGE;
drop table Review_Score CASCADE CONSTRAINTS PURGE;
drop table Review CASCADE CONSTRAINTS PURGE;
drop table Broth CASCADE CONSTRAINTS PURGE;
drop table Dipping_Sauce CASCADE CONSTRAINTS PURGE;
drop table Restaurant CASCADE CONSTRAINTS PURGE;
drop table Recipe_Rating CASCADE CONSTRAINTS PURGE;
drop table Recipe CASCADE CONSTRAINTS PURGE;
drop table Ingredients CASCADE CONSTRAINTS PURGE;
drop table Condiment CASCADE CONSTRAINTS PURGE;
drop table Carb_Cooking_Time CASCADE CONSTRAINTS PURGE;
drop table Carb CASCADE CONSTRAINTS PURGE;
drop table Protein_Texture CASCADE CONSTRAINTS PURGE;
drop table Protein CASCADE CONSTRAINTS PURGE;
drop table Meat_Texture CASCADE CONSTRAINTS PURGE;
drop table Meat CASCADE CONSTRAINTS PURGE;
drop table Vegetables_Cooking_Time CASCADE CONSTRAINTS PURGE;
drop table Vegetables CASCADE CONSTRAINTS PURGE;
drop table Seafood_Texture CASCADE CONSTRAINTS PURGE;
drop table Seafood CASCADE CONSTRAINTS PURGE;
drop table Made_For CASCADE CONSTRAINTS PURGE;
drop table Contains CASCADE CONSTRAINTS PURGE;
drop table Add_Ons CASCADE CONSTRAINTS PURGE;
drop table Made_From CASCADE CONSTRAINTS PURGE;
drop table Needs CASCADE CONSTRAINTS PURGE;


CREATE TABLE Admin(
Display_Name 	VARCHAR(100) 	PRIMARY KEY, 
Email 		VARCHAR(100) 	NOT NULL 	UNIQUE, 
Creation_Date 	DATE 			NOT NULL, 
Password 	VARCHAR(100)	NOT NULL,
Admin_Power	VARCHAR(100)	NOT NULL
);

grant select on Admin to public;

CREATE TABLE Hotpot_user(
Display_Name 	VARCHAR(100) 	PRIMARY KEY, 
Email 		VARCHAR(100) 	NOT NULL 	UNIQUE, 
Creation_Date 	DATE 			NOT NULL, 
Password 	VARCHAR(100)	NOT NULL
);

grant select on Hotpot_user to public;

CREATE TABLE Review_Score(
Review_Comment	VARCHAR(500),	
Creation_Date	TIMESTAMP,
Score		INTEGER		NOT NULL,
PRIMARY KEY (Review_Comment, Creation_Date)
);
grant select on Review_Score to public;

CREATE TABLE Recipe_Rating(
Description	VARCHAR(1000)	PRIMARY KEY,
Rating		FLOAT(3)
);
grant select on Recipe_Rating to public;

CREATE TABLE Recipe(
Recipe_ID	INTEGER		PRIMARY KEY,
Update_Date	TIMESTAMP,
Serving_Size	INTEGER,
Description	VARCHAR(1000),
Title_Name	VARCHAR(100),
Creation_Date	TIMESTAMP,
Display_Name	VARCHAR(100)	NOT NULL,
FOREIGN KEY (Description) REFERENCES Recipe_Rating ON DELETE SET NULL,
FOREIGN KEY (Display_Name) REFERENCES Hotpot_user ON DELETE CASCADE
);
grant select on Recipe to public;

CREATE TABLE Review(
Review_ID	CHAR(20)		PRIMARY KEY,
Creation_Date	TIMESTAMP		NOT NULL,
Update_Date	TIMESTAMP,
Review_Comment	VARCHAR(500),
Recipe_ID	INTEGER		NOT NULL,
Display_Name	VARCHAR(100)	NOT NULL,
FOREIGN KEY (Creation_Date, Review_Comment) REFERENCES Review_Score(Creation_Date, Review_Comment) ON DELETE CASCADE,
FOREIGN KEY (Recipe_ID) REFERENCES Recipe ON DELETE CASCADE,
FOREIGN KEY (Display_Name) REFERENCES Hotpot_user ON DELETE CASCADE
);
grant select on Review to public;

CREATE TABLE Broth(
Name		VARCHAR(100)	PRIMARY KEY,
Flavour_Type	VARCHAR(100)	NOT NULL
);
grant select on Broth to public;

CREATE TABLE Dipping_Sauce(
Name		VARCHAR(100)	PRIMARY KEY,
Flavour_Type	VARCHAR(100)	NOT NULL
);
grant select on Dipping_Sauce to public;

CREATE TABLE Restaurant(
Full_Address	VARCHAR(1000)	PRIMARY KEY,
City_Province	VARCHAR(100),	
Name		VARCHAR(100)
);
grant select on Restaurant to public;

CREATE TABLE Ingredients(
Name 		VARCHAR(100)	PRIMARY KEY,
Price_Per_Unit	INTEGER		NOT NULL,
Calories_Per_Serving	INTEGER	NOT NULL,
Allergens	VARCHAR(100) 	NOT NULL	
);
grant select on Ingredients to public;

CREATE TABLE Condiment(
Name 		VARCHAR(100) 	PRIMARY KEY,
Base		VARCHAR(100),
FOREIGN KEY (Name) REFERENCES Ingredients ON DELETE CASCADE
);
grant select on Condiment to public;

CREATE TABLE Carb_Cooking_Time(
Type		VARCHAR(100) 	PRIMARY KEY,
Cooking_Time	INTEGER		NOT NULL
);
grant select on Carb_Cooking_Time to public;

CREATE TABLE Carb(
Name 		VARCHAR(100) 	PRIMARY KEY,
Type		VARCHAR(100)	NOT NULL,
FOREIGN KEY (Name) REFERENCES Ingredients ON DELETE CASCADE,
FOREIGN KEY (Type) REFERENCES Carb_Cooking_Time ON DELETE CASCADE
);
grant select on Carb to public;

CREATE TABLE Protein_Texture(
Cooking_Time		INTEGER 			PRIMARY KEY,
Texture		VARCHAR(100)		NOT NULL
);
grant select on Protein_Texture to public;

CREATE TABLE Protein(
Name 		VARCHAR(100) 	PRIMARY KEY,
Cooking_Time	INTEGER	NOT NULL,
FOREIGN KEY (Name) REFERENCES Ingredients
			ON DELETE CASCADE,
FOREIGN KEY (Cooking_Time) REFERENCES Protein_Texture ON DELETE CASCADE
);
grant select on Protein to public;

CREATE TABLE Meat_Texture(
Cooking_Time		INTEGER 			PRIMARY KEY,
Texture		VARCHAR(100)		NOT NULL
);
grant select on Meat_Texture to public;

CREATE TABLE Meat(
Name 		VARCHAR(100) 	PRIMARY KEY,
Cooking_Time	INTEGER	NOT NULL,
FOREIGN KEY (Name) REFERENCES Ingredients ON DELETE CASCADE,
FOREIGN KEY (Cooking_Time) REFERENCES Meat_Texture ON DELETE CASCADE
);
grant select on Meat to public;

CREATE TABLE Vegetables_Cooking_Time(
Type		VARCHAR(100) 	PRIMARY KEY,
Cooking_Time	INTEGER		NOT NULL
);
grant select on Vegetables_Cooking_Time to public;

CREATE TABLE Vegetables(
Name 		VARCHAR(100) 	PRIMARY KEY,
Type		VARCHAR(100)	NOT NULL,
FOREIGN KEY (Name) REFERENCES Ingredients ON DELETE CASCADE,
FOREIGN KEY (Type) REFERENCES Vegetables_Cooking_Time ON DELETE CASCADE
);
grant select on Vegetables to public;

CREATE TABLE Seafood_Texture(
Cooking_Time		INTEGER 			PRIMARY KEY,
Texture		VARCHAR(100)		NOT NULL
);
grant select on Seafood_Texture to public;

CREATE TABLE Seafood(
Name 		VARCHAR(100) 	PRIMARY KEY,
Cooking_Time	INTEGER	NOT NULL,
FOREIGN KEY (Name) REFERENCES Ingredients ON DELETE CASCADE,
FOREIGN KEY (Cooking_Time) REFERENCES Seafood_Texture ON DELETE CASCADE
);
grant select on Seafood to public;

CREATE TABLE Made_For(
    Recipe_ID     INTEGER,
    Full_Address  VARCHAR(1000),
    PRIMARY KEY (Recipe_ID, Full_Address),
    FOREIGN KEY (Recipe_ID) REFERENCES Recipe ON DELETE CASCADE,
    FOREIGN KEY (Full_Address) REFERENCES Restaurant(Full_Address) ON DELETE CASCADE 
);
grant select on Made_For to public;

CREATE TABLE Contains(
    Dipping_Sauce_Name VARCHAR(100),
    Ingredient_Name   VARCHAR(100),
    Quantity         INTEGER,
    PRIMARY KEY (Dipping_Sauce_Name, Ingredient_Name),
    FOREIGN KEY (Dipping_Sauce_Name) REFERENCES Dipping_Sauce(Name) ON DELETE CASCADE,
    FOREIGN KEY (Ingredient_Name) REFERENCES Ingredients(Name) ON DELETE CASCADE
);
grant select on Contains to public;

CREATE TABLE Add_Ons (
    Recipe_ID        INTEGER,
    Dipping_Sauce_Name VARCHAR(100),
    PRIMARY KEY (Recipe_ID, Dipping_Sauce_Name),
    FOREIGN KEY (Recipe_ID) REFERENCES Recipe ON DELETE CASCADE,
    FOREIGN KEY (Dipping_Sauce_Name) REFERENCES Dipping_Sauce(Name) ON DELETE CASCADE
);
grant select on Add_Ons to public;

CREATE TABLE Made_From (
    Ingredients_Name VARCHAR(1000),
    Broth_Name       VARCHAR(100),
    PRIMARY KEY (Ingredients_Name, Broth_Name),
    FOREIGN KEY (Ingredients_Name) REFERENCES Ingredients(Name) ON DELETE CASCADE,
    FOREIGN KEY (Broth_Name) REFERENCES Broth(Name) ON DELETE CASCADE
);
grant select on Made_From to public;

CREATE TABLE Needs (
    Recipe_ID        INTEGER,
    Ingredient_Name  VARCHAR(100),
    PRIMARY KEY (Recipe_ID, Ingredient_Name),
    FOREIGN KEY (Recipe_ID) REFERENCES Recipe ON DELETE CASCADE,
    FOREIGN KEY (Ingredient_Name) REFERENCES Ingredients(Name) ON DELETE CASCADE
);
grant select on Needs to public;


-- INSERT STATEMENTS
-- Admin 
INSERT INTO Admin (Display_Name, Email, Creation_Date, Password, Admin_Power) VALUES ('SuperAdmin', 'superadmin@example.com', TO_DATE('2024-01-01', 'YYYY-MM-DD'), 'SuperSecurePass123', 'Full Access');
INSERT INTO Admin (Display_Name, Email, Creation_Date, Password, Admin_Power) VALUES ('TechSupport', 'techsupport@example.com', TO_DATE('2024-02-15', 'YYYY-MM-DD'), 'TechPass456', 'Manage Users');
INSERT INTO Admin (Display_Name, Email, Creation_Date, Password, Admin_Power) VALUES ('HRManager', 'hrmanager@example.com', TO_DATE('2024-03-10', 'YYYY-MM-DD'), 'HRSecret789', 'Manage Employees');
INSERT INTO Admin (Display_Name, Email, Creation_Date, Password, Admin_Power) VALUES ('SecurityChief', 'securitychief@example.com', TO_DATE('2024-04-05', 'YYYY-MM-DD'), 'SecureKey999', 'System Security');
INSERT INTO Admin (Display_Name, Email, Creation_Date, Password, Admin_Power) VALUES ('ContentModerator', 'moderator@example.com', TO_DATE('2024-05-20', 'YYYY-MM-DD'), 'ModPass321', 'Review Content');

-- Hotpot User
INSERT INTO Hotpot_user (Display_Name, Email, Creation_Date, Password) VALUES ('JohnDoe', 'johndoe@example.com', TO_DATE('2024-01-10', 'YYYY-MM-DD'), 'Password123');
INSERT INTO Hotpot_user (Display_Name, Email, Creation_Date, Password) VALUES ('JaneSmith', 'janesmith@example.com', TO_DATE('2024-02-20', 'YYYY-MM-DD'), 'SecurePass456');
INSERT INTO Hotpot_user (Display_Name, Email, Creation_Date, Password) VALUES ('MikeJohnson', 'mikejohnson@example.com', TO_DATE('2024-03-15', 'YYYY-MM-DD'), 'MikePass789');
INSERT INTO Hotpot_user (Display_Name, Email, Creation_Date, Password) VALUES ('EmilyBrown', 'emilybrown@example.com', TO_DATE('2024-04-05', 'YYYY-MM-DD'), 'EmilyStrongPass');
INSERT INTO Hotpot_user (Display_Name, Email, Creation_Date, Password) VALUES ('DavidWilson', 'davidwilson@example.com', TO_DATE('2024-05-25', 'YYYY-MM-DD'), 'WilsonSecret321');

-- Broth
INSERT INTO Broth (Name, Flavour_Type) VALUES ('Sichuan Spicy', 'Spicy');
INSERT INTO Broth (Name, Flavour_Type) VALUES ('Mushroom', 'Savory');
INSERT INTO Broth (Name, Flavour_Type) VALUES ('Tomato', 'Tangy');
INSERT INTO Broth (Name, Flavour_Type) VALUES ('Herbal Chicken', 'Mild');
INSERT INTO Broth (Name, Flavour_Type) VALUES ('Miso', 'Sweet and Spicy');
INSERT INTO Broth (Name, Flavour_Type) VALUES ('Seafood', 'Umami');

-- Dipping Sauce
INSERT INTO Dipping_Sauce (Name, Flavour_Type) VALUES ('Sesame Sauce', 'Nutty');
INSERT INTO Dipping_Sauce (Name, Flavour_Type) VALUES ('Garlic Soy Sauce', 'Savory');
INSERT INTO Dipping_Sauce (Name, Flavour_Type) VALUES ('Spicy Chili Oil', 'Spicy');
INSERT INTO Dipping_Sauce (Name, Flavour_Type) VALUES ('Ponzu Sauce', 'Tangy');
INSERT INTO Dipping_Sauce (Name, Flavour_Type) VALUES ('Peanut Sauce', 'Nutty');

-- Restaurant
INSERT INTO Restaurant (Full_Address, City_Province, Name) VALUES ('123 Hot Pot Lane, Toronto, ON', 'Toronto, ON', 'Spicy Dragon Hot Pot');
INSERT INTO Restaurant (Full_Address, City_Province, Name) VALUES ('456 Broth Street, Vancouver, BC', 'Vancouver, BC', 'Ocean Delight Hot Pot');
INSERT INTO Restaurant (Full_Address, City_Province, Name) VALUES ('789 Szechuan Road, Calgary, AB', 'Calgary, AB', 'Fire and Ice Hot Pot');
INSERT INTO Restaurant (Full_Address, City_Province, Name) VALUES ('321 Umami Avenue, Montreal, QC', 'Montreal, QC', 'Golden Ladle Hot Pot');
INSERT INTO Restaurant (Full_Address, City_Province, Name) VALUES ('654 Flavor Boulevard, Edmonton, AB', 'Edmonton, AB', 'Sizzling Pot Hot Pot');
INSERT INTO Restaurant (Full_Address, City_Province, Name) VALUES ('123 HelenShirshaTalia Street, Vancouver, BC', 'Vancouver, BC', 'HST');
INSERT INTO Restaurant (Full_Address, City_Province, Name) VALUES ('555 MyPlace Street, Vancouver, BC', 'Vancouver, BC', 'MyPlace Hot Pot');
INSERT INTO Restaurant (Full_Address, City_Province, Name) VALUES ('123 Glenwood Street, Vancouver, BC', 'Vancouver, BC', 'Glenwood Hot Pot');

-- Recipe Rating
INSERT INTO Recipe_Rating (Description, Rating) VALUES ('A rich and spicy Sichuan broth with beef tallow and chili oil.', 4.98);
INSERT INTO Recipe_Rating (Description, Rating) VALUES ('A mild and nourishing herbal chicken broth with goji berries.', 3.82);
INSERT INTO Recipe_Rating (Description, Rating) VALUES ('A tangy and refreshing tomato-based broth.', 2.12);
INSERT INTO Recipe_Rating (Description, Rating) VALUES ('A savory mushroom broth with shiitake and enoki mushrooms.', 4.66);
INSERT INTO Recipe_Rating (Description, Rating) VALUES ('A seafood broth infused with shrimp, clams, and fish bones.', 3.69);

-- Recipe
INSERT INTO Recipe (Recipe_ID, Update_Date, Serving_Size, Description, Title_Name, Creation_Date, Display_Name) VALUES (1, TIMESTAMP '2024-02-10 12:00:00', 4, 'A rich and spicy Sichuan broth with beef tallow and chili oil.', 'Sichuan Spicy Broth', TIMESTAMP '2024-02-05 10:00:00', 'JohnDoe');
INSERT INTO Recipe (Recipe_ID, Update_Date, Serving_Size, Description, Title_Name, Creation_Date, Display_Name) VALUES (2, TIMESTAMP '2024-02-15 14:30:00', 6, 'A mild and nourishing herbal chicken broth with goji berries.', 'Herbal Chicken Broth', TIMESTAMP '2024-02-12 09:45:00', 'JaneSmith');
INSERT INTO Recipe (Recipe_ID, Update_Date, Serving_Size, Description, Title_Name, Creation_Date, Display_Name) VALUES (3, NULL, 4, 'A tangy and refreshing tomato-based broth.', 'Tomato Hot Pot Broth', TIMESTAMP '2024-02-18 11:20:00', 'MikeJohnson');
INSERT INTO Recipe (Recipe_ID, Update_Date, Serving_Size, Description, Title_Name, Creation_Date, Display_Name) VALUES (4, TIMESTAMP '2024-02-20 17:00:00', 2, 'A savory mushroom broth with shiitake and enoki mushrooms.', 'Mushroom Delight Broth', TIMESTAMP '2024-01-19 08:30:00', 'EmilyBrown');
INSERT INTO Recipe (Recipe_ID, Update_Date, Serving_Size, Description, Title_Name, Creation_Date, Display_Name) VALUES (5, NULL, 5, 'A seafood broth infused with shrimp, clams, and fish bones.', 'Seafood Umami Broth', TIMESTAMP '2024-02-22 13:15:00', 'DavidWilson');

--made for
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (1, '123 HelenShirshaTalia Street, Vancouver, BC');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (2, '123 HelenShirshaTalia Street, Vancouver, BC');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (3, '123 HelenShirshaTalia Street, Vancouver, BC');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (4, '123 HelenShirshaTalia Street, Vancouver, BC');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (5, '123 HelenShirshaTalia Street, Vancouver, BC');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (1, '654 Flavor Boulevard, Edmonton, AB');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (2, '654 Flavor Boulevard, Edmonton, AB');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (3, '654 Flavor Boulevard, Edmonton, AB');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (4, '654 Flavor Boulevard, Edmonton, AB');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (5, '654 Flavor Boulevard, Edmonton, AB');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (1, '123 Glenwood Street, Vancouver, BC');
INSERT INTO Made_For (Recipe_ID, Full_Address) VALUES (2, '123 Glenwood Street, Vancouver, BC');

-- AddOns
INSERT INTO Add_Ons (Recipe_ID, Dipping_Sauce_Name) VALUES (1, 'Sesame Sauce');
INSERT INTO Add_Ons (Recipe_ID, Dipping_Sauce_Name) VALUES (2, 'Garlic Soy Sauce');
INSERT INTO Add_Ons (Recipe_ID, Dipping_Sauce_Name) VALUES (3, 'Spicy Chili Oil');
INSERT INTO Add_Ons (Recipe_ID, Dipping_Sauce_Name) VALUES (4, 'Ponzu Sauce');
INSERT INTO Add_Ons (Recipe_ID, Dipping_Sauce_Name) VALUES (5, 'Peanut Sauce');

--Ingredients
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Salt', 0, 0, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Pepper', 0, 5, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Soy Sauce', 0, 10, 'Soybeans'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Sesame Oil', 0, 45, 'Sesame'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Oyster Sauce', 0, 20, 'Oysters');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Rice Noodles', 2, 200, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Udon', 3, 220, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Sweet Potato Vermicelli', 4, 150, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Potato Slices', 1, 130, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Dumplings', 6, 250, 'Gluten');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Tofu', 2, 100, 'Soybeans'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Frozen Tofu', 2, 110, 'Soybeans'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Bean Curd Sheets', 3, 90, 'Soybeans'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Quail Eggs', 4, 80, 'Eggs'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Tofu Puffs', 3, 150, 'Soybeans');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Beef Slices', 7, 250, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Lamb Slices', 8, 300, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Pork Belly', 5, 400, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Chicken Thigh Slices', 4, 200, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Meatballs', 6, 150, 'None');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Napa Cabbage', 2, 30, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Bok Choy', 2, 35, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Spinach', 3, 40, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Lotus Root', 4, 60, 'None'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Enoki Mushrooms', 3, 50, 'None');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Shrimp', 10, 80, 'Shellfish'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Fish Fillet', 8, 150, 'Fish'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Squid', 6, 100, 'Shellfish'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Scallops', 12, 90, 'Shellfish'); 
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Fish Balls', 5, 120, 'Fish');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Red Cabbage', 2, 35, 'None');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Broad Bean', 3, 120, 'None');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Garlic', 1, 10, 'None');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Chili Flakes', 2, 20, 'None');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Lime Juice', 2, 5, 'None');
INSERT INTO Ingredients (Name, Price_Per_Unit, Calories_Per_Serving, Allergens) VALUES ('Peanuts', 3, 160, 'Peanuts');

-- Needs
INSERT INTO Needs (Recipe_ID, Ingredient_Name) VALUES (1, 'Salt');
INSERT INTO Needs (Recipe_ID, Ingredient_Name) VALUES (2, 'Pepper');
INSERT INTO Needs (Recipe_ID, Ingredient_Name) VALUES (3, 'Soy Sauce');
INSERT INTO Needs (Recipe_ID, Ingredient_Name) VALUES (4, 'Sesame Oil');
INSERT INTO Needs (Recipe_ID, Ingredient_Name) VALUES (5, 'Oyster Sauce');

-- Condiments 
INSERT INTO Condiment (Name, Base) VALUES ('Salt', NULL); 
INSERT INTO Condiment (Name, Base) VALUES ('Pepper', 'Black Peppercorns'); 
INSERT INTO Condiment (Name, Base) VALUES ('Soy Sauce', 'Soybeans'); 
INSERT INTO Condiment (Name, Base) VALUES ('Sesame Oil', 'Sesame Seeds'); 
INSERT INTO Condiment (Name, Base) VALUES ('Oyster Sauce', 'Oyster Extract');

--Carb_Cooking_Time 
INSERT INTO Carb_Cooking_Time (Type, Cooking_Time) VALUES ('Noodles', 3);
INSERT INTO Carb_Cooking_Time (Type, Cooking_Time) VALUES ('Rice', 5);
INSERT INTO Carb_Cooking_Time (Type, Cooking_Time) VALUES ('Bread', 7);
INSERT INTO Carb_Cooking_Time (Type, Cooking_Time) VALUES ('Vegetable', 6);
INSERT INTO Carb_Cooking_Time (Type, Cooking_Time) VALUES ('Filled Dough', 8);

-- carb
INSERT INTO Carb (Name, Type) VALUES ('Rice Noodles', 'Noodles');
INSERT INTO Carb (Name, Type) VALUES ('Udon', 'Noodles');
INSERT INTO Carb (Name, Type) VALUES ('Sweet Potato Vermicelli', 'Noodles');
INSERT INTO Carb (Name, Type) VALUES ('Potato Slices', 'Vegetable');
INSERT INTO Carb (Name, Type) VALUES ('Dumplings', 'Filled Dough');

-- ProteinTexture 
INSERT INTO Protein_Texture (Texture, Cooking_Time) VALUES ('Soft', 3);
INSERT INTO Protein_Texture (Texture, Cooking_Time) VALUES ('Spongy', 5);
INSERT INTO Protein_Texture (Texture, Cooking_Time) VALUES ('Chewy', 2);
INSERT INTO Protein_Texture (Texture, Cooking_Time) VALUES ('Firm', 6);
INSERT INTO Protein_Texture (Texture, Cooking_Time) VALUES ('Airy', 1);

-- Protein Table
INSERT INTO Protein (Name, Cooking_Time) VALUES ('Tofu', 3);
INSERT INTO Protein (Name, Cooking_Time) VALUES ('Frozen Tofu', 5);
INSERT INTO Protein (Name, Cooking_Time) VALUES ('Bean Curd Sheets', 2);
INSERT INTO Protein (Name, Cooking_Time) VALUES ('Quail Eggs', 6);
INSERT INTO Protein (Name, Cooking_Time) VALUES ('Tofu Puffs', 2);

-- SeafoodTexture 
INSERT INTO Seafood_Texture (Texture, Cooking_Time) VALUES ('Crustacean', 4);
INSERT INTO Seafood_Texture (Texture, Cooking_Time) VALUES ('Fish', 5);
INSERT INTO Seafood_Texture (Texture, Cooking_Time) VALUES ('Mollusk', 6);
INSERT INTO Seafood_Texture (Texture, Cooking_Time) VALUES ('Mollusk', 3);

--Seafood 
INSERT INTO Seafood (Name, Cooking_Time) VALUES ('Shrimp', 4);
INSERT INTO Seafood (Name, Cooking_Time) VALUES ('Fish Fillet', 5);
INSERT INTO Seafood (Name, Cooking_Time) VALUES ('Squid', 6);
INSERT INTO Seafood (Name, Cooking_Time) VALUES ('Scallops', 3);
INSERT INTO Seafood (Name, Cooking_Time) VALUES ('Fish Balls', 5);

--MeatTexture

INSERT INTO Meat_Texture (Texture, Cooking_Time) VALUES ('Tender', 5);
INSERT INTO Meat_Texture (Texture, Cooking_Time) VALUES ('Juicy', 4);
INSERT INTO Meat_Texture (Texture, Cooking_Time) VALUES ('Fatty', 10);
INSERT INTO Meat_Texture (Texture, Cooking_Time) VALUES ('Soft', 7);
INSERT INTO Meat_Texture (Texture, Cooking_Time) VALUES ('Bouncy', 6);

-- Meat 
INSERT INTO Meat (Name, Cooking_Time) VALUES ('Beef Slices', 5);
INSERT INTO Meat (Name, Cooking_Time) VALUES ('Lamb Slices', 5);
INSERT INTO Meat (Name, Cooking_Time) VALUES ('Pork Belly', 10);
INSERT INTO Meat (Name, Cooking_Time) VALUES ('Chicken Thigh Slices', 7);
INSERT INTO Meat (Name, Cooking_Time) VALUES ('Meatballs', 6);

-- Review score
INSERT INTO Review_Score (Creation_Date, Review_Comment, SCORE) VALUES (TIMESTAMP '2024-02-01 10:30:00', 'Excellent recipe! Highly recommended.', 5);
INSERT INTO Review_Score (Creation_Date, Review_Comment, SCORE) VALUES (TIMESTAMP '2024-02-05 14:15:00', 'Good quality, but took a while to make.', 4);
INSERT INTO Review_Score (Creation_Date, Review_Comment, SCORE) VALUES (TIMESTAMP '2024-02-10 18:45:00', 'Recipe was fine but the restaurant wasn’t good overall.', 3);
INSERT INTO Review_Score (Creation_Date, Review_Comment, SCORE) VALUES (TIMESTAMP '2024-02-15 08:20:00', 'Recipe did not taste as expected.', 2);
INSERT INTO Review_Score (Creation_Date, Review_Comment, SCORE) VALUES (TIMESTAMP '2024-02-20 21:10:00', 'Very disappointed. Tasted awful, would not recommend to anyone.', 1);


-- Review 

INSERT INTO Review (Review_ID, Creation_Date, Update_Date, Review_Comment, Recipe_ID, Display_Name) VALUES ('R001', TIMESTAMP '2024-02-01 10:30:00', NULL, 'Excellent recipe! Highly recommended.', 1, 'JohnDoe');
INSERT INTO Review (Review_ID, Creation_Date, Update_Date, Review_Comment, Recipe_ID, Display_Name) VALUES ('R002', TIMESTAMP '2024-02-05 14:15:00', TIMESTAMP '2024-02-06 09:00:00', 'Good quality, but took a while to make.', 2, 'JaneSmith');
INSERT INTO Review (Review_ID, Creation_Date, Update_Date, Review_Comment, Recipe_ID, Display_Name) VALUES ('R003', TIMESTAMP '2024-02-10 18:45:00', NULL, 'Recipe was fine but the restaurant wasn’t good overall.', 3, 'MikeJohnson');
INSERT INTO Review (Review_ID, Creation_Date, Update_Date, Review_Comment, Recipe_ID, Display_Name) VALUES ('R004', TIMESTAMP '2024-02-15 08:20:00', TIMESTAMP '2024-02-16 12:30:00', 'Recipe did not taste as expected.', 4, 'EmilyBrown');
INSERT INTO Review (Review_ID, Creation_Date, Update_Date, Review_Comment, Recipe_ID, Display_Name) VALUES ('R005', TIMESTAMP '2024-02-20 21:10:00', NULL, 'Very disappointed. Tasted awful, would not recommend to anyone.', 5, 'DavidWilson');


-- Contains 

INSERT INTO Contains (Dipping_Sauce_Name, Ingredient_Name, Quantity) VALUES ('Sesame Sauce', 'Soy Sauce', 2);
INSERT INTO Contains (Dipping_Sauce_Name, Ingredient_Name, Quantity) VALUES ('Garlic Soy Sauce', 'Garlic', 1);
INSERT INTO Contains (Dipping_Sauce_Name, Ingredient_Name, Quantity) VALUES ('Spicy Chili Oil', 'Chili Flakes', 3);
INSERT INTO Contains (Dipping_Sauce_Name, Ingredient_Name, Quantity) VALUES ('Ponzu Sauce', 'Lime Juice', 2);
INSERT INTO Contains (Dipping_Sauce_Name, Ingredient_Name, Quantity) VALUES ('Peanut Sauce', 'Peanuts', 4);

-- MadeFrom 

INSERT INTO Made_From (Ingredients_Name, Broth_Name) VALUES ('Salt', 'Sichuan Spicy');
INSERT INTO Made_From (Ingredients_Name, Broth_Name) VALUES ('Pepper', 'Herbal Chicken');
INSERT INTO Made_From (Ingredients_Name, Broth_Name) VALUES ('Soy Sauce', 'Tomato');
INSERT INTO Made_From (Ingredients_Name, Broth_Name) VALUES ('Sesame Oil', 'Miso');
INSERT INTO Made_From (Ingredients_Name, Broth_Name) VALUES ('Oyster Sauce', 'Seafood');

-- VegetablesCooking_Time

INSERT INTO Vegetables_Cooking_Time (Type, Cooking_Time) VALUES ('Leafy Green', 5);
INSERT INTO Vegetables_Cooking_Time (Type, Cooking_Time) VALUES ('Cabbage', 2);
INSERT INTO Vegetables_Cooking_Time (Type, Cooking_Time) VALUES ('Root Vegetable', 8);
INSERT INTO Vegetables_Cooking_Time (Type, Cooking_Time) VALUES ('Mushroom', 4);
INSERT INTO Vegetables_Cooking_Time (Type, Cooking_Time) VALUES ('Legume', 3);

-- Vegetables

INSERT INTO Vegetables (Name, Type) VALUES ('Napa Cabbage', 'Leafy Green');
INSERT INTO Vegetables (Name, Type) VALUES ('Bok Choy', 'Leafy Green');
INSERT INTO Vegetables (Name, Type) VALUES ('Spinach', 'Leafy Green');
INSERT INTO Vegetables (Name, Type) VALUES ('Lotus Root', 'Root Vegetable');
INSERT INTO Vegetables (Name, Type) VALUES ('Enoki Mushrooms', 'Mushroom');
INSERT INTO Vegetables (Name, Type) VALUES ('Red Cabbage', 'Cabbage');
INSERT INTO Vegetables (Name, Type) VALUES ('Broad Bean', 'Legume');

COMMIT;
