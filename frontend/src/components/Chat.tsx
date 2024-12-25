import React, { useEffect, useRef, useState } from "react"
import socket from "./socket"
import { useLocation } from "react-router-dom";
import '../App.css'
interface Message {
  user: string;
  text: string;
}
const Chat = () => {
  

  // const inputref = useRef<HTMLInputElement | null>(null)
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [value, setValue] = useState('')
  useEffect(() => {
    socket.on('chat', (message : Message) => {
      setChatMessages( (p) =>  [...p , message])
      scrollToBottom()
    })
  }, [])


  function messageFormat(msg : any, i : number) {
    if (msg.connected)
      return <p key={i}><span className="user-connected">{msg.user} joined the game!</span></p>;
    else if (msg.disconnected)
      return <p key={i}><span className="user-disconnected">{msg.user} left the game.</span></p>;
    else if (msg.found)
      return <p key={i}><span className="user-win">{msg.user} found the word!</span></p>;
    else if (msg.close)
      return <p key={i}><span className="user-close">'{msg.text}' is close!</span></p>;
    else if (msg.end)
      return <p key={i}><span className="end-round">The word was '{msg.text}'</span></p>;
    return <p key={i}><span className="user">{msg.user}:</span> {msg.text}</p>;
  }
  const messages = chatMessages.map((msg, i) => messageFormat(msg, i));
  const scrollToBottom = () => {  
    if(messagesEndRef.current)
    messagesEndRef.current.scrollIntoView();
  }

  const handleSumit =(e : React.ChangeEvent<HTMLFormElement>)=>{
    socket.emit('chat',{user: name, text: value});
    setValue('')
    e.preventDefault()
  }
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>)=>{
    setValue(e.target.value)
  } 
  return (
    <div className="flex flex-col gap-1 ">

      <div className="w-[14rem] bg-white rounded-md h-96 overflow-scroll p-1" >
        <div id={"message-box"}>
          {messages}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div>
        <form onSubmit={handleSumit}>
        <input  className="form-control rounded-md p-1 w-full" id="inputChat" autoComplete="off"
              placeholder="Type your guess here..." maxLength={100} type="text" value={value}
              onChange={handleChange}/>
        </form>
      </div>

    </div>
  )
}

export default Chat
