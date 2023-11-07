import SigninForm from "./_auth/forms/SigninForm";
import { Home } from "./_root/pages";
import {Routes,Route} from "react-router-dom";
import "./globals.css";
import SignupForm from "./_auth/forms/SignupForm";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
          {/* public Routes*/}
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
          {/* private Routes*/}
          <Route index element={<Home />} />
      </Routes>
    </main>
  )
}

export default App