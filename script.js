document.addEventListener('DOMContentLoaded', function name(params) {
    var minesweeper = new Minesweeper(10, 10, 15);
    var cellClickHandler = new CellClickHandler();
    cellClickHandler.setStrategy(new CellClickBeforeInit());

    document.querySelector('.minesweeper-form').addEventListener('submit', function(e){
        e.preventDefault();
        var rows = this.querySelector('[name="board-rows"]').value;
        var cols = this.querySelector('[name="board-cols"]').value;
        var bombs = this.querySelector('[name="number-of-bombs"]').value;
        minesweeper = new Minesweeper(rows, cols, bombs);
        generateTable(rows, cols);
    });

    function generateTable(rows, cols) {
        var tbody = document.createElement('tbody');

        for (var i = 0; i < rows; i++) {
            var row = document.createElement('tr');
            for (var j = 0; j < cols; j++) {
                var col = document.createElement('td');
                row.appendChild(col);
            }
            tbody.appendChild(row);
        }
        var table = document.querySelector('.game-wrapper table');
        table.innerHTML = tbody.outerHTML;
    }

    document.querySelector('.game-wrapper table').addEventListener('click', function(e){
        if(e.target.nodeName !== 'TD'){
            return false;
        }
        cellClickHandler.execute(e.target, minesweeper);
    });



    function openCell(row, col){

    }
})