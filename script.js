let board, Score=0, rows=4, columns=4;
items = [2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2];
indexes = [0, 1, 2, 3];
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
    firstTwoTilesGenerator()

    for (let i=0; i<rows; i++) {
        for (let j = 0; j < columns; j++) {
            let tile = document.createElement("div");
            tile.id = `${i.toString()}-${j.toString()}`;
            let number = board[i][j];
            setTile(tile, number);
            document.getElementById("board").append(tile);
        }
    }
}
let firstTwoTilesGenerator = () => {
    while (true) {
        let u1 = Math.floor(Math.random() * 4);
        let v1 = Math.floor(Math.random() * 4);
        let u2 = Math.floor(Math.random() * 4);
        let v2 = Math.floor(Math.random() * 4);
        if (u1 === v1 && u2 === v2) {
            board = [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
            ];
            firstTwoTilesGenerator()
        } else {
            board[u1][v1] = 2;
            board[u2][v2] = 2;
            break
        }
    }
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
document.addEventListener("keydown", (ev) => {
    switch (ev.code) {
        case "ArrowLeft":
            slideLeft();
            break;
        case "ArrowUp":
            slideUp();
            break;
        case "ArrowRight":
            slideRight();
            break;
        case "ArrowDown":
            slideDown();
            break;
    }
})
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
    let x = indexes[Math.floor(Math.random()*4)]
    let y = indexes[Math.floor(Math.random()*4)]
    if (board[x][y] === 0) {
        let tile = document.getElementById(`${x.toString()}-${y.toString()}`);
        board[x][y] = 2;
        setTile(tile, 2)
    } else {
        newCellCreator()
    }
}
document.addEventListener("keyup", (ev) => {
    switch (ev.code) {
        case "ArrowLeft":
            newCellCreator()
            break;
        case "ArrowUp":
            newCellCreator()
            break;
        case "ArrowRight":
            newCellCreator()
            break;
        case "ArrowDown":
            newCellCreator()
            break;
    }
    document.getElementById("score").innerText = Score.toString();
    if (noZeros()) {
        if (gameOver()) {
            if (Score > localStorage.getItem("topScore")) {
                localStorage.setItem("topScore", Score);
                let lastTopScore = localStorage.getItem("topScore");
                document.getElementById("topScoreValue").innerText = lastTopScore.toString();
            }
            document.getElementById("GameOver").style.display = "flex";
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

let newGame = document.getElementById("newGame")
newGame.addEventListener("click", () => {
    location.reload()
})