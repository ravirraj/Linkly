import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Authpage from './pages/Authpage.jsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routing/routerTress.js'
import { Provider } from 'react-redux'
import store from "./store/store.js"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient()


 const router = createRouter({routeTree,context: {
    store,
    queryClient,
 }})
function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">404 | Page Not Found</h1>
    </div>
  );
}



createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}
          defaultNotFoundComponent={NotFound}
          />
        </QueryClientProvider>
    </Provider>
)
