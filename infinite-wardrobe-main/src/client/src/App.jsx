import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as Screens from "./screens"
import * as Components from "./components"
import Cookies from 'universal-cookie';


const cookies = new Cookies();
const authToken = cookies.get('authorization');

const App = () => {
  if (!authToken) return <Components.Auth/>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Screens.Home />}/>
        <Route path='/upload' element={<Screens.Upload />}/>
      </Routes>
      <Components.Bottombar/>
    </BrowserRouter>
  );
}

export default App;
