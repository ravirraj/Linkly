import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Authpage from './pages/Authpage.jsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routing/routerTress.js'
import { Provider } from 'react-redux'
import store from "./store/store.js"


 const router = createRouter({routeTree})




createRoot(document.getElementById('root')).render(
    <Provider store={store}>
          <RouterProvider router={router} />
    </Provider>
)
