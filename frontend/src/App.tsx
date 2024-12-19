import Body from './components/Body.js'
// import { io } from 'socket.io-client'
import { Route , BrowserRouter , Routes } from 'react-router-dom'
import Home from './components/Home.js'
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path={`/room/:id`} element={<Body/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App