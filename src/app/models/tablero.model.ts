export class BuildTablero{
    //in the board are col-row filled
    //this is row-col
    buttonIDs:Array<any>

    //this need to set col-row filled
    charGrid:Array<any>
    gridSize:number
    nSize:number

    //inicial values current first player
    playerTurn:boolean = true

    constructor(gridSize:number, nSize:number){
        this.buttonIDs = []
        this.charGrid = []
        this.gridSize = gridSize
        this.nSize = nSize
    }

    fill() {
        let c = 1
        for (let i = 0; i < this.gridSize; i++) {
            this.buttonIDs.push([])
            this.charGrid.push([])

            for (let j = 0; j < this.gridSize; j++) {
                this.buttonIDs[i][j] = c
                this.charGrid[i][j] = "n"
                c++
            }
        }
    }

    getIdButtonCells(){
        return this.buttonIDs
    }

    getGridCharCells(){
        return this.charGrid
    }

    getUpdateGridLayout(id){
        // console.log(this.buttonIDs)
        // console.log(this.charGrid)
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                //if id is found, then we need the column
                if(this.buttonIDs[i][j] == id){
                    // console.log("columna... "+i)
                    // console.log("id but... "+this.buttonIDs[i][j])
                    return this.setCellInGrid(i)
                }
            }
        }
    }

    switchPlayer(){
        this.playerTurn = !this.playerTurn
    }

    getPlayerTurn(){
        return this.playerTurn ? "1" : "2"
    }

    getColorTurn(){
        let color1 = "#fff125"
        let color2 = "#f177ff"
        return this.playerTurn ? color1 : color2
    }

    setCellInGrid(col:number){
        for (let i = 0; i < this.gridSize; i++) {
            if(this.charGrid[col][i] != "n"){
                //find where the button need to be set and update the grid
                this.charGrid[col][i-1] = this.getPlayerTurn()
                //verify if is connected
                this.isNConnected(col,i-1)
                //return button id to set color
                return this.buttonIDs[col][i-1]
            }
        }
        //when it is the fisrt piece to be droped
        this.charGrid[col][this.gridSize-1] = this.getPlayerTurn()  
        this.isNConnected(col,this.gridSize-1)
        return this.buttonIDs[col][this.gridSize-1]
    }

    /**is called in the tablero.component.ts**/
    isNConnected(col:number, row:number){
        //verify if is N connected
        console.log(this.charGrid)
        if(this.verticalWin(row,col)){
            console.log("winner: vertical... "+this.getPlayerTurn())
        }
        if (this.horizontalWin(row,col)){
            console.log("winner: horizontal... "+this.getPlayerTurn())
        } 
        if (this.diagonalRightWin(row,col)){
            console.log("winner: diagonal derecha... "+this.getPlayerTurn())
        }
        if (this.diagonalLeftWin(row,col)){
            console.log("winner: diagonal izquierda... "+this.getPlayerTurn())
        }
    }

    horizontalWin(row:number,col:number){
        var count = 0

        //to right
        for (let i = col; i < this.gridSize; i++) {
            if(this.charGrid[i][row] == this.getPlayerTurn()){
                //console.log("right.. "+this.charGrid[i][row])
                count++
            } else {
                break
            }
        }
        //to left
        for (let j = col - 1; j >= 0; j--) {
            if(this.charGrid[j][row] == this.getPlayerTurn()){
                //console.log("left.. "+this.buttonIDs[j][row])
                count++
            } else {
                break
            }
        }
        console.log("TOTH:... " +  count)
        return count == this.nSize ? true : false
    }

    verticalWin(row:number,col:number){
        var count = 0

        //to down
        for (let i = row; i < this.gridSize; i++) {
            if(this.charGrid[col][i] == this.getPlayerTurn()){
                //console.log("down.. "+this.buttonIDs[col][i])
                count++
            } else {
                break
            }
        }
        //to up
        for (let j = row - 1; j >= 0; j--) {
            if(this.charGrid[col][j] == this.getPlayerTurn()){
                //console.log("up.. "+this.buttonIDs[col][j])
                count++
            } else {
                break
            }
        }
        console.log("TOTV:... " +  count)
        return count == this.nSize ? true : false
    }

    diagonalRightWin(row:number, col:number){
        var count = 0

        //to down right
        for (let i = col; i < this.gridSize; i++) {
            if(this.charGrid[i][row] == this.getPlayerTurn()){
                //console.log("down right.. "+this.charGrid[i][row])
                row++;count++
            } else {
                break
            }
        }
        //to up left
        for (let j = col - 1; j >= 0; j--) {
            if(this.charGrid[j][row] == this.getPlayerTurn()){
                //console.log("up left.. "+this.buttonIDs[j][row])
                row--
                count++
            } else {
                break
            }
        }
        console.log("TOTH:... " +  count)
        return count == this.nSize ? true : false
    }

    diagonalLeftWin(row:number, col:number){
        var count = 0

        //to down right
        for (let i = row; i < this.gridSize; i++) {
            if(this.charGrid[col][i] == this.getPlayerTurn()){
                //console.log("down right.. "+this.charGrid[col][i])
                col--
                count++
            } else {
                break
            }
        }
        //to up left
        for (let j = row - 1; j >= 0; j--) {
            if(this.charGrid[col][j] == this.getPlayerTurn()){
                //console.log("up left.. "+this.buttonIDs[col][j])
                col++
                count++
            } else {
                break
            }
        }
        console.log("TOTH:... " +  count)
        return count == this.nSize ? true : false
    }
}