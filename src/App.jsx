import useRouterElement from "./routes/useRouterElement"

function App() {
//  nơi chứa các route
  const routerElement = useRouterElement()
  return (
   <>
   {routerElement}
   </>
  )
}

export default App
