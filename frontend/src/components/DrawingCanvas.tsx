
import React, { useEffect, useRef, useState } from 'react';
import socket from './socket'
import { useLocation, useParams } from 'react-router-dom';
import WinnerPage from './WinnerPage';


const DrawingCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [isDrawingSelected, setIsDrawingSelected] = useState<boolean>(true)
    const [winner, setWinner] = useState<any>(null)
    // const [activePlayeres, setActivePlayeres] = useState([])
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");

    const { id } = useParams()
    const roomId = id

    const [drawing, setDrawing] = useState<boolean>(false);
    const [guess, setGuess] = useState(true);
    const [wait, setWait] = useState(false);
    const [playerDrawing, setPlayerDrawing] = useState('');
    const [words, setWords] = useState<string[]>([]);
    const selectTimeout = useRef<NodeJS.Timeout | null >(null);

    
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });

        socket.on('disconnect' , ()=>{
            console.log('User disconnected:', socket.id)
        })
        
        socket.emit('join-room', { roomId, name })

        socket.on('user-joined', ({ name, roomId , activePlayers}) => {
            // setActivePlayeres(...activePlayeres)
            console.log(activePlayers)
            console.log(name, roomId)
        })

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = 750;
        canvas.height = 650;

        const context = canvas.getContext("2d");
        if (!context) return;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;

        contextRef.current = context;

        const handleTouchStart = (event: TouchEvent) => {
            event.preventDefault();
            // @ts-ignore
            startDrawing(event);
        };

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault();
            //@ts-ignore
            draw(event);
        };

        const handleTouchEnd = (event: TouchEvent) => {
            event.preventDefault();
            stopDrawing();
        };

        socket.on('UpdatedCords', (e) => {
            console.log(e.x, e.y)
            drawLine(e.x, e.y)
        })
        socket.on('startDrawing', (e) => {
            // const ctx = contextRef.current ;
            // if(!ctx) return ; 

            // ctx.beginPath();
            // ctx.moveTo(e.x , e.y );
            // ctx.lineTo(e.x , e.y );
            // ctx.stroke();
            startDrawingline(e)
        })
        socket.on('drawline', (e) => {
            // const ctx = contextRef.current ;
            // if(!ctx) return ;

            // ctx.lineTo(e.x, e.y);
            // ctx.stroke();
            drawline2(e)
        })
        socket.on('stopDrawing', () => {
            // const ctx = contextRef.current ;
            // if(!ctx) return ;

            // ctx.closePath();
            stopDrawingline()

        })
        socket.on('drawing', () => {
            const ctx = contextRef.current;
            if (!ctx) return;

            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = 5;
        })

        socket.on('eraseing', () => {
            const ctx = contextRef.current;
            if (!ctx) return;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 50;
        })

        socket.on('winner' , handleWinner )
        socket.on('draw' , handleDraw )
        socket.on("guess", handleGuess);
        socket.on('word' , ()=>{
            setWait(false)
        })
        canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
        canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
        canvas.addEventListener("touchend", handleTouchEnd, { passive: false });

        return () => {
            // Cleanup listeners
            canvas.removeEventListener("touchstart", handleTouchStart);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchend", handleTouchEnd);
            socket.off('connect');
        };


    }, []);

    const handleWinner =({winnerData} : any)=>{
        console.log(winnerData)
        setWinner(winnerData)
    }

    

    const handleDraw = (words : string[] ) =>{
        setGuess(false)
        setWords(words)
        // console.log(words)
        setWait(true)
        selectTimeout.current = setTimeout(() => {
            sendWord(words[Math.floor(Math.random() * 3)]); // send ramdome word out of 3 
          }, 10000);
    }

    const handleGuess = (player : string)=>{
        setGuess(true);
        setDrawing(false);
        setPlayerDrawing(player);
        setWait(true);
    }

    const getTouchPos = (event: React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0];
        if (!touch) return { x: 0, y: 0 };
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const ctx = contextRef.current;
        if (!ctx) return;
        if ( guess ) return;
        setDrawing(true)
        console.log(drawing)
        let x, y;
        if (event.type === "mousedown") {
            // Mouse event
            const { offsetX, offsetY } = event.nativeEvent as MouseEvent;
            x = offsetX;
            y = offsetY;
        } else {
            // Touch event
            const { x: touchX, y: touchY } = getTouchPos(event as React.TouchEvent<HTMLCanvasElement>);
            x = touchX;
            y = touchY;
        }

        // const {offsetX, offsetY} = event.nativeEvent;
        socket.emit('startDrawing', { id, arg: { x, y } })
        // socket.emit('cords' , { x , y } )

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y);
        ctx.stroke();
        setIsDrawing(true);
        // event.preventDefault();
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) {
            return;
        }
        const ctx = contextRef.current;
        if (!ctx) return;

        if (!drawing) return;

        let x, y;
        if (event.type === "mousemove") {
            // Mouse event
            const { offsetX, offsetY } = event.nativeEvent as MouseEvent;
            x = offsetX;
            y = offsetY;
        } else {
            // Touch event
            const { x: touchX, y: touchY } = getTouchPos(event as React.TouchEvent<HTMLCanvasElement>);
            x = touchX;
            y = touchY;
        }

        // console.log(x , y)
        // socket.emit('cords' , { x , y } )
        if (guess || wait) return;
        socket.emit('drawline', { id, arg: { x, y } })
        ctx.lineTo(x, y);
        ctx.stroke();
        // event.preventDefault();
    };

    const stopDrawing = () => {
        const ctx = contextRef.current;
        if (!ctx) return;

        socket.emit('stopDrawing', { id })
        ctx.closePath();
        setIsDrawing(false);
    };

    const setToDraw = () => {
        setIsDrawingSelected(true)
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 5;
        socket.emit('drawing', { id })
    };

    const setToErase = () => {
        setIsDrawingSelected(false)
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 50;
        socket.emit('eraseing', { id })
    };

    const drawLine = (x: any, y: any) => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.lineTo(x, y);
        ctx.stroke();
    }

    const startDrawingline = (e: any) => {

        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.moveTo(e.x, e?.y);
        ctx.lineTo(e.x, e?.y);
        ctx.stroke();
    }

    const drawline2 = (e: any) => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.lineTo(e.x, e.y);
        ctx.stroke();
    }

    const stopDrawingline = () => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.closePath();
    }

    const sendWord = (word : string) =>{
        if(selectTimeout.current)
        clearTimeout(selectTimeout.current)
        socket.emit('word' , word )
        setWait(false)
    }
    const clearBoard = () => {
        const ctx = contextRef.current;
        if (!ctx) return;

        if(!canvasRef.current) return 

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      };

    const selectWord = () => {
        clearBoard();
        return (
          <div className="flex justify-center text-2xl gap-2 items-center absolute -z-1 w-[750px] h-[650px] rounded-md  flex-col bg-[#00000074]" id="choose-word">
            <p>Choose a word to draw!</p>
            <div className='flex gap-7  '>
              {words.map((word, index) => (
                <div
                  key={index}
                  className="selectWord bg-white border-[2px] border-black rounded-md p-1 text-xl"
                  onClick={() => sendWord(word)}
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        );
      };
    
      const waitWordSelect = () => {
        clearBoard();
        return (
          <div className="wait-box flex justify-center items-center absolute -z-1 w-[750px] h-[650px] rounded-md  flex-col bg-[#00000074]">
            <p id="wait-player">{playerDrawing} is choosing a word</p>
          </div>
        );
      };
    
    return (<>
        {winner ? 
           <WinnerPage winner={winner}/>
         :
            <div className='w-[750px] h-[650px]'>
            {wait && guess ? waitWordSelect() : ""}
            {wait && !guess ? selectWord() : ""}
            <canvas className="canvas-container bg-white rounded-md"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                >

            </canvas>
            <div className='flex gap-5'>
                <button
                    className={`bg-green-400 rounded-md px-3 py-1 m-2 ${isDrawingSelected ? 'border-[4px] border-yellow-300' : 'border border-black'}`}
                    onClick={setToDraw}>
                    Draw
                </button>
                <button
                    className={`bg-red-400 rounded-md px-3 py-1 m-2 ${!isDrawingSelected ? 'border-[4px] border-yellow-300' : 'border border-black'}`}
                    onClick={setToErase}>
                    Erase
                </button>
            </div>
        </div>}
    </>
    )
}

export default DrawingCanvas;