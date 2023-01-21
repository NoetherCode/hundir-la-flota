// Hago la fase 1 del ejercicio por separado, este codigo seria mucho mas mantenible y escalable
// Aun asi, tengo la sensacion de que esta bastante espaguettico (eso, o que estoy demasiado acostumbrado a Python)

const DIMENSION = 10 // Usaria un objeto INFO, pero de cara a usuario es mejor invocar CARRIER que INFO.CARRIER
const CARRIER = 4
const DESTROYER = 3
const SUBMARINE = 2
const BOAT = 1

// Aqui voy a guardar las posiciones de los barcos (variables auxiliares)
let carrier_position = []
let destroyer_position = []
let submarine_position = []
let boat_1_position = []
let boat_2_position = []


function x_or_y(){
    return Math.floor(Math.random() * 2) // Simplemente crea valores 0 o 1
}

function vertical_placement(board, x, y, stop){ // Coloca barcos en fila
    if (x - stop >= 0){
        while (stop > 0){
            board[x - stop][y] = '🚢'
            stop--
        }
    }else{ // Si se fuese a salir el barco, se coloca de forma inversa
        while (stop > 0){
            board[x + stop][y] = '🚢'
            stop--
        }
    }
}

function horizontal_placement(board, x, y, stop){ // Coloca barcos en columna
    if (y - stop >= 0){
        while (stop > 0){
            board[x][y - stop] = '🚢'
            stop--
        }
    }else{ // Si se fuese a salir el barco, se coloca de forma inversa
        while (stop > 0){
            board[x][y + stop] = '🚢'
            stop--
        }
    }
}

function ship_placer(board, x, y, ship_type){ // Coloca un barco concreto en el tablero
    let stop = ship_type - 1
    let choice = (x_or_y() <= 0) ? vertical_placement(board, x, y, stop) : horizontal_placement(board, x, y, stop)
    return board // Devuelve el tablero con el barco ya colocado
}

class Board{
    constructor(n = DIMENSION){ // Crea un tabero vacio (sin barcos), puede hacerse para n dimensiones pero e default es el del ejercicio
        this.board = this.create_board(n)
    }
    create_board(dim = DIMENSION){
        var board = [] // Prepara el array n x n
        for (let total_rows = 0; total_rows < dim; total_rows++){
            let row = [] // Prepara el array n
            for (let total_columns = 0; total_columns < dim; total_columns++){
                row[total_columns] = " " // Llena el array con strings backspace UNICOS (.fill solo me hace una referencia... por que js, por que)
            }
            board[total_rows] = row // Llena el array con filas UNICAS (de nuevo .fill solo hace referencia)
        }
        return board
    }
    place_ship(ship_info, board = this.board){ // Colca un barco
        let x = Math.floor(Math.random() * DIMENSION)
        let y = Math.floor(Math.random() * DIMENSION)
        board[x][y] = '🚢'
        ship_placer(board, x, y, ship_info) // El scope de las variables esta siendo una fiesta, en Python utilizar global seria perfecto para este caso
    }
}



inst_1 = new Board()
inst_2 = new Board()
inst_1.place_ship(CARRIER)
inst_1.place_ship(DESTROYER)
inst_1.place_ship(SUBMARINE)
inst_1.place_ship(BOAT)
inst_1.place_ship(BOAT)
inst_2.place_ship(CARRIER)
inst_2.place_ship(DESTROYER)
inst_2.place_ship(SUBMARINE)
inst_2.place_ship(BOAT)
inst_2.place_ship(BOAT)
console.table(inst_1.board)
console.table(inst_2.board)