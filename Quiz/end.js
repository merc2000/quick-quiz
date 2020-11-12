const username = document.getElementById('username');//to check if a value has been entered as username
const saveScoreBtn = document.getElementById('saveScoreBtn');//to enable the save button
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');//to get score from local storage
finalScore.innerText = mostRecentScore;//to display the final score

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];/*if any property is present in local storage with propertyname highScore then copy its value as array to highScores else initialise it as an empty array*/

const MAX_HIGH_SCORES = 5;

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;//enabling the save button if valid username is entered
});

saveHighScore = (e) => {
    e.preventDefault();//Clicking on a "Save" button, prevents it from submitting a form and going to new page

    const score = {
      score: mostRecentScore,
      name: username.value,
    };
    highScores.push(score);//add to highScores the recent value of username and score
    highScores.sort((a, b) => b.score - a.score);//sort the array highScores in descending order
    highScores.splice(5);//take only the first five values

    localStorage.setItem('highScores', JSON.stringify(highScores));//save it into local storage after converting it into a string as local storage can only store strings as value
    window.location.assign('/');
};

