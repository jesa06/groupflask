var H=34, W=20; // field size
var shapeArray = [
    [[2,2],[1,2],[1,1],[0,1]],
    [[1,1],[1,0],[0,2],[0,1]],
    [[2,1],[1,1],[1,2],[0,2]],
    [[1,2],[1,1],[0,1],[0,0]],
    [[1,2],[1,1],[0,2],[0,1]],
    [[2,0],[1,1],[1,0],[0,0]],
    [[1,1],[0,2],[0,1],[0,0]],
    [[2,2],[1,2],[1,1],[0,2]],
    [[1,2],[1,1],[1,0],[0,1]],
    [[3,1],[2,1],[1,1],[0,1]],
    [[1,3],[1,2],[1,1],[1,0]],
    [[2,2],[2,1],[1,1],[0,1]],
    [[1,0],[0,2],[0,1],[0,0]],
    [[2,2],[1,2],[0,2],[0,1]],
    [[1,2],[1,1],[1,0],[0,2]],
    [[2,2],[2,1],[1,2],[0,2]],
    [[2,2],[2,1],[2,0],[1,0]],
    [[2,1],[1,1],[0,1],[0,2]],
    [[1,2],[0,2],[0,1],[0,0]]
]; // shape 
var shapeRotateMap = [1,0,3,2,4,6,7,8,5,10,9,12,13,14,11,16,17,18,15];//rotate shape of the shape
var shapeColorArray = [
    "rgb(199,82,82)",
    "rgb(233,174,43)",
    "rgb(105,155,55)",
    "rgb(53,135,145)",
    "rgb(49,95,151)",
    "rgb(102,86,167)"
];//color
var tileColor = "rgb(9,17,26)",
    shapeColor,
    wallColor = "rgb(22,41,63)";
var shapeColorIndex, nextColorIndex;
var movingThread, movingSpeed;
var fastMode = false;
var initSpeed = 500,
    deltaSpeed = 40,
    fastSpeed = 35;
var shapeCell;
var existField;
var shapePoint;
var createPoint=[1,parseInt(W/2)-2];
var currentShape, nextShape, changeshape;
var score, level, levelStack=0;
var isPaused = false;
var isQuit = false;

init();

// key 
document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e){
    switch(e.keyCode){
        case 81: changeShape(); break; //Q key
        case 37: setTimeout("moveLR(-1)",0); break; // Left Arrow
        case 39: setTimeout("moveLR(1)",0); break;  // Right Arrow
        case 32: setTimeout("rotateShape()",0); break;  // Space
        case 40: moveFast(); break;                     // Down Arrow
        case 80: pause(); break;   // P
    }
}
document.onkeyup = keyUpEventHandler;
function keyUpEventHandler(e){
    if(e.keyCode == 40) {
        moveSlow();
    }
    
}

// first setting
function init(){
    drawField();
    initExistField();
    setWall();
    nextColorIndex = -1;
    movingSpeed = initSpeed;
    shapeCell=[];
    shapePoint=[1,1];
    score=0; level=1;
    chooseNextShape();
    chooseNextColor();
    createShape();
}

function gebi(y,x){
    var ret = document.getElementById(String(y)+" "+String(x));
    return ret;
}

// clear field
function initExistField(){
    existField = new Array(H);
    for(var i=0;i<H;i++) {
        existField[i]=new Array(W);
    }
    for(var i=0;i<H;i++) {
        for(var j=0;j<W;j++) {
            existField[i][j]=false;
        }
    }
}
//table
function drawField(){
    var fieldTag = "<table id=\"gameTable\" border=0>";
    for(var i=0;i<H;i++){
        fieldTag += "<tr>";
        for(var j=0;j<W;j++) {
            fieldTag += "<td id=\""+String(i)+" "+String(j)+"\"></td>";
        }
        fieldTag += "</tr>";
    }
    document.write(fieldTag);
}
function setWall(){
    for(var i=0;i<H;i++){
        gebi(i,0).style.background = wallColor;
        gebi(i,W-1).style.background = wallColor;
        existField[i][0]=true;
        existField[i][W-1]=true;
    }
    for(var i=0;i<W;i++){
        gebi(0,i).style.background = wallColor;
        gebi(H-1,i).style.background = wallColor;
        existField[0][i]=true;
        existField[H-1][i]=true;
    }
}

