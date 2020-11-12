const question = document.getElementById('question');/*to get the question*/
const choices = Array.from(document.getElementsByClassName('choice-text')); /*to make an array of all elements with class choice-text */
const progressText = document.getElementById("progressText");

const progressBarFull = document.getElementById("progressBarFull");

/*to display the question number*/
const scoreText = document.getElementById("score");/*to display score*/

const loader = document.getElementById('loader');

let currentQuestion = {};/*an object to store the current question*/
let acceptingAnswers = false;/*to indicate when the user can start answering*/
let score = 0;
let questionCounter = 0;
let availableQuestions = [];/*an array of all the unanswered questions stored as objects*/


/*hard coding the questions
let questions = [
  {
      question: 'Inside which HTML element do we put the JavaScript??',
      choice1: '<script>',
      choice2: '<javascript>',
      choice3: '<js>',
      choice4: '<scripting>',
      answer: 1,
  },
  {
      question:"What is the correct syntax for referring to an external script called 'xxx.js'?",
      choice1: "<script href='xxx.js'>",
      choice2: "<script name='xxx.js'>",
      choice3: "<script src='xxx.js'>",
      choice4: "<script file='xxx.js'>",
      answer: 3,
  },
  {
      question:" How do you write 'Hello World' in an alert box?",
      choice1: "msgBox('Hello World');",
      choice2: "alertBox('Hello World');",
      choice3: "msg('Hello World');",
      choice4: "alert('Hello World');",
      answer: 4,
  },
];
*/

let questions = [];

fetch(
  'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
)
  .then((res) => {
      return res.json();
  })
  .then((loadedQuestions) => {
      questions = loadedQuestions.results.map((loadedQuestion) => {
          const formattedQuestion = {
              question: loadedQuestion.question,
          }; // copying the question 

          const answerChoices = [...loadedQuestion.incorrect_answers]; // copying options 
          formattedQuestion.answer = Math.floor(Math.random() * 4) + 1; //finding an index to insert the correct answer
          answerChoices.splice(
              formattedQuestion.answer - 1,
              0,
              loadedQuestion.correct_answer
          );

          //inserting each choice as property in object formattedQuestion
          answerChoices.forEach((choice, index) => {
              formattedQuestion['choice' + (index + 1)] = choice;
          });

          return formattedQuestion;
      });
      startGame();
  })
  .catch((err) => {
      console.error(err);
  });

console.log(questions);
const CORRECT_BONUS = 10;/*score for correct anwer*/
const MAX_QUESTIONS = 3;/*number of questions a player can answer*/



/*the function startGame is to initialize all the variables*/

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]; /* to copy each elements in question to availableQuestions. any changes made to availableQuestions will not affect questions as we have used the spread operator*/
    getNewQuestion();
    game.classList.remove('hidden');//display the question once it is obtained
    loader.classList.add('hidden');//hide the loader 
};



getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      //before exiting store the score in local storage
      localStorage.setItem("mostRecentScore", score);
      //go to the end page
      return window.location.assign('/end.html');
  }
  questionCounter++;
  /*to display the number of questions attempted*/
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;


  /*pick a random number from 0 to availableQuestions.length and finds its floor value.That will be the index of the next question in availableQuestions array*/
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);

  /*store the object at picked index into a object called currentQuestion*/
  currentQuestion = availableQuestions[questionIndex];

  /*changing the value of html element to the value of the property with propertyname question in object currentQuestion*/
  question.innerText = currentQuestion.question;


/*in our html document we have given choices a custom attribute that specifies a unique number for each choice

in the currentQuestion object the propertynames of choices have a number associated with it

we copy the values of the properties into the html elements in such a way that these numbers match*/
  choices.forEach((choice) => {
      const number = choice.dataset['number'];
      choice.innerText = currentQuestion['choice' + number];
  });

  /*to remove the answered question https://www.w3schools.com/jsref/jsref_splice.asp */
  availableQuestions.splice(questionIndex, 1);

  /*after all the questions and choices have been copied to html elements the user can start answering*/
  acceptingAnswers = true;
};





/*the following function accepts answer,checks if it is correct, updates score, change the background color of the selected choice*/
choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
      if (!acceptingAnswers) return;

      acceptingAnswers = false;/*after a choice has been choosen then no more answers are accepted*/
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset['number'];

      /*classToApply will have a value of correct or incorrect*/
      const classToApply=(selectedAnswer == currentQuestion.answer ? "correct" : "incorrect");

      if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
      }

      selectedChoice.parentElement.classList.add(classToApply);

      /* we are using the same html document and just changing the text(ques and ans).

      so if we do not clear the background it will affect the next question
      
      we set a timeout so that the change in background color will be visible to user for 1000 milliseconds
      */
      
      setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
      }, 1000);
      
  });
});

/*called on line 157*/
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
  };