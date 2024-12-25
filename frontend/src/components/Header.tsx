import  { useState, useEffect } from 'react';
import socket from './socket';
import { useParams } from 'react-router-dom';

const Header = () => {
  const [clock, setClock] = useState<number>(0)
  const [word, setWord] = useState<string>('')
  const [isGuess, setIsGuess] = useState(false)
  const {id} = useParams()
  useEffect(()=>{
    socket.on('word' , (word : string )=>{
      setWord(word)
    })
    socket.on('clock' , (clock : number)=>{
      setClock(clock)
    })
    socket.on('draw' , handleDraw )
    socket.on("guess", handleGuess);
  } , [])

  const handleDraw = ()=>{
    setIsGuess(false)
  }
  const handleGuess =()=>{
    setIsGuess(true)
  }
  return (
    <div className="bg-white rounded-md  h-[50px] justify-between px-5 text-center items-center flex max-w-[2000px] "> 
          <div>Room:{id}</div>
          <div>{clock / 1000 }</div>
          <div className=''> {isGuess ? <p className='text-ms'>guess this</p> : <p className='text-ms'>The word is </p>  }  <div className='tracking-widest'>{word} <span className='text-[10px]'>{word.length}</span></div></div>
    </div>
  )
}

export default Header




// const Info: React.FC<InfoProps> = ({  current }) => {
//   const [word, setWord] = useState('');
//   const [clock, setClock] = useState(0);

//   useEffect(() => {
//     const handleWord = (data: string) => setWord(data);
//     const handleClock = (data: number) => setClock(data);

//     socket.on('word', handleWord);
//     socket.on('clock', handleClock);

//     return () => {
//       socket.off('word', handleWord);
//       socket.off('clock', handleClock);
//     };
//   }, [socket]);

//   const handleDisconnect = () => {
//     socket.disconnect();
//     onDisconnect();
//   };

//   return (
//     <div id="containerInfo">
//       <div id="room-info">
//         <div>
//           <i className="fas fa-gamepad" /> {current.room}
//         </div>
//         <div>
//           <i className="fas fa-clock" /> {(clock / 1000).toFixed(1)}
//         </div>
//         <div id="word">
//           <i className="fas fa-search" /> {word}
//         </div>
//         <div id="quit">
//           <i className="fas fa-times" onClick={handleDisconnect} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Info;