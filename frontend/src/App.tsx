import { useState } from 'react'
import ChatShell from './components/ChatShell'

function App() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Unthinkable Support
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <ChatShell />
      </main>
    </div>
  )
}

export default App
