var GX = 0; //블럭을 생성할 초기 위치 X
var GY = 3; //블럭을 생서할 초기 위치 Y
var NGY = 17;
var TURN = 0;
var TYPE = Math.round(Math.random()*6);
var NTYPE = Math.round(Math.random()*6);
var BLOCKTYPE=6, BLOCKROTATE=3;
var GAME_SPEED = 2000;
 
window.onload = function(){
    drawMap();
    drawNextTetris(NTYPE);
    myFunction();
}

function drawMap(){
    var rowLen = MAP.length;
    var tag = "<table>";
    var x = 0;
    var y = 0;
    for(var i=0; i<rowLen; i++){
        tag += "<tr>"
        var colLen = MAP[i].length;
        for(var j=0; j<colLen; j++){
            var className = "";
            var idValue = "";
            if(MAP[i][j] == 0){
                className = "map";
                idValue = "x"+(i-2)+"y"+(j-2);
            }else if(MAP[i][j] == 2){
                className = "map";
                idValue = "xn"+(i-1)+"yn"+(j-16);
            }else if(MAP[i][j] == 3){
                className = "guard";
            }else if(MAP[i][j] == 4){
                className = "board";
            }

            if(idValue != ""){
                tag += "<td id="+idValue+" class="+className+"></td>"
            }else{
                tag += "<td class="+className+"></td>"
            }
            
        }
        tag += "</tr>"
    }
    document.getElementById("container").innerHTML = tag + "</table>";
};

function ChangeColor(x, y, cN){
    document.getElementById("x"+x+"y"+y).className = cN;
}

//다음에 그려질 방향의 테트리스 그리기
function drawNextTetris(NTYPE){
    for(var x=0; x<4; x++){
        for(var y=0; y<4; y++){
            if(TETRIS[NTYPE][0][x][y] == 1){
                ChangeColor("n"+(x+1), "n"+y, "block"+NTYPE);                
            }
        }
    }
}

//테트리스 그리기
function drawTetris(GX, TYPE, TURN){
    for(var x=0; x<TETRIS[BLOCKTYPE][BLOCKROTATE].length; x++){
        for(var y=0; y<TETRIS[BLOCKTYPE][BLOCKROTATE][x].length; y++){
            if(TETRIS[TYPE][TURN][x][y] == 1){
                ChangeColor(x+GX, y+GY, "block"+TYPE);
            }
        }
    }
}

//동작을 초기화하고 입력값에 따라 그려줄 함수
function myFunction(input){
    //테트리스 블럭 그리기
    drawTetris(GX, TYPE, TURN);
}