class Minesweeper{
    constructor(rowsNumber, colsNumber, bombsNumber) {
        this.rows = +rowsNumber;
        this.cols = +colsNumber;
        this.bombs = +bombsNumber;
        this.matrix = new Array(this.rows);
        
        this.gameOver = false;
        this.uncheckedCells = (this.rows + this.cols) - this.bombs;
    }

    init(blockedCell) {
        for (var i = 0; i < this.matrix.length; i++) {
            this.matrix[i] = Array.apply(null, Array(this.cols)).map(Number.prototype.valueOf, 0);
        }
        var bombsCounter = this.bombs;
        while (bombsCounter > 0) {
            var {row, col} = this._getRandomCell();
            console.log("Row: " + row + "Col: " + col);
            if(!this.isMine(row, col) && blockedCell.row != row && blockedCell.col != row){
                this.matrix[row][col] = -1;
                this._updateBombIndexesAround(row, col);
                bombsCounter--;
            }
        }
    }

    valueAt(row, col) {
        return this.matrix[row][col];
    }

    isMine(row, col) {
        return this.matrix[row][col] == -1;
    }

    _updateBombIndexesAround(row, col){
        //updates row above
        if(this.matrix[row - 1]){
            if(this.matrix[row - 1][col - 1] != undefined && !this.isMine(row - 1, col - 1)){
                this.matrix[row - 1][col-1]++;
            }
            if(this.matrix[row - 1][col] != undefined && !this.isMine(row - 1, col)){
                this.matrix[row - 1][col]++;
            }
            if(this.matrix[row - 1][col + 1] != undefined && !this.isMine(row - 1, col + 1)){
                this.matrix[row - 1][col + 1]++;
            }
        }
        //updates current row
        if(this.matrix[row][col - 1] != undefined && !this.isMine(row, col - 1)){
                this.matrix[row][col-1]++;
        }
        if(this.matrix[row][col + 1] != undefined && !this.isMine(row, col + 1)){
                this.matrix[row][col + 1]++;
        }
        //updates row below
        if(this.matrix[row + 1]){
            if(this.matrix[row + 1][col - 1] != undefined && !this.isMine(row + 1, col - 1)){
                this.matrix[row + 1][col - 1]++;
            }
            if(this.matrix[row + 1][col] != undefined && !this.isMine(row + 1, col)){
                this.matrix[row + 1][col]++;
            }
            if(this.matrix[row + 1][col + 1] != undefined && !this.isMine(row + 1, col + 1)){
                this.matrix[row + 1][col + 1]++;
            }
        }        
    }

    _getRandomCell() {
        return {
            row: this._getRandomIndex(this.rows - 1),
            col: this._getRandomIndex(this.cols - 1)
        };
    }

    _getRandomIndex(maxIndex) {
        return Math.floor(Math.random() * maxIndex);
    }
}