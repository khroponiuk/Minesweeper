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

var print = function(matrix){
    for(var i = 0; i < matrix.length; i++){
        var row = matrix[i];
        var str = '[ _ ';
        for(var j = 0; j < row.length; j++){
            str += (row[j].isMine == true ? 'X' : 0) + ' _ ';
        }
        str += ']';
        console.log(str);
    }
}

var printAdvanced = function(matrix){
    for(var i = 0; i < matrix.length; i++){
        var row = matrix[i];
        var str = '[ _ ';
        for(var j = 0; j < row.length; j++){
            if(row[j].isMine){
                str += 'X _ ';
            }else{
                str += row[j].bombsAround + ' _ ';
            }
        }
        str += ']';
        console.log(str);
    }
}