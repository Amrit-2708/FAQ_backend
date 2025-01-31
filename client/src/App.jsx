import './App.css'
import Homepage from './components/Homepage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage />}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
