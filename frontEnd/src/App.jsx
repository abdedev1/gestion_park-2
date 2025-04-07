import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button class="btn btn-soft">Default</button>
      <button class="btn btn-soft btn-primary">Primary</button>
      <button class="btn btn-soft btn-secondary">Secondary</button>
      <button class="btn btn-soft btn-accent">Accent</button>
      <button class="btn btn-soft btn-info">Info</button>
      <button class="btn btn-soft btn-success">Success</button>
      <button class="btn btn-soft btn-warning">Warning</button>
      <button class="btn btn-soft btn-error">Error</button>
    </>
  )
}

export default App
