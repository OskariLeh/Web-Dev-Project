import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Header from './components/Header';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<><Header /> </>}/>
          <Route path='login' element= {<><Header /> <Login/></>}/>
          <Route path='signUp' element= {<><Header /> <SignUp/></>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
