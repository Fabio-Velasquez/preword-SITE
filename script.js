// Global constants
//how long to pause in between clues
const cluePauseTime = 333;
//how long to wait before starting playback of the clue sequence
const nextClueWaitTime = 1000; 

//Global Variables
//how long to hold each clue's light/sound
var clueHoldTime = 1000; 
// make sure the pattern and pattern length is the same number
var pattern = [2, 2, 4];
// pattern length should pattern.length - 1 to work correctly
var patternLength = 2;
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
// must be between 0.0 and 1.0
var volume = 0.5; 
var guessCounter = 0;
var mistake = 0;


// below is the my failed attempt of creating a timer for the game.
const timeLimit = 3;
let time = timeLimit * 60; 
const countdownEl = document.getElementById("timer");
function startTimer(time)
{
  
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  countdownEl.innerHTML = minutes+":"+seconds;
  time--;
}


// optional feature 2 I had generated a random patter for each game.
// this function will generate a pattern and it's pattern length is a variable
function generatePattern()
{
  var min = Math.ceil(1);
  var max = Math.floor(8);
  for(let i = 0; i <= patternLength; i++)
  {
    pattern[i] = Math.floor(Math.random() * (max - min + 1) + min); 
    console.log("clue: " + pattern[i] + " index " + i);
  }
  
}

function startGame()
{
  // intialize game variables
  generatePattern();
  //this line of code was meant for optional feature 6
  //setInterval(startTimer,1000);
  
  progress = 0;
  mistake = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame()
{
  
  gamePlaying = false;
  clueHoldTime = 1000;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  
}

function winGame()
{
  stopGame();
  alert("Game Over. You won!");
}
function loseGame()
{
  stopGame();
  alert("Game Over. You lost.");
}

// functions to light or clear the buttons 
function lightButton(btn)
{
  document.getElementById("button"+btn).classList.add("lit")
}
// this will clear the button after being pressed
function clearButton(btn)
{
  document.getElementById("button"+btn).classList.remove("lit")
}


function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  // for optional feature 4 I have edited the guess function to check mistake count
  // if guess is incorrect tbe player will have 3 strikes
  if(pattern[guessCounter] == btn)
  {
    if(guessCounter == progress)
    {
      if(progress == pattern.length - 1)
      {
        winGame();
      }
      else
      {
        progress++;
        playClueSequence();
      }
    }
    else
    {
      guessCounter++;
    } 
  }  
  else
  {
    // here we increment the strike counter and notify the player
    mistake++;
    alert("mistake "+mistake+"/3");
    if(mistake == 3)
     {
       loseGame();
     } 
  }
}

// this function will play the tone for the particular button
function playSingleClue(btn)
{
  if(gamePlaying)
  {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

// this will play the whole sequence 
function playClueSequence()
{
  guessCounter = 0;
  //set delay to initial wait time
  let delay = nextClueWaitTime; 
  // for optional feature 2:
  // this was my attempt in making the timer decrease to make it more diificult for the player. 
  clueHoldTime = clueHoldTime - (50 * progress);
  // for each clue that is revealed so far
  
  for(let i = 0; i <= progress; i++)
  { 
    
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    // set a timeout to play that clue
    setTimeout(playSingleClue,delay,pattern[i]); 
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  
}

//optional feature 1
// Sound Synthesis Functions and added 4 more sounds
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 550,
  6: 800,
  7: 1000,
  8: 612
  
}

// below are the functions from the built in JS library to create our sounds
function playTone(btn,len)
{ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}


function startTone(btn)
{
  if(!tonePlaying)
  {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}


function stopTone()
{
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}


//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)