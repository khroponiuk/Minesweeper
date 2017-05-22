var Minesweeper = (function(){
    var matrix = [],
        rowsNumber,
        colsNumber,
        bombsNumber,
        gameWrapper,
        table,
        bombsLeftCounter,
        openedCellsNumber;

    function init(){
        _generateForm();
    }

    function _generateForm(){
        var wrapper = document.createElement('div');
        wrapper.classList.add('game-wrapper');
        var form = document.createElement('form');

        var header = document.createElement('h3');
        header.textContent = 'Minesweeper init form';

        var colsInput = _generateInput('number', 'number-of-rows', 'Rows', 0, 100, 'Rows number');
        var rowsInput = _generateInput('number', 'number-of-cols', 'Cols', 0, 100, 'Cols number');
        var bombsInput = _generateInput('number', 'number-of-bombs', 'Bombs', 0, 100, 'Bombs number');

        var submitBtn = document.createElement('input');
        submitBtn.setAttribute('type', 'submit');

        form.appendChild(header);
        form.appendChild(colsInput);
        form.appendChild(rowsInput);
        form.appendChild(bombsInput);
        form.appendChild(submitBtn);
        
        wrapper.appendChild(form);

        var firstChild = document.body.firstChild;
        document.body.insertBefore(wrapper, firstChild);
        
        gameWrapper = wrapper;
        form.addEventListener('submit', _formHandler);
    }

    function _formHandler(e){
        e.preventDefault();
        var rows = this.querySelector('[name="number-of-rows"]').value;
        var cols = this.querySelector('[name="number-of-cols"]').value;
        var bombs = this.querySelector('[name="number-of-bombs"]').value;
        if(!rows || !cols || !bombs){
            return false;
        }
        _initProperties(rows, cols, bombs, '.game-wrapper');
    }

    function _generateInput(type, name, labelText, minValue, maxValue, placeholder){
        var label = document.createElement('label');
        label.textContent = labelText;

        var input = document.createElement('input');
        input.setAttribute('type', type);        
        input.setAttribute('name', name);
        input.setAttribute('min', minValue);
        input.setAttribute('max', maxValue);
        input.setAttribute('placeholder', placeholder);

        label.appendChild(input);

        return label;
    }

    function _initProperties(rows, cols, bombs, gameSelector){
        rowsNumber = parseInt(rows) || 0;
        colsNumber = parseInt(cols) || 0;
        bombsNumber = bombsLeftCounter = parseInt(bombs) || 0;
        gameWrapper = document.querySelector(gameSelector);
        openedCellsNumber = 0;

        _createEmptyMatrix();

        _generateField();
        table = gameWrapper.querySelector('.minesweeper-table');

        _bindEvents();
        _updateBombsLeftCounter();
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

    function _generateField(){
        var headerBlock = document.createElement('div');
        headerBlock.classList.add('bombs-left');
        headerBlock.textContent = 'Bombs left: ';
        var b = document.createElement('b');
        headerBlock.appendChild(b);

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
        gameWrapper.innerHTML = headerBlock.outerHTML + table.outerHTML;
    }

    function _bindEvents(){
        table.addEventListener('click', _firstClickHandler);
        table.addEventListener('contextmenu', _setFlag);
    }

    function _setFlag(e){
        e.preventDefault();
        var cell = _getCellIfExists(e, true);
        if(!cell || cell.isOpen){
            return false;
        }

        if(table.rows[cell.row].cells[cell.col].classList.contains('flag')){
            table.rows[cell.row].cells[cell.col].classList.remove('flag');
            bombsLeftCounter++;
        } else{
            table.rows[cell.row].cells[cell.col].classList.add('flag');
            bombsLeftCounter--;            
        }
        _updateBombsLeftCounter();
    }

    function _updateBombsLeftCounter(){
        gameWrapper.querySelector('.game-wrapper .bombs-left b').textContent = bombsLeftCounter;
    }

    function _firstClickHandler(e){
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
            if(!matrix[cell.row][cell.col].isMine && (cell.row < startRow 
                || cell.row > endRow) && (cell.col < startCol || cell.col > endCol)){
                matrix[cell.row][cell.col].isMine = true;  
                bombsCounter--;                              
            }
        }
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
    }

    function _standartClickHandler(e){
        e.preventDefault();
        var cell = _getCellIfExists(e, true);
        if(cell == undefined 
            || matrix[cell.row][cell.col].isOpen
            || table.rows[cell.row].cells[cell.col].classList.contains('flag')){
            return false;
        }
        _checkGameForEnd();        
        _openCell(cell);
    }

    function _openCell(cell){
        if(cell.isMine){
            _loseGame(cell);
        } else{
            matrix[cell.row][cell.col].isOpen = true;

            table.rows[cell.row].cells[cell.col].classList.remove('flag');
            table.rows[cell.row].cells[cell.col].classList.add('open');

            var value = matrix[cell.row][cell.col].bombsAround === 0 ? '' : matrix[cell.row][cell.col].bombsAround;
            table.rows[cell.row].cells[cell.col].textContent = value;

            openedCellsNumber++;
            _checkGameForEnd();
            
            if (cell.bombsAround == 0){
                _openCellsAround(cell);
            }
        }
    }

    function _openCellsAround(cell){
        var [startRow, startCol, endRow, endCol] = _getCellLimits(cell.row, cell.col);

        for(var i = startRow; i <= endRow; i++){
            for(j = startCol; j <= endCol; j++){
                if(!matrix[i][j].isOpen && !matrix[i][j].isMine){
                    matrix[i][j].isOpen = true;
                    openedCellsNumber++;

                    table.rows[i].cells[j].classList.remove('flag');
                    table.rows[i].cells[j].classList.add('open');

                    var value = matrix[i][j].bombsAround === 0 ? '' : matrix[i][j].bombsAround;
                    table.rows[i].cells[j].textContent = value;

                    if(matrix[i][j].bombsAround === 0){
                        _openCellsAround(matrix[i][j]);
                    }
                }
            }
        }
    }

    function _checkGameForEnd(){
        if(openedCellsNumber === rowsNumber * colsNumber - bombsNumber){
            alert('You won :)');
        }
    }

    function _loseGame(cell){
        _showMines();
        table.rows[cell.row].cells[cell.col].classList.add('red-mine');
        setTimeout(function() {
            alert('Booom :(');
        }, 0); 
    }

    function _showMines(){
        for (var i = 0; i  < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                if(matrix[i][j].isMine){
                     table.rows[i].cells[j].classList.add('mine');           
                     table.rows[i].cells[j].classList.add('open');           
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