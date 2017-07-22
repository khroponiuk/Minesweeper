document.addEventListener('DOMContentLoaded', function name(params) {
    Minesweeper.init();

    var userInput = '';
    window.addEventListener('keypress', (e) => {
        if(e.which == 96){
            userInput = '';
        }
        userInput += String.fromCharCode(e.which);
        if(userInput.toLowerCase() === 'test'){
            Minesweeper.showMines();
        }
    })
})