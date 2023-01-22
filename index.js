// Tengo la sensacion de que esta bastante espaguettico (eso, o que estoy demasiado acostumbrado a Python)
// CUALQUER FEEDBACK ES MAS QUE BIENVENIDO, JS ES BASTANTE RARUNO Y ME HE PELEADO BASTANTE CON LA PROPIA SINTAXIS (algo que nunca me habia ocurrido con Python o Ruby)
// ESTE ES MI PRIMER SCRIPT EN JS, ES 100% SEGURO QUE SE PUEDE MEJORAR. CUALQUIER CONSEJO SOBRE COMO HACER UN CODIGO MAS IDIOMATICO ES SUPER BIENVENIDO. GRACIAS!!!

const DIMENSION = 10 // Usaria un objeto INFO, pero de cara a usuario es mejor invocar CARRIER que INFO.CARRIER
const CARRIER = 5
const GUNNER = 4
const SUBMARINE = 3
const CRUISER = 2
const BOAT = 1

// Aqui voy a guardar las posiciones de los barcos (variable auxiliar)
let positions = [] // Sortearlo es una fiesta, resulta que js sortea por string en vez de por valor. Se queda sin sortear


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

function setup_game(dim = 10){ // Prepara el juego, y evita que se ponga un barco encima del otro. Cuando se tiene un tablero valido, entonces se termina la fase 1
    player_one = new Jugador()
    player_one.setup_ships()
    player_two = new Jugador()
    player_two.setup_ships()
    let count_one = 0 // A partir de aqui se comprueba el tablero
    let count_two = 0
    for (let total_rows = 0; total_rows < dim; total_rows++){
        let row = player_one.board.board[total_rows]
        for (let total_columns = 0; total_columns < dim; total_columns++){
            if (row[total_columns] == '🚢'){
                count_one++
            }
        }
    }
    for (let total_rows = 0; total_rows < dim; total_rows++){
        let row = player_two.board.board[total_rows]
        for (let total_columns = 0; total_columns < dim; total_columns++){
            if (row[total_columns] == '🚢'){
                count_two++
            }
        }
    }
    if (count_one < 24 || count_two < 24){ // Esta recursion hace que no se permita un barco encima del otro. Creo que se puede hacer mucho mejor, pero me ha parecido una buena solucion de junior
        setup_game() // Me encantaria saber como mejorar esta parte del codigo
    }
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
                row[total_columns] = " " // Llena el array con strings backspace UNICOS (.fill solo me hace una referencia... por que js, por que.. hacer copia es realmente dificil)
            }
            board[total_rows] = row // Llena el array con filas UNICAS (de nuevo .fill solo hace referencia)
        }
        return board
    }
    place_ship(ship_info, board = this.board){ // Coloca un barco
        let x = Math.floor(Math.random() * DIMENSION)
        let y = Math.floor(Math.random() * DIMENSION)
        board[x][y] = '🚢'
        ship_placer(board, x, y, ship_info)
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
        this.board.place_ship(GUNNER)
        this.board.place_ship(SUBMARINE)
        this.board.place_ship(SUBMARINE)
        this.board.place_ship(CRUISER)
        this.board.place_ship(CRUISER)
        this.board.place_ship(CRUISER)
        this.board.place_ship(BOAT)
        this.board.place_ship(BOAT)
        this.board.place_ship(BOAT)
    }
    show_board(){
        console.table(this.board.board)
    }
    shoot(board){
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
            this.bullets--
        }else if (board[x][y] == "🚢"){
            this.bullets--
            this.hits++
            board[x][y] = "💥"
            console.log(`Ha acertado en [${x}, ${y}]! Vuelve a disparar`)
            this.shoot(board)
        }
    }
}

// Se crean dos jugadores con tableros validos (Fase 1)
setup_game()

// Se empieza el juego (Fase 2)

console.log("----------| EMPIEZA EL JUEGO |----------")
console.log(" ---> Jugador 1")
player_one.show_board()
console.log(" ---> Jugador 2")
player_two.show_board()
console.log("---------| EMPIEZAN LAS RONDAS |--------")

let contador = 0
while (player_one.hits < 24 && player_two.hits < 24){
    contador ++
    console.log(`RONDA ${contador}`)
    console.log(`Dispara el jugador 1 (con ${player_one.hits} aciertos hasta ahora)`)
    player_one.shoot(player_two.board.board)
    console.log(`El jugador 1 ha disparado a [${player_one.last_shot}], le quedan ${player_one.bullets} disparos`)
    player_two.show_board()
    console.log(`Dispara el jugador 2 (con ${player_two.hits} aciertos hasta ahora)`)
    player_two.shoot(player_one.board.board)
    console.log(`El jugador 2 ha disparado a [${player_two.last_shot}], le quedan ${player_two.bullets} disparos`)
    player_one.show_board()
}
if (player_one.hits == 24){
    console.log(`El jugador 1 es el vencedor!`)
    player_one.show_board()
}else{
    console.log(`El jugador 2 es el vencedor!`)
    player_two.show_board()
}