
import Chat from "./Chat"
import DrawingCanvas from "./DrawingCanvas"
import Header from "./Header"
import Players from "./Players"
const Body = () => {
  return (
    <>
      <div className="flex bg-blue-500 justify-center items-center w-screen  h-screen flex-col  py-1 px-3 gap-1">
        <Header/>
        <div className="  flex justify-center items-start gap-1">
            <Players/>
            <DrawingCanvas/>
            <Chat/>
        </div>
      </div>
    </>
  )
}

export default Body
