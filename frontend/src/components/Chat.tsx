import { useEffect, useRef, useState } from "react"
import socket from "./socket"
import { useLocation, useParams } from "react-router-dom";
const Chat = () => {
  interface Message {
    name: string;
    text: string;
}
  const inputref= useRef<HTMLInputElement | null >(null)
  const [messages, setMessages] = useState<Message[]>([])
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");

  useEffect(()=>{
    socket.on('chat-message' , ({name , text})=>{

      setMessages( p => [...p , {name , text}])
    })
  } , [])
  const { id } = useParams()
  const [text, settext] = useState<string>('')
  const handelSend = ()=>{
    if(!text)  return
    socket.emit('chat-message' , {text , name , id })
    setMessages(p => [...p , {name: queryParams.get("name") || "Unknown User" , text}])
    settext('')
    
    if(inputref.current)
    inputref.current.focus();
  }
  return (
    <div className="flex flex-col gap-1 ">

      <div className="w-[14rem] bg-white rounded-md h-96 overflow-scroll" >
        {messages.map((data, i) => {
          return <div className={`m-1 ${i % 2 === 0 ? "bg-gray-100" : "bg-slate-200"} `} key={i} >
            <span className=" font-bold">{data.name}:</span><span>{data.text}</span>
          </div>
        })}
      </div>
      <div>

        <input
          className=" rounded-md p-1"
          type="text"
          name="chat"
          placeholder="TYPE YOUR GUSS HERE "
          value={text}
          onChange={e => settext(e.target.value)} // check if error
          ref={inputref}
          />

        <button 
        className="bg-slate-300 p-1 ml-1 rounded-md"
        onClick={handelSend}
        >send</button>
      </div>

    </div>
  )
}

export default Chat
