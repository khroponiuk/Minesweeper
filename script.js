document.addEventListener('DOMContentLoaded', function name(params) {
    document.querySelector('.minesweeper-form').addEventListener('submit', function(e){
        e.preventDefault();
        var rows = this.querySelector('[name="board-rows"]').value;
        var cols = this.querySelector('[name="board-cols"]').value;
        var bombs = this.querySelector('[name="number-of-bombs"]').value;
        Minesweeper.init(rows, cols, bombs, '.game-wrapper');
    });
})