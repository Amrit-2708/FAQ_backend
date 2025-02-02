import './App.css'
import Adminpage from './components/Adminpage'
import Homepage from './components/Homepage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Submittedfaq from './components/Submittedfaq'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage />}></Route>
      <Route path='/submitted' element={<Submittedfaq />}></Route>
      <Route path='/admin' element={<Adminpage />}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
