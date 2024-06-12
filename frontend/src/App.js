import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import Login from "./Login/Login";
import RequireAuth from "./Util/RequireAuth";
import Register from "./Register/Register";
import Dashpage from "./Dashboard/Dashpage/Dashpage";
import Dashboard from "./Dashboard/Dashboard";
import Configuration from "./Dashboard/Configuration/Configuration";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route element={<RequireAuth />}>
                    <Route path='/dashboard' element={<Dashboard />}>
                        <Route path='' element={<Dashpage />}></Route>
                        <Route path='config' element={<Configuration />}></Route>
                    </Route>
                </Route>            
            </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;
