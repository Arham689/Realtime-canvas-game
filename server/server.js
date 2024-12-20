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


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a room
    socket.on('join-room', ({ roomId, name }) => {
        socket.join(roomId);
        console.log(`${name} joined room ${roomId}`);

        // Notify others in the room
        socket.to(roomId).emit('user-joined', { name ,roomId });
    });

    // Handle cords event within a room
    // socket.on('cords', ({ roomId, arg }) => {
    //     console.log(`Cords from room ${roomId}:`, arg);
    //     socket.to(roomId).emit('UpdatedCords', arg);
    // });

    // Start drawing within a room
    socket.on('startDrawing', ({ id, arg }) => {
        socket.to(id).emit('startDrawing', arg);
    });

    // Draw within a room
    socket.on('draw', ({ id, arg }) => {
        socket.to(id).emit('draw', arg);
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
    })
});


server.listen(3001)