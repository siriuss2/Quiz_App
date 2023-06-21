const titleOfTheQuiz = document.querySelector(`#quizTitle`);
const questionTitle = document.querySelector(`#question`);
const startBtn = document.querySelector(`#startBtn`);
const nextBtn = document.querySelector("#nextBtn");
const submitBtn = document.querySelector("#submitBtn");
const mainDiv = document.querySelector(".mainDiv");

let currentQuestionIndex = 0;
let correctAnswerCounter = 0;


async function getDataFromApi() {
    const response = await fetch(`../assets/questions.json`);
    const data = await response.json();
    let quiz = data.quiz;

    // Making the start button

    titleOfTheQuiz.textContent = data.quiz.title;
    startBtn.style.display = "block";
    startBtn.addEventListener("click", () => {
        mainDiv.innerHTML = "";
        displayQuestion(currentQuestionIndex);
    });

    // Displaying the questions when the button Next is clicked
    nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quiz.questions.length) {
            mainDiv.innerHTML = "";
            displayQuestion(currentQuestionIndex);
        } 
    });

    // Function to display the question

    function displayQuestion(index) {
        let questionHTML = `
            <h3 class="question">${index + 1}. ${quiz.questions[index].question}</h3>
        `;
        for (let j = 0; j < quiz.questions[index].options.length; j++) {
            questionHTML += `<button class="btn">${quiz.questions[index].options[j]}</button>`;
        }
        mainDiv.innerHTML = questionHTML;
        mainDiv.appendChild(nextBtn);
        nextBtn.disabled = true;
        nextBtn.style.display = "block";

        if(index >= quiz.questions[index].options.length){
            nextBtn.style.display = "none";
            submitBtn.style.display = "block";
            mainDiv.appendChild(submitBtn);
        }

        attachAnswerButtonListeners();

    }

    function attachAnswerButtonListeners() {
        const answerButtons = mainDiv.querySelectorAll(".btn");
        answerButtons.forEach(button => {
            button.addEventListener('click', findTheCorrectAnswer);
        });
    }

    // Function for finding the correct answer

    function findTheCorrectAnswer(event) {
        const button = event.target;
        const selectedOption = button.textContent;
        const index = currentQuestionIndex; 
        const correctOption = quiz.questions[index].answer;
    
        if (selectedOption === correctOption) {
            button.style.backgroundColor = 'green';
            correctAnswerCounter++;
        } else {
            button.style.backgroundColor = 'red';
        }

        const answerButtons = mainDiv.querySelectorAll(".btn");
        answerButtons.forEach(btn => {
            btn.disabled = true;

        });

        nextBtn.disabled = false;

    }


    // Displaying the number of correct answers

    submitBtn.addEventListener("click", () => {
        mainDiv.innerHTML = "";

        const showScore = document.createElement("p");
        showScore.className = "showResult";
        
        if (correctAnswerCounter <= 2 && correctAnswerCounter >= 0)
            showScore.textContent = `Number of correct answers: ${correctAnswerCounter}. Try better next time!`;
        else if (correctAnswerCounter <= 4 && correctAnswerCounter > 2)
            showScore.textContent = `Number of correct answers: ${correctAnswerCounter}. You are doing great!`;
        else
            showScore.textContent = `Number of correct answers: ${correctAnswerCounter}. Well done. You know everything!`;
        
        mainDiv.appendChild(showScore);
        
    })

}



getDataFromApi();


