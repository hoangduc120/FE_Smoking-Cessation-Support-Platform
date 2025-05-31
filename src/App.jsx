import useRouterElement from "./routes/useRouterElement"
import { useGoogleCallback } from "./hooks/useGoogleCallback"

function App() {
  //  nơi chứa các route
  const routerElement = useRouterElement()

  // Xử lý Google login callback
  useGoogleCallback()

  return (
    <>
      {routerElement}
    </>
  )
}

export default App
