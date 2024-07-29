import { createBrowserRouter } from "react-router-dom"
import RootLayout from "./root"
import Home from "../views/Home/Home"


const router = createBrowserRouter([
    {
      path : "/",
      element : <RootLayout />,
      children : [
        {
          path : "/",
          element : <Home/>,
        }
      ]
    }
  ])

export default router