import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import UserStore from './mobx/userStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Context.Provider value={{
            user:new UserStore()
        }}>
            <App/>
        </Context.Provider>
);

export default root;