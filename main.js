var inputWord = document.getElementById("iWord");
var sendButton = document.getElementById("enterWord");
var wordMatrixTable = document.getElementById("wordMatrixTable");
var goverText = document.getElementById("goverText");
var warnText = document.getElementById("warnText");

var letterAmount = 5
var attempAmount = 5
var originalWord = "mytho"
var originalWordSplitted = originalWord.split('')
var split = originalWord.split('')
var wordMatrix = [[]]
var matrixpt = 1;
var winned = false;

var diccionario = {};

sendButton.onclick = function(){sendWord()}

setupEnviroment();

function sendWord(){
    if(!winned){
        var word = inputWord.value.split('')
        console.log(originalWordSplitted)
        console.log(word)
        var onlyLetters = true;
        var isWord = false;
        for(let i=0;i<word.length;i++){
            if(!isletter(word[i])){
                onlyLetters = false
            }
        }
        for(let i=0;i<diccionario.length;i++){
            if(inputWord.value.toUpperCase()==diccionario[i].toUpperCase()){
                isWord = true;
            }
        }
        if(word.length == 5 && matrixpt<=attempAmount && onlyLetters && isWord){
            if(inputWord.value.toUpperCase()==originalWord.toUpperCase()){
                winTheGame();
            }
            removeWarning();
            wordMatrix[matrixpt] = word;
            matrixpt++;
            inputWord.value = ""
            updateMatrixTable();
            if(matrixpt>attempAmount){
                gameOver()
            }
        }else if(!onlyLetters){
            sendWarning("Only letters please")
        }else if(word.length != 5){
            sendWarning("Enter a word of 5 letters")
        }else if(!isWord){
            sendWarning("It is not a word")
        }
    }
}

function setupEnviroment(){
    chooseWord();
    setMatrix()
}

async function getListWords(tam) {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data[tam]; 
    } catch (error) {
        console.error("Unable to fetch data:", error);
        return null; 
    }
}

async function chooseWord(){
    diccionario = await getListWords(`${letterAmount}`)
    console.log(diccionario);
    var rand = Math.floor(Math.random() * diccionario.length);
    originalWord = diccionario[rand]
    originalWordSplitted = originalWord.split('')
    split = originalWord.split('')
    console.log(originalWord);
}

function setMatrix(){
    wordMatrix = [[]]
    for(let i=0;i<attempAmount;i++){
        var lst = []
        for(let j=0;j<letterAmount;j++){
            lst.push("");
        }
        wordMatrix.push(lst);
    }
    console.log(wordMatrix);
    updateMatrixTable()
}

function updateMatrixTable(){
    var tempTabla = `<table>`
    for(let i=0;i<attempAmount;i++){
        tempTabla += `
        <tr>`
        split = originalWord.split('')
        var deltedwords = 0;
        var correctLetters = [];
        for(let j=0;j<letterAmount;j++){
            if(wordMatrix[i+1][j].toUpperCase() == originalWordSplitted[j].toUpperCase()){
                correctLetters.push(true);
                console.log(`Eliminated word: ${split[j-deltedwords]}`);
                split.splice(j-deltedwords,1);
                deltedwords++;
            }else{
                correctLetters.push(false);
            }
        }
        for(let j=0;j<letterAmount;j++){
            if(!correctLetters[j]){
                if (checkLetterBelong(wordMatrix[i+1][j],j)){
                    tempTabla += `<td><div class="letterBelong">${wordMatrix[i+1][j].toLowerCase()}</div></td>`
                }else{
                        tempTabla += `<td><div class="letterNull">${wordMatrix[i+1][j].toLowerCase()}</div></td>`
                }
            }else{
                tempTabla += `<td><div class="letterCorrect">${wordMatrix[i+1][j].toLowerCase()}</div></td>`
            }
        }
        tempTabla += `</tr>`;
    }
    tempTabla += "</table>";
    wordMatrixTable.innerHTML = tempTabla;
    console.log(wordMatrixTable.innerHTML);
}

function checkLetterBelong(letter,pos){
    for(let i=0;i<split.length;i++){
        if (split[i].toUpperCase()==letter.toUpperCase()){
            split.splice(i,1);
            return true;
        }
    }
    return false;
}

function gameOver(){
    goverText.innerHTML = `<p class="goverText">The word was ${originalWord.toUpperCase()}</p>
    <button type="button" id="restartBT" class="restartBT" onclick="restartGame()">One More?</button>`
}

function winTheGame(){
    goverText.innerHTML = `<p class="winText">Correct!!</p>
    <button type="button" id="restartBT" class="restartBT" onclick="restartGame()">One More?</button>`
    winned = true
}

function restartGame(){
    winned = false
    goverText.innerHTML = ''
    matrixpt = 1;
    setupEnviroment()
}

function sendWarning(warn){
    warnText.innerHTML = `<p class="warnText">${warn}</p>`;
}

function removeWarning(){
    warnText.innerHTML = ``;
}

function isletter(key) {
    return key.length == 1 && key.match(/[a-zA-Z]/i);
  }