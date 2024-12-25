
import { useLocation } from "react-router-dom"
import Chat from "./Chat"
import DrawingCanvas from "./DrawingCanvas"
import Header from "./Header"
import Players from "./Players"
const Body = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  if(!name) return
  return (
    <>
    <div className="flex bg-blue-500 justify-center items-center w-screen  h-screen   py-1 px-3 gap-1">

      <div className="flex-col flex gap-1 ">
        <Header/>
        <div className="  flex justify-center items-start gap-1">
            <Players currentUsername={name}/>
            <DrawingCanvas/>
            <Chat/>
        </div>
      </div>
    </div>
    </>
  )
}


// <div className="grid grid-cols-5 grid-rows-5 gap-4">
//     <div className="col-span-5">1</div>
//     <div className="row-span-3 row-start-2">2</div>
//     <div className="col-span-3 row-span-4 row-start-2">3</div>
//     <div className="row-span-4 col-start-5 row-start-2">4</div>
// </div>
    

export default Body
