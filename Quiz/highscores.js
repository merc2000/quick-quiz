const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || []; //getting object highScores from the local storage

//for each element in highscores convert it into a string with li tags and store in a array
//after all elements are converted to string in array, join the elements of array into a string where each element is seperated by spaces

highScoresList.innerHTML = 
highScores.map(score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");
