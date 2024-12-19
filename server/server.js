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

io.on("connection" ,(socket)=>{
    socket.on("cords", (arg) => {
        console.log(arg); // world
        // socket.broadcast.emit("UpdatedCords", arg );
    });

    socket.on('startDrawing' , (arg)=>{
        socket.broadcast.emit('startDrawing' , arg ) 
    })
    
    socket.on('draw' , (arg)=>{
        socket.broadcast.emit('draw' , arg ) 
    })

    socket.on('stopDrawing' , ()=>{
        socket.broadcast.emit('stopDrawing') 
    })
        
    socket.on('drawing' , ()=>{
        socket.broadcast.emit('drawing')
    })

    socket.on('eraseing' , ()=>{
        socket.broadcast.emit('eraseing')
    })
    console.log('userc connected ')
    console.log('id' , socket.id)

})



server.listen(3001)