import './App.css'
import Login from './Login'
import { BrowserRouter,Routes, Route } from 'react-router-dom'
import Signup from './Signup'
import Home from './Home'
import Profile from './Profile'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}></Route>
            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
        </Routes>
    </BrowserRouter>

  )
}

export default App;