// making figure
function chooseNextShape(){
    nextShape = parseInt(Math.random() * shapeArray.length);
}
function chooseNextColor(){
    if(++nextColorIndex == shapeColorArray.length)
        nextColorIndex=0;
}

function createShape(){
    shapePoint[0] = createPoint[0];
    shapePoint[1] = createPoint[1];
    currentShape = nextShape;
    currentColorIndex = nextColorIndex;
    shapeColor = shapeColorArray[currentColorIndex];
    var shape = shapeArray[currentShape];
    chooseNextShape();
    chooseNextColor();
    displayNextShape();
    for(var i=0;i<shape.length;i++){
        var sy = shapePoint[0]+shape[i][0];
        var sx = shapePoint[1]+shape[i][1];
        if(!isValidPoint(sy,sx)) {
            clearTimeout(movingThread);
            gameOver();
            break;
        }
        var el = gebi(parseInt(sy), parseInt(sx));
        el.style.background = shapeColor;
        shapeCell.push([sy,sx]);
    }
    levelStack++;
    leveling();
    movingThread = setTimeout("moveDown()",movingSpeed);
}
function displayNextShape(){
    initNextTable();
    var shape = shapeArray[nextShape];
    var color = shapeColorArray[nextColorIndex];
    for(var i=0;i<4;i++){
        var y = shape[i][0];
        var x = shape[i][1];
        document.getElementById(String(y)+String(x)).style.background = color;
    }
}
function initNextTable(){
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++)
            document.getElementById(String(i)+String(j)).style.background = "rgb(14,31,49)";
}

//  adjust figure
function moveDown(){
    if(!canMove(1,0)){
        commitExist(); 
        checkLine();
        shapeCell=[];
        createShape();
        return;
    }
    removeShape();
    for(var i=0;i<shapeCell.length;i++) shapeCell[i][0]++;
    shapePoint[0]++;
    showShape();
    movingThread = setTimeout("moveDown()",movingSpeed);
}

function rotateShape(){
    if(!canRotate()) {
        return;
    }   
    removeShape();
    shapeCell=[];
    currentShape = shapeRotateMap[currentShape];
    var rotatedShape = shapeArray[currentShape];
    for(var i=0;i<4;i++){
        var sy = shapePoint[0] + rotatedShape[i][0];
        var sx = shapePoint[1] + rotatedShape[i][1];
        shapeCell.push([sy,sx]);
    }
    showShape();
}
function canRotate(){
    var tempShape = shapeArray[shapeRotateMap[currentShape]];
    for(var i=0;i<4;i++){
        var ty = shapePoint[0]+tempShape[i][0];
        var tx = shapePoint[1]+tempShape[i][1];
        if(!isValidPoint(ty,tx)) return false;
    }
    return true;
}
function isValidPoint(y,x){
    return !(y<=0 || y>=H-1 || x<=0 || x>=W-1 || existField[y][x]);
}
function removeShape(){
    for(var i=0;i<shapeCell.length;i++){
        var el = gebi(shapeCell[i][0],shapeCell[i][1]);
        el.style.background = tileColor;
    }
}
function showShape(){
    for(var i=0;i<shapeCell.length;i++){
        var el = gebi(shapeCell[i][0],shapeCell[i][1]);
        el.style.background = shapeColor;
    }
}
function canMove(dy,dx){
    for(var i=0;i<shapeCell.length;i++){
        var ny = shapeCell[i][0]+dy;
        var nx = shapeCell[i][1]+dx;
        if(!isValidPoint(ny,nx)) return false;
    }
    return true;
}
// this function is to identify the shape whether it can move
function moveLR(delta){
    if(!canMove(0,delta) || isPaused) return;
    removeShape();
    for(var i=0;i<shapeCell.length;i++) shapeCell[i][1]+=delta;
    shapePoint[1]+=delta;
    showShape();
}
function moveFast(){
    if(fastMode) return;
    clearTimeout(movingThread);
    movingSpeed = fastSpeed;
    movingThread = setTimeout("moveDown()",movingSpeed);
    fastMode = true;
}
function moveSlow(){
    if(!fastMode) return;
    clearTimeout(movingThread);
    movingSpeed = initSpeed - (level*deltaSpeed);
    movingThread = setTimeout("moveDown()",movingSpeed);
    fastMode = false;
}

