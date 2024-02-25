import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Header from './components/Header';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css';
import ProfileCard from "./components/ProfileCard";
import Chats from "./components/Chats";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<><Header /> <ProfileCard/> </>}/>
          <Route path='login' element= {<><Header /> <Login/></>}/>
          <Route path='signUp' element= {<><Header /> <SignUp/></>}/>
          <Route path='chats' element= {<><Header /> <Chats /> </>}/>
          <Route path='profile' element= {<><Header /> <Profile /> </>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
