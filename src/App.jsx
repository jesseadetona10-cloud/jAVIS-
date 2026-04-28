import { useState } from 'react'
import Space from './components/Space'
import Stars from './components/Stars'
import Orb from './components/Orb'
import Input from './components/Input'

export default function App() {
  const [state, setState] = useState('idle')

  const handleSend = (text) => {
    console.log('command:', text)
    setState('thinking')
    setTimeout(() => setState('speaking'), 2000)
    setTimeout(() => setState('idle'), 5000)
  }

  return (
    <Space>
      <Stars />
      <div className="relative z-10">
        <Orb state={state} />
      </div>
      <Input onSend={handleSend} />
    </Space>
  )
}