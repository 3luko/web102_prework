/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i++) {
        // create a new div element, which will become the game card
        const div = document.createElement("div")

        // add the class game-card to the list
        div.classList.add("game-card")

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")

        div.innerHTML = `
                        <h2>${games[i].name}</h2>
                        <img class="game-img" src="${games[i].img}" alt="${games[i].name}">
                        <p>${games[i].description}</p>
                        <p>Money raised: <strong>$${games[i].pledged.toLocaleString('en-US')}</strong></p>
                        <p>Money Goal: <strong>$${games[i].goal.toLocaleString('en-US')}</strong></p>
                        `
        // append the game to the games-container
        gamesContainer.appendChild(div);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON)


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.backers;
}, 0)

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<h5>${totalContributions.toLocaleString('en-US')}</h5>`

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce( (acc, money) => {
    return acc + money.pledged
}, 0)

// set inner HTML using template literal
raisedCard.innerHTML = `<h5>$${totalRaised.toLocaleString('en-US')}</h5>`
// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `<h5>${GAMES_JSON.length}</h5>`


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let goal_unreached = GAMES_JSON.filter(game => game.pledged < game.goal);
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(goal_unreached)
}

//filterUnfundedOnly()



// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let goal_reached = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(goal_reached)
}

//filterFundedOnly()

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the 
    addGamesToPage(GAMES_JSON)
}

//showAllGames()

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly)
fundedBtn.addEventListener("click", filterFundedOnly)
allBtn.addEventListener("click", showAllGames)


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const totalUnfunded = GAMES_JSON.filter(game => game.pledged < game.goal).length;
// create a string that explains the number of unfunded games using the ternary operator
const totalMoney = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.pledged;
}, 0)

const statement = `<p>A total of $${totalMoney.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length} games. Currently, ${totalUnfunded} ${totalUnfunded <= 1 ? "1 game remains unfunded." : "games remain unfunded."} We need your help to fund these amazing games!</p>`

// create a new DOM element containing the template string and append it to the description container
const myParagraph = document.createElement("p")
myParagraph.innerHTML = statement;
descriptionContainer.appendChild(myParagraph)
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});



// use destructuring and the spread operator to grab the first and second games
let [first, second, ...others] = sortedGames

// console.log(first.name)
// console.log(second.name)

// create a new element to hold the name of the top pledge game, then append it to the correct element

const firstPlace = document.createElement("div")
firstPlace.innerHTML = `${first.name}`
firstGameContainer.appendChild(firstPlace)
// do the same for the runner up item

const secondPlace = document.createElement("div");
secondPlace.innerHTML = `${second.name}`;
secondGameContainer.appendChild(secondPlace)


//Search Feature to look for specific game in catalog
function search_game(value){
    //deleting the elements
    deleteChildElements(gamesContainer);

    //creating a list of games that contain the string entered in the search input field
    let likelyGames = GAMES_JSON.filter( (game) => {
        return game.name.includes(value)
    })
    //console.log(likelyGames)

    //If there are no games in the array then it will show a no results in the games container
    if (likelyGames.length == 0){
        const noresult = document.createElement("div")
        noresult.innerHTML = `<h4>No results</h4>`
        gamesContainer.appendChild(noresult)
    } else {
        //If there are any games in the array it will display the games in the games container
        addGamesToPage(likelyGames)
    }
}

//getting the button id and only doing the search game function when the search button is clicked
const search_btn = document.getElementById("search-submit")
search_btn.addEventListener("click", () => {
    let search_box_value = document.getElementById("search-box").value;
    search_game(search_box_value);
})
