    class CellClickHandler{
        constructor(){
            this._strategy;
        }

        setStrategy(strategy) {
            this._strategy = strategy;
        }

        execute(cell, minesweeper){
            this._strategy.execute(cell, minesweeper);
        }
    }

    class CellClickBeforeInit{
        execute(cell, minesweeper){
            var cellLocation = {
                row: cell.parentElement.rowIndex,
                col: cell.cellIndex
            };
            minesweeper.init(cellLocation);
            cellClickHandler.setStrategy(new CellClickAfterInit(cell, minesweeper));
        }
    }
    
    class CellClickAfterInit{
        execute(cell, minesweeper){
            
        }
    }