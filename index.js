//Load Board manually
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  let timer;
  let timeRemaining;
  let lives
  let selectedNum;
  let selectedTile;
  let disableSelect;

  window.onload = function(){
      
    //Run start game function when start button clicked.
      id('start-btn').addEventListener('click',startGame)
      
      //Add eventListener to numbers in number-container.
      for (let i = 0 ; i < id('number-container').children.length; i++){
        id('number-container').children[i].addEventListener('click',function(){
            //If Selecting is not disabled
            if(!disableSelect){
                //if number is already selected
                if(this.classList.contains('selected')){
                    //Then remove selection
                    this.classList.remove('selected');
                    selectedNum = null;
                }else{
                    //Deselect all number
                    for(let i = 0; i < 9 ; i++){
                        id('number-container').children[i].classList.remove('selected');
                    };
                    //Select it and update selectedNum Variable
                    this.classList.add('selected');
                    selectedNum = this;
                    updateMove();
                }
            }
        })
      }
  }

  //Function that start the game.
  function startGame(){
      console.log('start')
     //Choose game difficulty.
     if(id('diff-1').checked) board = easy[0];
     else if(id('diff-2').checked) board = medium[0];
     else board = hard[0];
     //Set lives to 3 enable selecting number and tiles
     lives = 3000;
     disableSelect = false;
     id('lives').textContent = `Lives Remaining: ${lives}`;
     //Create board 
     generateBoard(board);
     //Start timer
     startTimer();
        
     // Set theme
     if(id('theme-2').checked){
         qs('body').classList.remove('dark');
     }else{
         qs('body').classList.add('dark');
     }
     //Show number container
    //  id('number-container').style.display = 'block';
  }


  //Function generatBoard 
  function generateBoard(board){
      
    //Clear previous board
      clearPrevious();

    //let use to increment tile ids
    let idCount = 0;
    
    // Create Tiles
    for (let i =0 ; i < 81; i++){
        
        //Create a new paragraph
        let tile = document.createElement('p');
        if(board.charAt(i) != '-'){
            //Set tile text to correct number
            tile.textContent = board.charAt(i)
        }else{
            //Add event listener to tile
            tile.addEventListener('click',function(){
                console.log(!disableSelect);
                //If selecting is not disabled
                if(!disableSelect){
                    //if tile is already selected
                    if(tile.classList.contains('selected')){
                        //then remove selection
                        tile.classList.remove('selected');
                        selectedTile = null;
                    }else{
                        //Deselect all tiles
                        for(let i = 0 ; i < 81 ; i++){
                            qsa('.tile')[i].classList.remove('selected');
                        }
                        //Add selection and update variable
                        tile.classList.add('selected');
                        selectedTile = tile;
                        updateMove();
                    }
                }
            })
        }
        //Assign tile id 
        tile.id = idCount;
        //Increment for next tile 
        idCount++;
        //Add tile class to the tile
        tile.classList.add('tile'); 
        //Adding Borders
        // if((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id > 54)){
        //     tile.classList.add('bottomBorder');
        // } 
        // if((tile.id + 1) % 9 === 3 || (tile.id + 1) % 9 === 6){
        //     tile.classList.add('rightBorder');
        // }  
        //Add tile to board
        id('board').appendChild(tile);
    }
  }


  //   Function that Update Moves
  //if a tile and a number is selected
      function updateMove(){
      if(selectedTile && selectedNum){
          //Set the tile to correct number
          selectedTile.textContent = selectedNum.textContent
          //if the number matches the corresponding number in solution key
          if(checkCorrect(selectedTile)){
              //Deselect the tiles
              selectedTile.classList.remove('selected');
              selectedNum.classList.remove('selected');
              //Clear the selected variables
              selectedTile = null;
              selectedNum = null;
              //check if board is completed
              if(checkDone()){
                  endGame();
              }
          }else{
            //Disable selecting new number for one second
            disableSelect = true;
            // Make the tile turn red
            selectedTile.classList.add('incorrect');
            //Run one second
            setTimeout(function(){
                // substract lives by one 
                lives--;
                if(lives === 0){
                    endGame();
                }else{
                    // if lives is not equal to zero
                    //update lives
                    id('lives').textContent = 'Lives Remaning' + lives;
                    // renable selecting number and tiles
                    disableSelect = false;
                }

                //restore tiles color and remove selected form both
                selectedTile.classList.remove('incorrect');
                selectedTile.classList.remove('selected');
                selectedNum.classList.remove('selected');
                // clear tile text and clear selected varible
                selectedTile.textContent = '';
                selectedTile = null;
                selectedNum = null;
            },1000);
          }
      }

    //Function CheckDOne 
    function checkDone(){
        let tiles = qsa('.tile')
        for(let i = 0 ; i < tiles.length ; i++){
            if(tile.textContent === '') return false;
        }
        return true;
    }  

    //Function That end game
    function endGame(){
        //diable moves and stop the timer
        clearTimeout(timer);
        //Display win or loss
        if(lives === 0 || timeRemaining === 0){
            id('lives').textContent = 'You Lost!';
        }else{
            id('lives').textContent = 'You Won';
        }
    }  

    
    //CheckCorrect Function
   function checkCorrect(tile){
        // set solution based on difficulty selected
        let solution;
        if(id('diff-1').checked) solution = easy[1];
        else if(id('diff-2').checked) solution = medium[1];
        else solution = hard[1];

        //if tile's numberis eqaul to solution's number

        if(solution.charAt(tile.id) === tile.textContent) return true 
        else return false;
    }  

  }

  //Function that clears previous board
  function clearPrevious(){
      
    //Access all file 
      let tiles = qsa('.tile');
      
      //Remove each tile
      for(let i = 0 ; i < tiles.length; i++ ){
          tiles[i].remove();
      }

      //Clearing previous time
      if(timer) clearTimeout(timer);

      //Deselect any number
      for (let i = 0 ;i < id('number-container').children.length;i++){
          id('number-container').children[i].classList.remove('selected');
      }

      //Clear selected variable
      selectedTile =  null;
      selectedNum =null;
  }

  //Function StartTimer
  function startTimer(){
      
    //Set time remaining 
      if(id('time-1').checked) timeRemaining = 300;
      else if(id('time-2').checked) timeRemaining = 900;
      else timeRemaining = 1500;
    //Set time for first second
    id('timer').textContent = timeConversion(timeRemaining);
    //Set timer to every second
    timer = setInterval(function(){
        timeRemaining--
        // if no time remaining 
        if(timeRemaining === 0) endGame();
        id('timer').textContent = timeConversion(timeRemaining)
    },1000)
  }

//TimeConversion Function
function timeConversion(time){
    let minutes = math.floor(time / 60);
    if(minutes < 10) minutes = '0' + minutes;
    let seconds = time % 60;
    if(seconds <  10) seconds = '0' + seconds;
    return `${minutes} : ${seconds}`; 
}


//Function to return Id  element..
  function id(id){
      return document.getElementById(id);
  }

//Function return querySelector element
function qs(selector){
    return document.querySelector(selector)
}

//Function return querySelectorAll element
function qsa(selector){
    return document.querySelectorAll(selector)
}
