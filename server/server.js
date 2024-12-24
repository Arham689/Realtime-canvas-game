const express = require('express')
const cors = require('cors')
const {Server} = require('socket.io')
const { createServer } = require('http');
const app = express() ; 
app.use(express.json());
app.use(cors({
    origin : "*",
    methods : ["get" , "post" ],
    credentials : true
}));
const server = createServer(app)
const io = new Server(server , {
    cors : {
        origin : "*",
        methods : ["get" , "post" ],
        credentials : true
    }
})

app.get('/' , (req , res )=>{
    res.send('hello from the home ')
})

// io.on("connection" ,(socket)=>{
//     socket.on("cords", (arg) => {
//         console.log(arg); // world
//         // socket.broadcast.emit("UpdatedCords", arg );
//     });

//     socket.on('startDrawing' , (arg)=>{
//         socket.broadcast.emit('startDrawing' , arg ) 
//     })
    
//     socket.on('draw' , (arg)=>{
//         socket.broadcast.emit('draw' , arg ) 
//     })

//     socket.on('stopDrawing' , ()=>{
//         socket.broadcast.emit('stopDrawing') 
//     })
        
//     socket.on('drawing' , ()=>{
//         socket.broadcast.emit('drawing')
//     })

//     socket.on('eraseing' , ()=>{
//         socket.broadcast.emit('eraseing')
//     })
//     console.log('userc connected ')
//     console.log('id' , socket.id)

// })

// io.on('connection', (socket) => {
//         socket.on('join-room', ({ roomId, name }) => {
//             socket.join(roomId)
//             socket.to(roomId).emit('user-joined', { name })
//         })
//     }
// )

let room = require('./rooms')
let player = require('./player')
let utils = require('./utils')
let Rooms = [] 
let activePlayers = [] ;
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room
    socket.on('join-room', ({ roomId, name }) => {

        console.log(`${name} joined room ${roomId}`);

        const existingPlayer = activePlayers.find(
            player => player.name === name && player.roomId === roomId
          );
      
          if (!existingPlayer) {
            // Add new player
            activePlayers.push({ name, roomId, id: socket.id });
            console.log(`Player added: ${name}, Room: ${roomId}`);
          } else {
            // Update the player's socket ID
            existingPlayer.id = socket.id;
            console.log(`Player reconnected: ${name}, Room: ${roomId}`);
          }

        if (!roomId || !name)
            return;

        if (!Rooms[roomId]) {
            Rooms[roomId] = new room(roomId, 1234);
            Rooms[roomId].players.push(new player(socket, name, true));
            Rooms[roomId].words = utils.generateRdmWords();
            socket.join(roomId);
            socket['room'] = roomId;
            socket['name'] = name;
            io.in(roomId).emit('chat', {user: name, connected: true});
            socket.emit('draw', Rooms[roomId].words);
            socket.emit('players', [{name: name, score: 0}]);
            io.emit('rooms', utils.getListOfRooms(Rooms));
        } else {
            Rooms[roomId].players.push(new player(socket, name, false));
            socket.join(roomId);
            socket['room'] = roomId;
            socket['name'] = name;
            io.in(roomId).emit('chat', {user: name, connected: true});
            socket.emit('guess', Rooms[roomId].players[Rooms[roomId].drawing].name);
            if (Rooms[roomId].word)
                socket.emit('word', Rooms[roomId].hiddenWord);
            io.in(roomId).emit('players', utils.getListOfPlayers(Rooms[roomId]));
        }

        console.log(activePlayers)
        // Notify others in the room
        io.to(roomId).emit('user-joined', { name ,roomId , activePlayers});
    });

    
    socket.on('word', (word) => {
        Rooms[socket['room']].word = word;
        Rooms[socket['room']].hiddenWord = utils.hideWord(word.cleanString());
        socket.to(socket['room']).emit('word', Rooms[socket['room']].hiddenWord);
        socket.emit('word', word);
        Rooms[socket['room']].clockInterval = setInterval(() => {
            Rooms[socket['room']].clock -= 1000;
            io.in(socket['room']).emit('clock', Rooms[socket['room']].clock);
        }, 1000);
        Rooms[socket['room']].hintTimeout = setTimeout(() => {
            Rooms[socket['room']].hiddenWord = utils.hideWord(word.cleanString(), true);
            socket.to(socket['room']).emit('word', Rooms[socket['room']].hiddenWord);
        }, 30000);
        Rooms[socket['room']].skipTimeout = setTimeout(() => {
            Rooms[socket['room']].skipRound(io);
        }, 60000);
    });

    // Start drawing within a room
    socket.on('startDrawing', ({ id, arg }) => {
        socket.to(id).emit('startDrawing', arg);
    });

    // Draw within a room
    socket.on('drawline', ({ id, arg }) => {
        socket.to(id).emit('drawline', arg);
    });

    // Stop drawing within a room
    socket.on('stopDrawing', ({ id }) => {
        socket.to(id).emit('stopDrawing');
    });

    // Handle additional events within a room
    socket.on('drawing', ({ id }) => {
        socket.to(id).emit('drawing');
    });

    socket.on('eraseing', ({ id }) => {
        socket.to(id).emit('eraseing');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on('chat-message' , ({text , name , id })=>{
        socket.to(id).emit('chat-message' , {name , text})
        // console.log(name , text)
    })

    socket.on('disconnect' , ()=>{
        console.log('User disconnected:', socket.id)

        activePlayers = activePlayers.filter(playerId => playerId.id !== socket.id);
        console.log(`Active players: ${activePlayers}`);
    })
});

String.prototype.cleanString = function () {
    return this.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

server.listen(3001)