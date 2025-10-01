import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import React from 'react'
import { Button } from '@/components/ui/button'


function Authpage() {

    const [isLogin, setIsLogin] = React.useState(true);
  return (
     <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        {isLogin ? <LoginForm state={setIsLogin} /> : <RegisterForm state={setIsLogin} />}
        {/* <Button onClick={() => setIsLogin(!isLogin)} className="mt-4">
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </Button> */}
     </div>
  )
}

export default Authpage