const run1 = document.querySelector(".box1");
const run2 = document.querySelector(".box2");
const run3 = document.querySelector(".box3");
const run4 = document.querySelector(".box4");
const run5 = document.querySelector(".box5");
const run6 = document.querySelector(".box6");
const dotBall = document.querySelector(".box7");
const wicket = document.querySelector(".box8");
const wideBall = document.querySelector(".box9");
const noBall = document.querySelector(".box10");

const buttons = document.querySelectorAll("button");
const scoreBoard = document.querySelector(".scoreBoard");
const teamScore = document.querySelector(".teamScore");

let ballCount = 0;
let over = 1;
let runs = 0;
let wickets = 0;
let isSecondInnings = false;
let maxOvers = 0; 

let team1Score = 0;
let team1Wickets = 0;
let team1Overs = [];

let team2Score = 0;
let team2Wickets = 0;
let team2Overs = [];

const scoreTextDiv = document.createElement("div");
teamScore.appendChild(scoreTextDiv);

const nextOverBtn = document.createElement("button");
nextOverBtn.textContent = "Next Over";
nextOverBtn.style.display = "none";
nextOverBtn.style.marginTop = "15px";
nextOverBtn.style.marginBottom = "15px";
teamScore.appendChild(nextOverBtn);

const newMatchBtn = document.createElement("button");
newMatchBtn.textContent = "New Match";
newMatchBtn.style.display = "none";
newMatchBtn.style.marginTop = "15px";
newMatchBtn.style.marginBottom = "15px";
teamScore.appendChild(newMatchBtn);

function updateDisplay() {
  const scoreText = `Team ${isSecondInnings ? 2 : 1}`;
  const currentScore = `Over ${over} → Runs: ${runs} | Wickets: ${wickets}`;

  scoreTextDiv.innerHTML = isSecondInnings
    ? `<strong>Team 1</strong> → Total Runs: ${team1Score} | Wickets: ${team1Wickets}<br>
       <strong>Team 2 (Current Innings)</strong><br>
       ${scoreText} <br> ${currentScore}`
    : `<strong>Team 1 (Current Innings)</strong><br>
       ${scoreText} <br> ${currentScore}<br>
       <strong>Team 2</strong> → Total Runs: ${team2Score} | Wickets: ${team2Wickets}`
}

function disableAllButtons() {
  buttons.forEach((btn) => {
    btn.disabled = true;
    btn.style.opacity = "0.5";
  });
}

function enableAllButtons() {
  buttons.forEach((btn) => {
    btn.disabled = false;
    btn.style.opacity = "1";
  });
}

function showNextOverOrNewMatch() {
  disableAllButtons();

  if ((!isSecondInnings && over <= maxOvers) || (isSecondInnings && over <= maxOvers)) {
    nextOverBtn.style.display = "inline-block";
  }

  if (!isSecondInnings && over > maxOvers) {
    setTimeout(() => {
      isSecondInnings = true;
      over = 1;
      ballCount = 0;
      runs = 0;
      wickets = 0;
      scoreBoard.innerHTML = "";
      enableAllButtons();
      updateDisplay();
      scoreTextDiv.innerHTML =
        "Team 2 starts their innings<br>Current Score : 0 Runs and 0 wickets";
    }, 1000);
  }

  if (isSecondInnings && over > maxOvers) {
    newMatchBtn.style.display = "inline-block";
  }
}

function addScore(button, text, runValue = 0, isWicket = false) {
  button.addEventListener("click", () => {
    if (ballCount >= 6) return;

    const div = document.createElement("div");
    div.innerHTML = text;
    div.className = "scoreBoard";
    scoreBoard.appendChild(div);

    if (text === "Wide Ball" || text === "No Ball") {
      runValue = 1;
    } else {
      ballCount++;
    }

    if (isWicket) {
      wickets++;
    } else {
      runs += runValue;
    }

    updateDisplay();

    if (ballCount === 6) {
      if (!isSecondInnings) {
        team1Overs.push(runs); 
        team1Score += runs;
        team1Wickets = wickets;
        showNextOverOrNewMatch();
      } else {
        team2Overs.push(runs);
        team2Score += runs;
        team2Wickets = wickets;

        if (over > maxOvers) {
          let result = "";
          if (team2Score > team1Score) {
            result = `🏆 Team 2 wins by ${10 - team2Wickets} wickets!`;
          } else if (team2Score < team1Score) {
            result = `🏆 Team 1 wins by ${team1Score - team2Score} runs!`;
          } else {
            result = "🤝 Match tied!";
          }

          scoreTextDiv.innerHTML = `
                        ${result}<br><br>
                        Final Scores:<br>
                        Team 1 → ${team1Score}/${team1Wickets}<br>
                        Team 2 → ${team2Score}/${team2Wickets}
                    `;
          showNextOverOrNewMatch();
        } else {
          showNextOverOrNewMatch();
        }
      }
    }
  });
}

function newMatch() {
  ballCount = 0;
  over = 1;
  runs = 0;
  wickets = 0;
  isSecondInnings = false;

  team1Score = 0;
  team1Wickets = 0;
  team1Overs = [];

  team2Score = 0;
  team2Wickets = 0;
  team2Overs = [];

  scoreBoard.innerHTML = "";
  scoreTextDiv.innerHTML = "New Match Started: Team 1 starts batting.";

  enableAllButtons();
  updateDisplay();
  nextOverBtn.style.display = "none";
  newMatchBtn.style.display = "none";
}

function askForOvers() {
  let inputOvers = prompt("Enter the number of overs for this match:", "2");

  if (inputOvers && !isNaN(inputOvers) && inputOvers > 0) {
    maxOvers = parseInt(inputOvers, 10);
    alert(`The match will be played with ${maxOvers} overs per innings.`);
  } else {
    alert("Please enter a valid number of overs.");
    askForOvers(); 
  }
}

nextOverBtn.addEventListener("click", () => {
  scoreBoard.innerHTML = "";
  ballCount = 0;
  runs = 0;
  wickets = 0;
  over++;
  nextOverBtn.style.display = "none";
  enableAllButtons();
  updateDisplay();
});


newMatchBtn.addEventListener("click", newMatch);

addScore(run1, "1", 1);
addScore(run2, "2", 2);
addScore(run3, "3", 3);
addScore(run4, "4", 4);
addScore(run5, "5", 5);
addScore(run6, "6", 6);
addScore(dotBall, "Dot Ball", 0);
addScore(wicket, "Wicket", 0, true);
addScore(wideBall, "Wide Ball", 1);
addScore(noBall, "No Ball", 1);

askForOvers();
