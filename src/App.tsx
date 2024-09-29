import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RegisterForms from './components/RegisterForm/RegisterForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RegisterForms/>
    </>
  )
}

export default App
