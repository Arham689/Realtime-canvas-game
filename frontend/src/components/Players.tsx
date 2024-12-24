import { useEffect, useState } from "react"
import socket from "./socket"
import { useParams } from "react-router-dom"
const Players = () => {
  const [activePlayers, setActivePlayers] = useState([])
  const {id} = useParams()
  useEffect(()=>{
    socket.on('user-joined', ({activePlayers}) => {
      // setActivePlayeres(...activePlayeres)
      console.log(activePlayers)
      setActivePlayers(activePlayers)
  })
  } , [])
  return (
    <div className="bg-white w-[11rem]  rounded-md">
      Players
      {activePlayers.map((p : {name : string , roomId : string} , i )=>{
        return <div key={i}> {id === p.roomId && p.name} </div>
      })}
    </div>
  )
}

export default Players
