# **JavaScript Project : Restaurants Simulation :fork_and_knife:**

## **Execution**
    1. Download JavaScriptRestaurantsSimulation.zip.
    2. Extract files.
    3. Open project in your IDE.
    4. Install modules(npm install).
    5. Create and run a new Grunt Run/Debug file.
	

## **Files Description**
Files downloaded in JavaScriptRestaurantsSimulation.zip:

    • app folder (js files):
    	- crc.js: Clock, Restaurant and Client classes.
    	- index.test.js: Unit tests file.
    	- main.js: Main file of simulation.
    	- market.js: Market class.
    • .editorconfig: File to configure editor settings for this project.
    • .jscssrc: File for project code style (used by Grunt).
    • .jshintrc: File to look for potential errors/bugs (used by Grunt).
    • Gruntfile.js: Project's grunt file. 
    • package.json: All project dependencies.
    • README.md: read me file explaining and helping project setup.
    
## **Project Description**

#### Story and Interactions
Once a client is created, he becomes hungry. He then immediately looks for a restaurant:

    - If the restaurant is closed/full/opened but the client's recipe cannot be cooked,
        - The client will retry a restaurant in 15 minutes.
        - After 4 times trying to get in a restaurant, a client leaves.
    - If the restaurant is opened and his recipe can be cooked,
        - The client will take a seat in the restaurant and wait for his dish to be cooked.
        - Once cooked the client eats and finally leaves the restaurant.
    
	
#### Objects
	- Market
		- There only exists one market.
		- The market is opened from 5AM to 2PM.
		- The markets stock is unlimited.
		- It is where restaurants can come to buy food for their futur customers.

	- Restaurants
		- A restaurant has a specific and unique ID.
		- A restaurant has specific working hours (6AM-10AM, 9PM-12PM).
		- A restaurant has a fixed number of seats.
		- A restaurant starts with 10 of each ingredients.
		- A restaurant has a set number of recipes.
		- It takes from 5 to 50 minutes to cook any recipe.
    
	- Clients
		- A client has a specific and unique ID.
		- A client is hungry until he has eaten or until he leaves the street.
		- A client has a personal waiting patience (10-40min).
    

#### Features

• A restaurant will check his ingredients stock on different events. 
If ingredient is missing/inferior to 5 units the restaurant will then go to the market to satisfy his stocks (stocks refueling takes from 5 to 75 minutes):

	- On opening hour, a restaurant will check is any of his ingredient is missing.
	- At 11:00AM, before mid-day rush hour, every restaurant will check his stocks.
	- At 13:55AM, before market closing hour, every restaurant will check his stocks for the end of the day.
	- When a client comes to the restaurant and his recipe cannot be cooked, restaurant will try to go to the market.
	
• Client are created depending on the hour of the day using a pourcentage of chance of creation and a frequency in minutes:

|Hour|Chance of Creation|Frequency  | X |Hour|Chance of Creation|Frequency  |
|:--:|:----------------:|:---------:|:-:|:--:|:----------------:|:---------:|
|6AM |10%               |Every 30min| X |3PM |20%               |Every 20min|
|7AM |10%               |Every 30min| X |4PM |20%               |Every 20min|
|8AM |20%               |Every 20min| X |5PM |20%               |Every 20min|
|9AM |20%               |Every 10min| X |6PM |20%               |Every 20min|
|10AM|30%               |Every 10min| X |7PM |40%               |Every 10min|
|11AM|40%               |Every 10min| X |8PM |50%               |Every 5min |
|12AM|50%               |Every 3min | X |9PM |50%               |Every 3min |
|1PM |50%               |Every 5min | X |10PM|50%               |Every 6min |
|2PM |40%               |Every 10min| X |11PM|20%               |Every 10min|


#### Additional Features
• **Restaurants Scores** :star::star::star:

	- If client is served 10 minutes before his waiting patience time, the restaurant is given 2 points.
	- If client is served 5 minutes after his waiting patience time, the restaurant is given no points.
	- Else if client is served, the restaurant is given 1 point.
	
A restaurant's score is defined at the end of the day. The points of a restaurant are multiplied by the number of the restaurant's closed hours over a day.


• **Gang Attack** :moneybag::gun:

Every hour, there is a 1% chance of having a gang attack on a random restaurant.
If the restaurant is opened the gang will irrupt in the restaurant and either ask for the restaurant's current points of the day or food stocks.
If they ask for points, the restaurant gives them all their points but will continue to be opened until closing hours.
If they ask for food, the restaurant will give them all their food stocks and will close for the rest of the day.


#### Simulation Settings
Here are the settings that can easily be changed in project (cf. crc.js):

		- Number of milliseconds for simulation minutes
		- Number of days of simulation 
		- Number of restaurants
		- Time for client to retry entering a restaurant
		- Percentage of robbery chance every hour
		- Rush hour restaurant's stock check minimum value
		- Market refueling value for each ingredient
		
For advanced settings make sure unit tests are effective (npm test in IDE terminal).
	
#### Unit Testing
Here are the basic unit tests made in this project (cf.index.test.js):

![enter image description here](http://image.noelshack.com/fichiers/2016/14/1459979725-ut.png)
