// Select All Elements
let startBtn = document.querySelector(".cat .start");
let catContainer = Array.from(document.querySelectorAll(".cat-container .box"));
let catagories = document.querySelector(".cat");
let quizInfo = document.querySelector(".quiz-info");
let cataType = document.querySelector(".cata-type");
let quesCount = document.querySelector(".question-count");
let titleQues = document.querySelector(".title");
let questContainer = document.querySelector(".questions");
let nextQuesBtn = document.querySelector(".next");
let resultSection = document.querySelector(".result");

let choosedCata, file, currentQues = 0, rightAnswers = 0, quesAnswered = 1;

removeActive(catContainer);

// remove Active From Boxes to choose Catagory
function removeActive(boxes) {
  boxes.forEach((box) => {
    box.addEventListener("click", (e) => {
      boxes.forEach((box) => {
        box.classList.remove("active");
      });
      e.currentTarget.classList.add("active");
    });
  });
}

function catagory() {
  if(choosedCata === "web design") {
    file = '/json/webdesign.json';
  } else if(choosedCata === "computer fundementals") {
    file = '/json/computerfund.json';
  } else if(choosedCata === "english") {
    file = '/json/english.json';
  }
}

function getQuestion() {
  let dataObj = new XMLHttpRequest();
  dataObj.onreadystatechange = () => {
    if(dataObj.readyState === 4 && dataObj.status === 200) {
      let questions = JSON.parse(dataObj.responseText);
      let quesLength = questions.length;

      addCata(quesLength);
      addQuestion(questions[currentQues], quesLength);

      nextQuesBtn.onclick = () => {

        let rightAnswer = questions[currentQues].r_answer;

        checkAnswer(rightAnswer);

        HandleBullets();

        currentQues++;

        titleQues.innerHTML = '';
        questContainer.innerHTML = '';

        addQuestion(questions[currentQues], quesLength);

        showResult(quesLength);
      };
    }
  };
  dataObj.open("GET", file, true);
  dataObj.send();
}


startBtn.addEventListener("click", (event) => {
  // Function to Choose Catagory
  swapPages(catContainer, event);

  // Choose Json File Depends on Catagory
  catagory();

  // HTTP Request
  getQuestion();
});

function swapPages(catagory, event) {
  catagory.forEach((cata) => {
    if(cata.classList.contains("active")) {
      catagories.remove();
      quizInfo.style.display = 'block';
      choosedCata = cata.dataset.cat;
    } else {
      event.preventDefault();
    }
  }
  );
};


function addCata(count) {
  // Put Type of Catagory
  let type = document.createElement("span");
  type.className = type;
  type.appendChild(document.createTextNode(choosedCata));
  cataType.appendChild(type);

  // Add Number Of Questions
  for(let i = 1;i < count;i++) {
    let numOfQues = document.createElement("span");
    quesCount.appendChild(numOfQues);
  }
}

function addQuestion(dataQues, count) {
  if(currentQues < count) {
    addTitleQues(dataQues);

    addAnswersQues(dataQues);
  }
}

function addTitleQues(dataQues) {
  let titl = document.createElement("h2");
  let dataTitle = document.createTextNode(dataQues.title);
  titl.appendChild(dataTitle);
  titleQues.appendChild(titl);
}

function addAnswersQues(dataQues) {
  for(let i = 1;i <= 4;i++) {
    let answer = document.createElement("div");
    answer.className = "answer";
    let radio = document.createElement("input");
    let label = document.createElement("label");
    let answerData = document.createTextNode(dataQues[`answer_${i}`]);
    radio.type = 'radio';
    radio.id = `answer_${i}`;
    radio.name = 'question';
    label.htmlFor = radio.id;
    radio.dataset.answer = dataQues[`answer_${i}`];

    answer.appendChild(radio);
    answer.appendChild(label);
    label.appendChild(answerData);
    questContainer.appendChild(answer);
  }
}

function checkAnswer(rAnswer) {
  let answers = Array.from(document.getElementsByName("question"));
  let chooseAnswer;

  for(let i = 0;i < 4;i++) {
    if(answers[i].checked) {
      chooseAnswer = answers[i].dataset.answer;
    }
  }

  if(rAnswer === chooseAnswer) {
    rightAnswers++;
  }
}

function HandleBullets() {
  let spans = Array.from(document.querySelectorAll(".question-count span"));
  spans.forEach((span, index) => {
    if(currentQues === index) {
      span.className = 'on';
    }
  });
}


function showResult(count) {
  if(currentQues === count) {
    quizInfo.remove();

    let head = document.createElement("h1");
    head.className = 'cong';
    if(rightAnswers === 5) {
      head.innerHTML = 'Congratulations!';
      head.style.color = '#3f51b5';
    } else if(rightAnswers >= 2 && rightAnswers <= 4) {
      head.innerHTML = 'Good!';
      head.style.color = '#009688';
    } else {
      head.innerHTML = 'Bad!';
      head.style.color = 'red';
    }
    resultSection.appendChild(head);

    let spanCata = document.createElement("span");
    spanCata.className = 'cata-type';
    spanCata.style.textTransform = 'capitalize';
    spanCata.appendChild(document.createTextNode(`Catagory: ${choosedCata}`));
    resultSection.appendChild(spanCata);

    let spanAnswe = document.createElement("div");
    spanAnswe.innerHTML = 'You Answered';
    spanAnswe.className = 'answ';
    resultSection.appendChild(spanAnswe);

    let spanRes = document.createElement("div");
    spanRes.className = 'res';
    spanRes.appendChild(document.createTextNode(`${rightAnswers} / ${count}`));
    resultSection.appendChild(spanRes);

    let spanCorr = document.createElement("span");
    spanCorr.innerHTML = 'Answered Correct';
    spanCorr.className = 'appre';
    resultSection.appendChild(spanCorr);


    let homeBtn = document.createElement("button");
    homeBtn.className = 'home';
    homeBtn.innerHTML = 'Back To Home';
    resultSection.appendChild(homeBtn);
    homeBtn.addEventListener('click', () => {
      window.location.reload();
    });
  }
}


