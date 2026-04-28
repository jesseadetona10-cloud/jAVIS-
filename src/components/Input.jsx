export default function Input({ onSend }) {
  const handleKey = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      onSend(e.target.value.trim())
      e.target.value = ''
    }
  }

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-96">
      <input
        type="text"
        onKeyDown={handleKey}
        placeholder='say "jarvis" or type a command'
        className="w-full bg-transparent border-b border-white/10 text-white/40 text-xs tracking-widest text-center outline-none py-2 placeholder-white/15 focus:border-white/20 focus:text-white/60 transition-all"
      />
    </div>
  )
}