// score
function commitExist(){
    for(var i=0;i<shapeCell.length;i++){
        var y = shapeCell[i][0];
        var x = shapeCell[i][1];
        existField[y][x]=true;
    }
}


function checkLine(){
    var plusScore = level * 100;
    var combo = 0;
    var finalScore = 0;
    for(var i=H-2;i>1;i--){
        if(isFull(i)){
            removeLine(i);
            i++;
            finalScore += updateScore(plusScore,++combo);
        }
        if(combo > 0) displayCombo(combo, finalScore);
    }
}
function isFull(lineIndex){
    for(var i=1;i<W-1;i++) {
        if(!existField[lineIndex][i]) {
            return false;
        }
    }
    return true;
}
function removeLine(lineIndex){
    for(var i=lineIndex-1;i>=1;i--){
        for(var j=1;j<W-1;j++){
            gebi(i+1,j).style.background = gebi(i,j).style.background;
            existField[i+1][j] = existField[i][j];
        }
    }
}
function leveling(){
    if(level==10) return;
    if(levelStack == level * 10){
        level++;
        levelStack=0;
        if(!fastMode)
            movingSpeed = initSpeed - (level*deltaSpeed);
    }
    document.getElementById("level").innerHTML = level;
}
function updateScore(plusScore,combo){
    var comboScore = plusScore * combo;
    score += comboScore;
    document.getElementById("score").innerHTML = score;
    return comboScore;
}
function displayCombo(combo, finalScore){
    var comboStr = combo +" COMBO +"+finalScore;
    document.getElementById("comboField").innerHTML = comboStr;
    setTimeout(function(){document.getElementById("comboField").innerHTML = "";},700);
}

function changeShape() {
    removeShape();
    shapeCell = [];
    clearTimeout(movingThread);
    changeshape = parseInt(Math.random() * shapeArray.length);
    shapePoint[0] = createPoint[0];
    shapePoint[1] = createPoint[1];
    currentShape = changeshape;
    currentColorIndex = nextColorIndex-1;
    if (currentColorIndex == -1) {
        currentColorIndex = 5;
    }
    shapeColor = shapeColorArray[currentColorIndex];
    var shape = shapeArray[currentShape];
    var shape = shapeArray[changeshape];
    var color = shapeColorArray[nextColorIndex];
    for(var i=0;i<shape.length;i++){
        var sy = shapePoint[0]+shape[i][0];
        var sx = shapePoint[1]+shape[i][1];
        if(!isValidPoint(sy,sx)) {
            clearTimeout(movingThread);
            gameOver();
        }
        var el = gebi(parseInt(sy), parseInt(sx));
        el.style.background = shapeColor;
        shapeCell.push([sy,sx]);
    }
    leveling();
    movingThread = setTimeout("moveDown()",movingSpeed);
}
var arrayScoreboard = [];

// pause or end
function gameOver(){
    clearTimeout(movingThread);
    document.getElementById("gameField").style.visibility = "hidden";
    document.getElementById("gameover").style.visibility = "visible";
    initExistField();
    if (!isQuit) {
        alert("[Game Over!]\nLevel: "+level+"\nScore: "+score);
        window.prompt("Enter Name");
    }
    isQuit = true;
}
function pause(){
    var x = document.getElementById("audio");
    function playAudio() {
        x.play();
    }
    function pauseAudio() {
        x.pause();
    }
    if(!isQuit) {
        if(isPaused){
            movingThread = setTimeout("moveDown()",movingSpeed);
            document.getElementById("pause").style.visibility = "hidden";
            document.getElementById("gameField").style.visibility = "visible";
            isPaused = false;
        }
        else {
            clearTimeout(movingThread);
            document.getElementById("gameField").style.visibility = "hidden";
            document.getElementById("gameover").style.visibility = "hidden";
            document.getElementById("pause").style.visibility = "visible";
            isPaused = true;
        }
    }
}
