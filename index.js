// Tengo la sensacion de que esta bastante espaguettico (eso, o que estoy demasiado acostumbrado a Python)
// CUALQUER FEEDBACK ES MAS QUE BIENVENIDO, JS ES BASTANTE RARUNO Y ME HE PELEADO BASTANTE CON LA PROPIA SINTAXIS (algo que nunca me habia ocurrido con Python o Ruby)

const DIMENSION = 10 // Usaria un objeto INFO, pero de cara a usuario es mejor invocar CARRIER que INFO.CARRIER
const CARRIER = 4
const DESTROYER = 3
const SUBMARINE = 2
const BOAT = 1

// Aqui voy a guardar las posiciones de los barcos (variable auxiliar)
let positions = [] // Sortearlo es una fiesta, resulta que js sortea por string en vez de por valor. Se queda sin sortear


// Funciones para la fase 1
function x_or_y(){
    return Math.floor(Math.random() * 2) // Simplemente crea valores 0 o 1
}

function vertical_placement(board, x, y, stop){ // Coloca barcos en fila
    if (x - stop >= 0){
        while (stop >= 0){
            board[x - stop][y] = '🚢'
            positions.push([x - stop, y])
            stop--
        }
    }else{ // Si se fuese a salir el barco, se coloca de forma inversa
        while (stop >= 0){
            board[x + stop][y] = '🚢'
            positions.push([x + stop, y])
            stop--
        }
    }
}

function horizontal_placement(board, x, y, stop){ // Coloca barcos en columna
    if (y - stop >= 0){
        while (stop >= 0){
            board[x][y - stop] = '🚢'
            positions.push([x, y - stop])
            stop--
        }
    }else{ // Si se fuese a salir el barco, se coloca de forma inversa
        while (stop >= 0){
            board[x][y + stop] = '🚢'
            positions.push([x, y + stop])
            stop--
        }
    }
}

function ship_placer(board, x, y, ship_type){ // Coloca un barco concreto en el tablero
    let stop = ship_type - 1
    let choice = (x_or_y() <= 0) ? vertical_placement(board, x, y, stop) : horizontal_placement(board, x, y, stop)
    return board // Devuelve el tablero con el barco ya colocado
}

// Clase tablero, que creara los tableros de los jugadores

class Board{
    constructor(n = DIMENSION){ // Crea un tabero vacio (sin barcos), puede hacerse para n dimensiones pero el default es el del ejercicio
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
    place_ship(ship_info, board = this.board){ // Coloca un barco
        let x = Math.floor(Math.random() * DIMENSION)
        let y = Math.floor(Math.random() * DIMENSION)
        board[x][y] = '🚢'
        ship_placer(board, x, y, ship_info) // El scope de las variables esta siendo una fiesta, en Python utilizar global seria perfecto para este caso
    }
    get_ship_positions(){
        this.positions = positions
        positions = []
    }
}

// Normalmente haria la logica de los tableros en un modulo distinto phase_1.js y la logica de los jugadores en un modulo distinto phase_2.js pero js me esta dando tantos problemas para algo tan sencillo que voy a dejarlo todo aqui
// Clase jugador, que utiliza tableros y puede disparar
class Jugador{
    constructor(){
        this.board = new Board()
        this.shadow = new Board()
        this.shadow = this.shadow.board
        this.bullets = 100
        this.last_shot = []
        this.hits = 0
    }
    setup_ships(){
        this.board.place_ship(CARRIER)
        this.board.place_ship(DESTROYER)
        this.board.place_ship(SUBMARINE)
        this.board.place_ship(BOAT)
        this.board.place_ship(BOAT)
    }
    show_board(){
        console.table(this.board.board)
    }
    shoot(board){
        this.bullets--
        let x = Math.floor(Math.random() * DIMENSION)
        let y = Math.floor(Math.random() * DIMENSION)
        this.last_shot = [x, y]
        if (this.shadow[x][y] == " "){
            this.shadow[x][y] = 'X'
        }else{
            this.shoot(board)
        }
        if (board[x][y] == " "){
            board[x][y] = "💧"
        }else if (board[x][y] == "🚢"){
            this.hits++
            board[x][y] = "💥"
        }
    }
}


// Se crean dos jugadores
player_one = new Jugador()
player_one.setup_ships()

player_two = new Jugador()
player_two.setup_ships()

// Se crean los turnos (normalmente crearia una funcion turno con un disparo de cada, pero al ser automatico no tiene sentido)
while (player_one.hits < 11 && player_two.hits < 11){
    player_one.shoot(player_two.board.board)
    player_two.shoot(player_one.board.board)
}

console.table(player_one.board.board)
console.table(player_two.board.board)
console.log(player_one.hits)
console.log(player_two.hits)