import { useState } from "react"
import {  useNavigate } from "react-router-dom"

const Home = () => {
    const [name, setName] = useState('')
    const [roomId, setRoomId] = useState('')
    const router = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && roomId) {
          router(`/room/${roomId}?name=${encodeURIComponent(name)}`)
        }
      }

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-gray-900">
  <form
    onSubmit={handleSubmit}
    className="space-y-6 rounded-lg p-6 bg-gray-800 shadow-[5px_5px_rgba(0,_112,_184,_0.4),_10px_10px_rgba(0,_112,_184,_0.3),_15px_15px_rgba(0,_112,_184,_0.2),_20px_20px_rgba(0,_112,_184,_0.1),_25px_25px_rgba(0,_112,_184,_0.05)] w-full max-w-md"
  >
    <div>
      <label
        htmlFor="name"
        className="block text-sm font-medium text-gray-300"
      >
        Your Name
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="mt-2 block w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <div>
      <label
        htmlFor="roomId"
        className="block text-sm font-medium text-gray-300"
      >
        Room ID
      </label>
      <input
        type="text"
        id="roomId"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        required
        className="mt-2 block w-full px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>

    <button
      type="submit"
      className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
    >
      Join Room
    </button>
  </form>
</div>
    )
}

export default Home
