export default function Space({ children }) {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      {children}
    </div>
  )
}