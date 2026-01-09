import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";

function App() {
  const { isSignedIn , isLoaded} = useUser();

  if(!isLoaded) return null;

  return (
    <>
      <Routes>
        {/* <h1 className=' text-red-500 bg-orange-400'>welcome to the app</h1> */}

        <Route path="/" element={ isSignedIn ?<HomePage /> : <Navigate to={"/dashboard"}/>} />

        <Route path="/dashboard" element={ isSignedIn ?<DashboardPage /> : <Navigate to={"/"}/>} />

        <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/problem/:id"
          element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />}
        />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
