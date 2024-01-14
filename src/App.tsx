import './globals.css';
import { Route, Routes } from 'react-router-dom';
import SignInForm from './_auth/forms/SignInForm';
import { Home } from './_route/pages';
import AuthLayout from './_auth/AuthLayout';
import SignUpForm from './_auth/forms/SignUpForm';
import RouteLayout from './_route/RouteLayout';
import { Toaster } from "@/components/ui/toaster"


const App = () => {
  return (
    <main className='flex h-screen'>

      <Routes>
        {/* Public Routes */}
        <Route element = {<AuthLayout />}>
          <Route path="sign-in" element={<SignInForm />} />
          <Route path="sign-up" element={<SignUpForm />} />
        </Route>


        {/* Private Routes */}
        <Route element= {<RouteLayout />}>
          <Route index element={<Home />} />
        </Route>
        
      </Routes>
      <Toaster />
    </main>
  )
}

export default App