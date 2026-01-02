import './App.css'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

function App() {
  

  return (
    <>
      <h1>welcome to the app</h1>
       
       <SignedOut>
        <SignInButton mode="modal"/>
       </SignedOut>


       <SignedIn>
        <SignOutButton model="modal"/>
       </SignedIn>


       <UserButton/>
      
    </>
  )
}

export default App
