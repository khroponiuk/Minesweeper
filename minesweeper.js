var Minesweeper = (function(){
    var matrix = [],
        rowsNumber,
        colsNumber,
        bombsNumber,
        gameWrapper,
        table;

    function init(rows, cols, bombs, gameSelector){
        rowsNumber = parseInt(rows) || 0;
        colsNumber = parseInt(cols) || 0;
        bombsNumber = parseInt(bombs) || 0;
        gameWrapper = document.querySelector(gameSelector);

        _createEmptyMatrix();

        _generateTable();
        table = gameWrapper.querySelector('.minesweeper-table');

        _bindEvents();
    }

    function _createEmptyMatrix() {
        matrix = new Array(rowsNumber);
        for (var i = 0; i < rowsNumber; i++) {
            matrix[i] = new Array(colsNumber);
            for (var j = 0; j < matrix[i].length; j++) {
                matrix[i][j] = new Cell(i, j, false, false);
            }
        }
    }

    function _generateTable(){
        var table = document.createElement('table');
        table.classList.add('minesweeper-table');

        for (var i = 0; i < rowsNumber; i++) {
            var row = document.createElement('tr');
            for (var j = 0; j < colsNumber; j++) {
                var col = document.createElement('td');
                row.appendChild(col);
            }
            table.appendChild(row);
        }
        gameWrapper.innerHTML = table.outerHTML;
    }

    function _bindEvents(){
        table.addEventListener('click', _firstClickHandler);
        table.addEventListener('contextmenu', _setFlag);
    }

    function _setFlag(e){
        e.preventDefault();
        var tableCell = _getCellIfExists(e);
        if(!tableCell){
            return false;
        }
        toggleClass(tableCell, 'flag');
    }

    function _firstClickHandler(e){
        //fills it with bombs
        //sets bombs around cells
        e.preventDefault();
        var tableCell = _getCellIfExists(e);
        if(!tableCell){
            return false;
        }
        _initMatrix(tableCell.parentElement.rowIndex, tableCell.cellIndex);
        _updateBombsNumberAround();
        _setStandartClickEventHandler();

        //# simulation of user click
        tableCell.click();
    }

    function _initMatrix(row, col){
        var [startRow, startCol, endRow, endCol] = _getCellLimits(row, col);
        
        var bombsCounter = bombsNumber;
        while (bombsCounter > 0) {
            var cell = _getRandomCell();
            if((cell.row < startRow || cell.row > endRow) && (cell.col < startCol || cell.col > endCol)){
                matrix[cell.row][cell.col].isMine = true;  
                //_markCellAsMine(cell.row, cell.col);
                bombsCounter--;                              
            }
        }
    }

    function _markCellAsMine(row, col){
        table.rows[row].cells[col].classList.add('mine');
    }

    function _updateBombsNumberAround(){
        for (var i = 0; i  < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if(!matrix[i][j].isMine){
                    _countBombsAround(i, j);                
                }
            }
        }
    }

    function _countBombsAround(row, col){
        var [startRow, startCol, endRow, endCol] = _getCellLimits(row, col);

        for(var i = startRow; i <= endRow; i++){
            for(j = startCol; j <= endCol; j++){
                if(matrix[i][j].isMine && !(row == i && col == j)){
                    matrix[row][col].bombsAround++;
                }
            }
        }
        //# move to separate func
        //table.rows[row].cells[col].textContent = matrix[row][col].bombsAround;
    }


    function _standartClickHandler(e){
        e.preventDefault();
        var cell = _getCellIfExists(e, true);
        if(cell == undefined 
            || matrix[cell.row][cell.col].isOpen
            || table.rows[cell.row].cells[cell.col].classList.contains('flag')){
            return false;
        }
        _openCell(cell);
    }

    function _openCell(cell){
        if(cell.isMine){
            alert("You lose");
        } else if (cell.bombsAround == 0){
            _openCellsAround(cell);
            matrix[cell.row][cell.col].isOpen = true;

            table.rows[cell.row].cells[cell.col].textContent = matrix[cell.row][cell.col].bombsAround;
            table.rows[cell.row].cells[cell.col].classList.remove('flag');
            table.rows[cell.row].cells[cell.col].classList.add('open');
            
        }
    }

    function _openCellsAround(cell){
        var [startRow, startCol, endRow, endCol] = _getCellLimits(cell.row, cell.col);

        for(var i = startRow; i <= endRow; i++){
            for(j = startCol; j <= endCol; j++){
                if(!matrix[i][j].isOpen && !matrix[i][j].isMine){
                    matrix[i][j].isOpen = true;

                    table.rows[i].cells[j].textContent = matrix[i][j].bombsAround;
                    table.rows[i].cells[j].classList.remove('flag');
                    table.rows[i].cells[j].classList.add('open');

                    _openCellsAround(matrix[i][j]);
                }
            }
        }
    }

    function _getRandomCell() {
        return {
            row: rand(rowsNumber - 1),
            col: rand(colsNumber - 1)
        };
    }

    function _getCellIfExists(e, getMatrixCell){
        getMatrixCell = getMatrixCell || false;
        if(e.target.nodeName !== 'TD'){
            return undefined;
        }
        var col = e.target.cellIndex,
            row = e.target.parentElement.rowIndex;
        if(getMatrixCell){
            return matrix[row][col];
        }
        return table.rows[row].cells[col];
    }

    function _getCellLimits(row, col){
        var startRow = row > 0 ? row - 1 : row,
            startCol = col > 0 ? col - 1 : col,
            endRow = row < rowsNumber - 1 ? row + 1 : row,
            endCol = col < colsNumber - 1 ? col + 1 : col;
        
        return [startRow, startCol, endRow, endCol];
    }

    function _setFirstClickEventHandler(){
        table.removeEventListener('click', _standartClickHandler);
        table.addEventListener('click', _firstClickHandler);
    }

    function _setStandartClickEventHandler(){
        table.removeEventListener('click', _firstClickHandler);
        table.addEventListener('click', _standartClickHandler);
    }

    return {
        init: init
    };
})();