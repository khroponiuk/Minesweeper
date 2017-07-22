function Cell(row, col, isOpen, isMine, bombsAround){
    this.row = row;
    this.col = col;
    this.isOpen = isOpen;
    this.isMine = isMine;
    this.bombsAround = bombsAround || 0;
}

function rand(max) {
    return Math.floor(Math.random() * max);
}

function toggleClass(element, className) {
    if(element.classList.contains(className)){
        element.classList.remove(className);
    } else{
        element.classList.add(className);
    }
}