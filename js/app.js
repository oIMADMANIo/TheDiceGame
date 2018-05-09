/* GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
- If the active player hits the six two times - he lost his complete score
*/
/* EXTENDED CODING CHALLENGES
1. A plyer looses hi ENTIRE score when he rolls two 6 in a row.
2. Add an input field to the HTML where player can set the winning score.
3. Add a second dice to the game, so that there are two dices. 
*/
/* OWN IDEAS
    // NOTE: ###### SET THE PLAYERNAMES ######
    //TODO: [x]  create an input function for a generic amount of players with a check that all players have a valid name and winning score.
    //TODO: [x] Create interactive HTML Inputfields
    //TODO: [x] create a background blur that mask the gameinterface behind the query of the playername
    //NOTE: ###### WINNING SCORE ######
    //TODO: [x] Clear the winnig score by reset the game
    //TODO: [x] let the eventListener310 listen for the enter key
    //TODO: [x] create an announcment over the scorebox that says "Please set the winning Score."
    //TODO: [x] lock the inputfield when a valid value was type in.
    //NOTE: ###### GENERAL ######
    //TODO: [x] animate the dices
    //TODO: [x]  add sounds for the rolling dice event and for the winning screen
    //TODO: [x]  learn to read and modify this https://codepen.io/plasm/pen/XMeZXV to let fly stars on the background-image modestly --> antigravity.js & .css
*/
// DECLARE ALL VARIABLES IN USE
var scores, roundScore, activePlayer, dice, secondDice, gamePlaying, winningScore, soundWinning, soundRoll;
// declare all gobal DOMShortcuts
var btnRollDOM = document.querySelector('.btn-roll');
var btnHoldDOM = document.querySelector('.btn-hold');
var diceDOM = document.querySelector('.dice');
var secondDiceDOM = document.querySelector('.second_dice');
var player0panelDOM = document.querySelector('.player-0-panel');
var player1panelDOM = document.querySelector('.player-1-panel');
var finalScoreDOM = document.querySelector('.final-score');
var finalScoreDescDOM = document.querySelector('.final-score-desc');
// create space to remind the dice results - an array
var remindTheDice = [];
var remindTheSecondDice = [];
// load all audio files
function loadAudio() {
    soundWinning = new Audio();
    soundWinning.src = '/sounds/winning.mp3';
    soundWinning.volume = 0.1;
    soundRoll = new Audio();
    soundRoll.src = '/sounds/roll.wav'
    soundRoll.volume = 0.1;
};
loadAudio();
// function to play the rolling dice sound
function playSoundRoll() {
    soundRoll.play();
};
// function to play the winning sound
function playSoundWinning() {
    soundWinning.play();
};
// call the init function to set the game ready
init();
// NEW GAME BUTTON
document.querySelector('.btn-new').addEventListener('click', init);
// ROLL THE DICE BUTTON
btnRollDOM.addEventListener('click', function () {
    if (gamePlaying) {
        // tell both dices that they are visible
        diceDOM.style.display = 'block';
        secondDiceDOM.style.display = 'block';
        // display the fake-movement-PNGs
        diceDOM.src = 'images/dice_spin.png';
        secondDiceDOM.src = 'images/dice_spin.png';
        // start the css-animation-class
        diceDOM.classList.toggle('spinningDiceRight');
        secondDiceDOM.classList.toggle('spinningDiceLeft');
        // call the rollingDice soundFunction 
        playSoundRoll();
        // set the gameMode on false to deactive the buttons while rolling
        gamePlaying = false;
        // show the result after 1,75 seconds of rolling
        setTimeout(function () {
            gamePlaying = true; // reactivate the buttons
            // end the css-animation-class
            diceDOM.classList.toggle('spinningDiceRight');
            secondDiceDOM.classList.toggle('spinningDiceLeft');
            // generate a random number between one and six
            dice = Math.floor(Math.random() * 6) + 1;
            secondDice = Math.floor(Math.random() * 6) + 1;
            // report the new roll and the dice result
            console.log('############################# NEW ROLL #############################');
            console.log('first dice: ' + dice);
            console.log('second dice: ' + secondDice);
            // define which side of the dice is shown 
            diceDOM.src = 'images/dice-' + dice + '.png';
            secondDiceDOM.src = 'images/dice-' + secondDice + '.png';
            // function call - check for doubled sixes
            checkTheSix();
            console.log('mind of the first dice: ' + remindTheDice);
            console.log('mind of the second dice: ' + remindTheSecondDice);
            // define the result of the dice when it is NOT one 
            if (dice !== 1 && secondDice !== 1) {
                // add the current result of the dice to the current round score
                roundScore += dice += secondDice;
                // display the current round score in the html-element
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
                // define the result of the dice when it is one
            } else {
                // report the consequences for shot the one
                console.log('you shot the one! - bye bye round score -> player switch');
                // set the current round score to zero 
                roundScore = 0;
                // refresh the html element
                document.querySelector('#current-' + activePlayer).textContent = roundScore;
                // switch the active player
                switchPlayer();
            }
        }, 1750);
    }
});
// SAVE THE ROUNDSCORE BUTTON
btnHoldDOM.addEventListener('click', function () {
    // the case when the function does run -> gamePlaying must be true
    if (gamePlaying) {
        // add current round score to global score
        scores[activePlayer] += roundScore;
        // update the playerScore UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        console.log('Score Player ' + activePlayer + ': ' + scores[activePlayer]);
        // check if the active player has won the game - is his score greater than 100?  
        if (scores[activePlayer] >= winningScore) {
            // call the winningSoundFunction
            playSoundWinning();
            // set variable for the DOM manipulation of the class .player-X-panel
            var playerXpanelDOM = document.querySelector('.player-' + activePlayer + '-panel');
            console.log('The winning score is: ' + winningScore);
            // say with the console that the active player has won the game
            console.log('Player ' + activePlayer + ' has won the game. huRRay!!!');
            // show with the playername that he is the winner
            document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
            // remove the active look of the winner
            playerXpanelDOM.classList.remove('active');
            // give the winner the winner-look
            playerXpanelDOM.classList.add('winner');
            // lets rise the stars for the winner
            document.querySelector('.stars-' + activePlayer).style.backgroundSize = '50% 50%';
            // hide the current round score boxes
            document.querySelector('.player-current-box-0').style.display = 'none';
            document.querySelector('.player-current-box-1').style.display = 'none';
            // hide the roll the dice and save the score buttons 
            btnRollDOM.style.display = 'none';
            btnHoldDOM.style.display = 'none';
            // hide the dice
            diceDOM.style.display = 'none';
            secondDiceDOM.style.display = 'none';
            // say that the game is not playing 
            gamePlaying = false;
            // define whats happen if nobody has won yet
        } else {
            // set the current round score - after adding to global score - to zero 
            roundScore = 0;
            // update the currentScore UI
            document.querySelector('#current-' + activePlayer).textContent = 0;
            // switch the active player
            switchPlayer();
        }
        //hide the dice
        diceDOM.style.display = 'none';
        secondDiceDOM.style.display = 'none';
    }
});
// SWITCH THE ACTIVE PLAYER
function switchPlayer() {
    console.log('########### PLAYER SWITCH ##########');
    // say: that when activePlayer is zero, than make him one. other case: is he one - than make him zero 
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    //methods to add or remove an additional css class to a html-element
    //document.querySelector('.player-0-panel').classList.remove('active');
    //document.querySelector('.player-1-panel').classList.add('active');
    player0panelDOM.classList.toggle('active');
    player1panelDOM.classList.toggle('active');
    if (dice == 1) {
        diceDOM.style.display = 'block';
        secondDiceDOM.style.display = 'none';
    };
    if (secondDice == 1) {
        diceDOM.style.display = 'none';
        secondDiceDOM.style.display = 'block';
    };
    if (dice !== 1 && secondDice !== 1) {
        diceDOM.style.display = 'none';
        secondDiceDOM.style.display = 'none';
    };
    // set the remindTheDice to zero
    remindTheDice = [];
    remindTheSecondDice = [];
    console.log('mind of both dices cleared');
}
// CHECK FOR DOUBLED SIXES
function checkTheSix() {
    // push the current result into remindTheDice
    remindTheDice.push(dice);
    remindTheSecondDice.push(secondDice);
    // remove the first entrie of the array when the length of the array is 3
    if (remindTheDice.length === 3) {
        remindTheDice.shift();
        remindTheSecondDice.shift();
    }
    // check if the content of remindTheDice is 6,6 - then set roundScore to zero 
    if (remindTheDice[0] === 6 && remindTheDice[1] === 6 || remindTheSecondDice[0] === 6 && remindTheSecondDice[1] === 6) {
        console.log('mind of the first dice: ' + remindTheDice);
        console.log('mind of the second dice: ' + remindTheSecondDice);
        console.log('DoubleSix -> playerScore lost -> playerSwitch')
        scores[activePlayer] = 0;
        roundScore = 0;
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
        switchPlayer();
    }
}
// INITIALISE THE GAME AND SET ALL READY TO START 
function init() {
    finalScoreDOM.removeAttribute('disabled', 'disabled');
    finalScoreDOM.value = '';
    finalScoreDescDOM.textContent = 'enter the final score';
    // set the array with both global scores to zero
    scores = [0, 0];
    // say that player0 is the active player or that activePlayer is equal zero
    activePlayer = 0;
    // set the roundScore to the ground
    roundScore = 0;
    // say that the game has started by true
    gamePlaying = false;
    // refresh the html-elements by setting them to zero too 
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    // hide the stars no matter which player has won
    document.querySelector('.stars-0').style.backgroundSize = '.1% .1%';
    document.querySelector('.stars-1').style.backgroundSize = '.1% .1%';
    // remove the winner-look from both players
    player0panelDOM.classList.remove('winner');
    player1panelDOM.classList.remove('winner');
    // remove the active-look from both players
    player0panelDOM.classList.remove('active');
    player1panelDOM.classList.remove('active');
    // give the active player the active look
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
    // show both current round score boxes
    document.querySelector('.player-current-box-0').style.display = 'block';
    document.querySelector('.player-current-box-1').style.display = 'block';
    // show the buttons for roll the dice and save the score
    btnRollDOM.style.display = 'block';
    btnHoldDOM.style.display = 'block';
    // tell the dice that he is not visible for now
    diceDOM.style.display = 'none';
    // tell the second dice that he is not visible
    secondDiceDOM.style.display = 'none';
    // define the playernames and check the input
    function setPlayers() {
        // array to remember the name of every player
        var playerNames = [];
        var i = 0;
        var iPlayerNumber = 1;
        // AND to define the placeholder 'namePlayerX' in the playerNames-Array
        console.log(playerNames);
        console.log('Length of playerNames = ' + playerNames.length);

        function createInput() {
            console.log('create new inputfield');
            var wrapper = document.querySelector('.wrapper');
            var divBlur = document.createElement('div');
            var div = document.createElement('div');
            var para = document.createElement('p');
            var input = document.createElement('input');
            var button = document.createElement('button');

            wrapper.appendChild(divBlur);
            divBlur.classList.add('blur');

            wrapper.appendChild(div);
            div.classList.add('set-player-name');

            document.querySelector('.set-player-name').appendChild(para);
            para.classList.add('askPlayer');

            document.querySelector('.askPlayer').textContent = 'Player ' + iPlayerNumber + ' - set your Name';

            document.querySelector('.set-player-name').appendChild(input);
            input.classList.add('player-name-input');

            document.querySelector('.set-player-name').appendChild(button);
            button.classList.add('set-player-name-btn');
            document.querySelector('.set-player-name-btn').textContent = 'ok';
        }
        createInput();
        document.querySelector('.set-player-name-btn').addEventListener('click', function () {
            var playerNameINPUT = document.querySelector('.player-name-input').value;
            if (playerNameINPUT !== '') {
                playerNames.push(playerNameINPUT);
                console.log(playerNames);
                document.getElementById('name-' + [i]).textContent = playerNames[i];
                i++;
                iPlayerNumber++;
                console.log(iPlayerNumber);
                document.querySelector('.askPlayer').textContent = 'Player ' + iPlayerNumber + ' - set your Name';
                document.querySelector('.player-name-input').value = '';
            }
            if (iPlayerNumber > 2) {
                document.querySelector('.wrapper').removeChild(document.querySelector('.set-player-name'));
                document.querySelector('.wrapper').removeChild(document.querySelector('.blur'));
                finalScoreDescDOM.classList.add('blink_me');
            } else {
                console.log('Playername not valid');
            };
        });
    };
    setPlayers();

    function setWinningScore() {
        // make an entry to set the winning score
        console.log('Please set the winning score.');

        console.log(winningScore);
        // check the input 
        finalScoreDOM.addEventListener('keypress', function (e) {
            var key = e.which || e.keyCode;
            winningScore = finalScoreDOM.value;
            if (key === 13) {
                if (winningScore == '' || winningScore > 100 || winningScore == null || isNaN(winningScore)) {
                    console.log('NO VALID SCORE');
                    finalScoreDescDOM.textContent = '<<< no valid score >>>';
                    setTimeout(function () {
                        finalScoreDescDOM.textContent = 'enter the final score';
                    }, 2000);
                    gamePlaying = false;
                    setWinningScore();
                } else {
                    console.log('The Winning Score is ' + winningScore + '. have Fun!');
                    finalScoreDOM.setAttribute('disabled', 'disabled');
                    finalScoreDescDOM.classList.remove('blink_me');
                    finalScoreDescDOM.textContent = 'Thank you!';
                    setTimeout(function () {
                        finalScoreDescDOM.textContent = 'final score';
                    }, 2000);
                    gamePlaying = true;
                }
            }
        });
    }
    setWinningScore();
}