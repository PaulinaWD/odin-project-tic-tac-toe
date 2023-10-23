// --- Players Factory --- //
const createPlayer = (name, mark) => {
  return { name, mark };
};

let playerOne = createPlayer("Player One", "circle");
let playerTwo = createPlayer("Player Two", "cross");

/////////////////// --- Game Board --- //////////////////////
const gameBoard = (() => {
  const gameAreas = document.querySelector(".game-board");
  //let startingAreas = ["", "", "", "", "", "", "", "", ""];
  let gameboard = ["", "", "", "", "", "", "", "", ""];
  let playerOneScore = 0;
  let playerTwoScore = 0;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check for Wins //
  const checkForWins = function () {
    let winner = "";
    winningCombinations.forEach((array) => {
      if (array.every((area) => gameboard[area] === "circle")) {
        winner = "circle";
      } else if (array.every((area) => gameboard[area] === "cross")) {
        winner = "cross";
      }
    });
    return winner;
  };

  return { checkForWins, gameboard, gameAreas, playerOneScore, playerTwoScore };
})();

/////////////// --- Display Controller --- /////////////////
const displayController = (() => {
  let activePlayer = playerOne;

  // DOM Elements//
  const score = document.querySelectorAll(".score");
  const startGameBtn = document.querySelector(".btn-game");
  const winningMessage = document.querySelector(".winning-message-wrapper");
  const overlay = document.querySelector(".overlay");
  const winningMessageText = document.querySelector(".winning-message-text");
  const nextRoundButton = document.querySelector("#next-round-button");

  // Render Game Board //
  const renderGameBoard = () => {
    gameBoard.gameboard.forEach((area, index) => {
      const areaField = document.createElement("div");
      areaField.id = index;
      areaField.classList.add("area", "area-inactive");
      gameBoard.gameAreas.append(areaField);
    });
  };

  // Update GameBoard Array and Render Mark//
  const updateGameboard = (e) => {
    const area = e.target.id;
    if (activePlayer.mark === "circle") {
      gameBoard.gameboard[area] = "circle";
      e.target.classList.add("circle");
    } else {
      gameBoard.gameboard[area] = "cross";
      e.target.classList.add("cross");
    }
  };

  // Switch Player //
  const switchPlayer = () => {
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
  };

  // Disable Further Moves //
  const disableGame = () => {
    document.removeEventListener("click", handleClick);
  };

  // Display Winning Message //
  const displayWinningMessage = () => {
    winningMessageText.textContent = `${activePlayer.name} won!`;
    toggleHiddenClass();
  };

  // Toggle Winning Message Hidden Classes //
  const toggleHiddenClass = () => {
    winningMessage.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  };

  //Add Points to DOM and Update Score Array //
  const addPoints = () => {
    // update score in DOM
    score.forEach((number) => {
      if (number.previousElementSibling.textContent === activePlayer.name) {
        number.textContent++;
      }
    });
    // update score array
    if (activePlayer === playerOne) {
      gameBoard.playerOneScore += 1;
    } else if (activePlayer === playerTwo) {
      gameBoard.playerTwoScore += 1;
    }
  };

  // Clear Board //
  const clearBoard = () => {
    gameBoard.gameboard.forEach((area, index) => {
      gameBoard.gameboard[index] = "";
    });
    //remove classes from DOM
    gameBoard.gameAreas
      .querySelectorAll(".area")
      .forEach((area) => area.classList.remove("cross", "circle"));
  };

  // Restart Round and Add Point //
  const restartRound = () => {
    toggleHiddenClass();
    clearBoard();
    document.addEventListener("click", handleClick);
  };

  // Check for Draw //
  const checkForDraw = () => {
    return gameBoard.gameboard.every((area) => area !== "");
  };

  // Check For Won Game //

  const checkIfWonGame = () => {
    if (gameBoard.playerOneScore >= 5 || gameBoard.playerTwoScore >= 5)
      return true;
  };

  // Handle Click //
  const handleClick = (e) => {
    nextRoundButton.textContent = "Next Round";
    if (gameBoard.gameboard[e.target.id] !== "") {
      return; //disable clicking in occupied area
    }

    updateGameboard(e);
    if (gameBoard.checkForWins() === activePlayer.mark) {
      disableGame(); //disable moves
      addPoints();
      if (checkIfWonGame()) {
        winningMessageText.textContent = `${activePlayer.name} won the Game!`;
        nextRoundButton.textContent = "Play New Game";
        toggleHiddenClass();
        return restartGame();
      }
      displayWinningMessage();
    }
    if (checkForDraw()) {
      winningMessageText.textContent = `It's a Draw`;
      toggleHiddenClass();
    }

    switchPlayer();
  };

  // Restart Game //
  const restartGame = () => {
    activePlayer = playerOne;
    gameBoard.playerOneScore = 0;
    gameBoard.playerTwoScore = 0;
    clearBoard();
    score.forEach((number) => {
      number.textContent = "0";
    });
  };

  // Toggle Start Button //
  const toggleStartButton = () => {
    startGameBtn.textContent = "Restart Game";
    startGameBtn.classList.add("btn-game-active");
    gameBoard.gameAreas
      .querySelectorAll(".area")
      .forEach((area) => area.classList.remove("area-inactive"));
  };

  return {
    renderGameBoard,
    handleClick,
    restartRound,
    nextRoundButton,
    startGameBtn,
    restartGame,
    toggleStartButton,
    checkIfWonGame,
  };
})();

const playRound = function () {
  displayController.toggleStartButton(); // Change Start Button To Restart Button
  document.addEventListener("click", displayController.handleClick); //handle clicks on game areas
  displayController.nextRoundButton.addEventListener(
    "click",
    displayController.restartRound
  ); //restart round when round is finished
};

const playGame = function () {
  displayController.renderGameBoard();
  displayController.startGameBtn.addEventListener("click", playRound);
  displayController.startGameBtn.addEventListener(
    "click",
    displayController.restartGame
  );
};

document.addEventListener("click", playGame());
