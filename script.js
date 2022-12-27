let board, Score=0, rows=4, columns=4, a=false, s=false, d=false, f=false, lastStepBoard;
items = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
indexes = [0, 1, 2, 3];

if (!localStorage.getItem("topScore")) {
    localStorage.setItem("topScore", 0);
}

window.addEventListener("load", () => {
    let lastTopScore = localStorage.getItem("topScore");
    document.getElementById("topScoreValue").innerText = lastTopScore.toString();
    startGame();
})
let startGame = () => {
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    for (let i=0; i<rows; i++) {
        for (let j = 0; j < columns; j++) {
            let tile = document.createElement("div");
            tile.id = `${i.toString()}-${j.toString()}`;
            let number = board[i][j];
            setTile(tile, number);
            document.getElementById("board").append(tile);
        }
    }
    newCellCreator();
    newCellCreator();
}

let setTile = (tile, number) => {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile")
    if (number > 0) {
        tile.innerText = number;
        tile.classList.add(`tile${number.toString()}`);
    }
}

function throttleDecorator(func , delay )
{
    let canRecall = true
    let firstTime = true
    let timer = Date.now()

    const thruttledFunc = function (...args) {
        if (canRecall && (firstTime || Date.now() - timer > delay*1000)) {
            firstTime= false
            canRecall = false
            timer = Date.now()
            func(...args)
        }
    }

    let letCallFunc = ()=>
    {
        canRecall = true
    }

    return [thruttledFunc , letCallFunc]
}
const pressHandler = (ev) => {
    console.log('callback called')
    switch (ev.code) {
        case "ArrowLeft":
            lastStepBoard = [...board];
            slideLeft();
            if (JSON.stringify(lastStepBoard) !== JSON.stringify(board)) {
                a = true
            }
            break;
        case "ArrowUp":
            lastStepBoard = [...board];
            slideUp();
            if (JSON.stringify(lastStepBoard) !== JSON.stringify(board)) {
                s = true
            }
            break;
        case "ArrowRight":
            lastStepBoard = [...board];
            slideRight();
            if (JSON.stringify(lastStepBoard) !== JSON.stringify(board)) {
                d = true
            }
            break;
        case "ArrowDown":
            lastStepBoard = [...board];
            slideDown();
            if (JSON.stringify(lastStepBoard) !== JSON.stringify(board)) {
                f = true
            }
            break;
    }
}

const [keyPressHandler , letKeyPressRecall ] = throttleDecorator(pressHandler,0)

document.addEventListener("keydown",keyPressHandler )
let slideLeft = () => {
    for (let i = 0; i < rows; i++) {
        let row = board[i];
        row = rowChanger(row);
        board[i] = row;
        for (let j = 0; j < 4; j++) {
            let tile = document.getElementById(`${i.toString()}-${j.toString()}`);
            let number = board[i][j];
            setTile(tile, number);
        }
    }
}
let rowChanger = (row) => {
    row = zerosCleaner(row);
    for (let i = 0; i < row.length-1; i++) {
         if (row[i] === row[i+1]) {
             row[i] *= 2;
             row[i+1] = 0;
             Score += row[i];
         }
    }
    row = zerosCleaner(row);
    let difference = 4 - row.length;
    for (let i = 0; i < difference; i++) {
        row.push(0);
    }
    return row;
}
let zerosCleaner = (l) => {
    let newL = [];
    for (let i=0; i<l.length;i++) {
        if (l[i] !== 0) {
            newL.push(l[i]);
        }
    }
    return newL;
}

let slideRight = () => {
    for (let i = 0; i < rows; i++) {
        let row = board[i];
        row = rowReverser(row);
        row = rowChanger(row);
        row = rowReverser(row);
        board[i] = row;
        for (let j = 0; j < 4; j++) {
            let tile = document.getElementById(`${i.toString()}-${j.toString()}`);
            let number = board[i][j];
            setTile(tile, number);
        }
    }

}
let rowReverser = (lis) => {
    let newLis = [];
    for (let i = 0; i < 4; i++) {
        newLis.push(lis[3-i]);
    }
    return newLis;
}
let slideUp = () => {
    board = matrixTransposer(board);
    slideLeft();
    board = matrixTransposer(board);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let tile = document.getElementById(`${i.toString()}-${j.toString()}`);
            let number = board[i][j];
            setTile(tile, number);
        }
    }
}
let matrixTransposer = (mat) => {
    let newMat = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newMat[i][j] = mat[j][i];
        }
    }
    return newMat;
}

let slideDown = () => {
    board = matrixTransposer(board);
    slideRight();
    board = matrixTransposer(board);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let tile = document.getElementById(`${i.toString()}-${j.toString()}`);
            let number = board[i][j];
            setTile(tile, number);
        }
    }
}
let newCellCreator = () => {
    let random2_4 = items[Math.floor(Math.random()*(items.length))];
    let x = indexes[Math.floor(Math.random()*4)]
    let y = indexes[Math.floor(Math.random()*4)]
    if (board[x][y] === 0) {
        let tile = document.getElementById(`${x.toString()}-${y.toString()}`);
        board[x][y] = random2_4;
        setTile(tile, random2_4);
    } else {
        newCellCreator()
    }
}
document.addEventListener("keyup", () => {
    letKeyPressRecall()
    if (a) {
        newCellCreator()
         a = false
    } else if (s) {
        newCellCreator()
        s = false
    } else if (d) {
        newCellCreator()
        d = false
    } else if (f) {
        newCellCreator()
        f = false
    }
    document.getElementById("score").innerText = Score.toString();
    if (noZeros()) {
        if (gameOver()) {
            document.getElementById("topScore").style.marginTop = "60px";
            if (Score > localStorage.getItem("topScore")) {
                localStorage.setItem("topScore", Score);
                let lastTopScore = localStorage.getItem("topScore");
                document.getElementById("topScoreValue").innerText = lastTopScore.toString();
            }
            document.getElementById("GameOver").style.display = "flex";
            document.getElementById("GameOver").addEventListener("click", () => {
                location.reload();
            })
        }
    }
})
let noZeros = () => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true
}
let gameOver = () => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === board[i][j+1]){
                return false
            } else if (board[i][j] === board[i+1][j]) {
                return false
            }
        }
    }
    for (let i = 0; i < 3; i++) {
        if (board[i][3] === board[i+1][3]) {
            return false;
        } else if (board[3][i] === board[3][i+1]) {
            return false;
        }
    }
    return true
}
let compareMatrix = (mat1, mat2) => {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (mat1[i][j] !== mat2[i][j]) {
                return false
            }
        }
    }
    return true
}

let newGame = document.getElementById("newGame")
newGame.addEventListener("click", () => {
    if (Score > localStorage.getItem("topScore")) {
        localStorage.setItem("topScore", Score);
    }
    location.reload()
})