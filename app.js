// Global Variables

const submit = document.querySelector('#form'); //Submit Form
const questionContainer = document.querySelector('.questionContainer'); // container div surrounding each question
const quizControls = document.querySelector('#quizControls'); // div containing selectors for dissiculty, category, number of questions
const totalQuestions = document.querySelector('.score--total'); // span to input total number of questions
let   scoreChange = document.querySelector('.score--change'); // span to show current score
const winner = document.querySelector('.winner'); // winner screen including play again buttons
const replayBtn = document.querySelector('.btn--yes'); // play again button
const playerName = document.querySelector('.player'); // close app button

// Loading the questions (calls API fetch function) and prompting players name
submit.addEventListener('submit', function(e){
    e.preventDefault();
    // User inputs stored in variables for the API URL
    let amount = Number(submit.elements[0].value);
    let difficulty = submit.elements[1].value;
    let category = submit.elements[2].value;
    
    // console.log(amount, category, difficulty);
    getMeSomeQuestions(amount, category, difficulty);
    quizControls.style.display = 'none';

    // Insert Players Name
    playerPrompt();
    
});

function getMeSomeQuestions(amount, category, difficulty){
    // url for TriviaDB API (use of variables to select different types of calls)
    const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&category=${category}&difficulty=${difficulty}`;

    // API Call (fetch)
    const fetchQuestionsAwait = async (amount, category, difficulty) => {
        const response = await fetch(url)
        // Convert data to JSON
        const data = await response.json();
        // Call the createQuestions function - creates individual question divs
        createQuestions(data.results);
    
    }
    // Call the fetch API
    fetchQuestionsAwait();
}

// This function prompts the players name and alerts if the field is left blank
function playerPrompt(){
    let person = prompt('Please Enter Your Name');
    // Capitalizes the first letter of the name to improve styling
    let personCapitalize = person.charAt(0).toUpperCase() + person.substr(1);

    // This function is redundant but uses undefined - ternary function below used instead
    
    // if(!person || undefined){
    //     // alerts player if they haven't entered their name
    //     alert('You Must Enter A Name');
    //     playerPrompt();
    // } else {
    //     playerName.innerText = `${personCapitalize}'s`;
    // }   

    // Ternary version of above if statement for assignment
    person ? playerName.innerText = `${personCapitalize}'s`: (alert('You Must Enter A Name'), playerPrompt());
}

// Creating and appending question divs - questions variable is the json results
function createQuestions(questions){
    // Clear Previous Questions from questionContainer - so that divs don't stack on reload
    questionContainer.innerHTML = null;

    // Create new questions within the page.
    questions.forEach((question, index) => {
        // createAnswers function uses the answers from json and puts them into one Array
        // Results from createAnswers function is passed into new variable
        var answers = createAnswers(question);
        questionContainer.innerHTML += 
        `<div class='question question${index + 1}'>
            <h2>Question ${index + 1}</h2>
            <h3>${question.question}</h3>
            <div class='answers ${index + 1}'>
                <p class='answer'>${answers[0]}</p>
                <p class='answer'>${answers[1]}</p>
                <p class='answer'>${answers[2]}</p>
                <p class='answer'>${answers[3]}</p>
            </div>
        </div>`;
        
    });
    
    // Add an Event Listener to all question elements and controls styles.
    selectAnswer(questions);
    
    // Display Question 1
    document.querySelector('.question1').style.display = 'block';
    
};

// Multiple choice answers - The API gives us a correct answer field and 3 incorrect answers.
// This function collates the correct answer and incorrect answers into one Array and jumbles them up.
function createAnswers(answers){
    var answer = [];
    answer.push(answers.correct_answer);
    answer.push(...answers.incorrect_answers);
    answer = randomizeArray(answer);
    return answer;
}

// This function randomizes the answers in the array so that we don't get the correct answer in the same position everytime.
function randomizeArray(array){
    for (let i = array.length-1; i >=0; i--) {
     
        let randomIndex = Math.floor(Math.random()*(i+1)); 
        let itemAtIndex = array[randomIndex]; 
         
        array[randomIndex] = array[i]; 
        array[i] = itemAtIndex;
    }
    return array;
}


// Selecting an answer
function selectAnswer(questions){
    // selects all answer elements
    var selector = document.querySelectorAll('.answer');
    // starts score at 0
    let yourScore = 0;
    // initializes the score and inserts values to the DOM.  uses questions variable to get its length and display both values 
    initializeScore(questions, yourScore);
    for(let i = 0; i < selector.length; i++){
        selector[i].addEventListener('mousedown', function(e){
        // variable for the correct answer to each question
        let correctAnswer = questions[e.target.parentNode.classList[1] - 1].correct_answer;
                
                // LOTS of DOM traversing here.  Probably a lot better way of doing this but IT WORKS!
                if(e.target.innerText === correctAnswer){
                    // changes color to green if answer is correct
                    e.target.style.backgroundColor = '#66ff63';
                    yourScore += 1;
                    // insert updated score - converted to string for assignment
                    scoreChange.innerText = yourScore.toString();

                    //  Timeout functions stop next question from displaying too quickly
                    // They hide the current question and display the next question in the sequence
                    setTimeout(function(){
                        if(e.target.parentElement.parentElement.nextElementSibling !== null){
                            e.target.parentElement.parentElement.style.display = 'none';
                            e.target.parentElement.parentElement.nextElementSibling.style.display = 'block'; 
                        } else{
                            e.target.parentElement.parentElement.style.display = 'none';
                            winner.style.display = 'block';
                        } 
                    
                    }, 1000);
                } else{
                    // answer turns red if incorrect
                    e.target.style.backgroundColor = '#ff6666'; 
                    
                    // Show the correct answer if you get an answer wrong
                    selector.forEach(function(selection){
                        if(selection.innerText === correctAnswer){
                            selection.style.backgroundColor = '#66ff63';
                        }
                    });
                    setTimeout(function(){
                        if(e.target.parentElement.parentElement.nextElementSibling !== null){
                            e.target.parentElement.parentElement.style.display = 'none';
                            e.target.parentElement.parentElement.nextElementSibling.style.display = 'block'; 
                        } else{
                            e.target.parentElement.parentElement.style.display = 'none';
                            winner.style.display = 'block';
                        } 
                    
                    }, 1000);
                };
            
        });
    }
}


// Initializes the score for each new game
function initializeScore(questions, yourScore){
   let totalScore = questions.length;
   totalQuestions.innerText = totalScore; 
   scoreChange.innerText = yourScore;
}


// Asks player if they really want to leave the application.  Displays goodbye screen if confirmed
function confirmClose(){
    let msg = "Are you sure you don't want to play?";
    if(confirm(msg)){
        winner.innerHTML = `
        <h1>Bye Bye</h1>
        <h2>Thank You For Playing</h2>`
    }; 
}