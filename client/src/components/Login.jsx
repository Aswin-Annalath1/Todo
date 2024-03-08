import React from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

  const navigate = useNavigate()
//Handling Login
  const handlelogin = async()=>{
  fetch('https://todo-wu1c.onrender.com/users/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      email:document.getElementById('email').value,
      password:document.getElementById('password').value
    })
  }).then(res=>res.json())
  .then(data=>{(data)
//when we enter correct login detail then only data._id exists..
    if(data._id!=undefined){
      navigate("/todolistmain/"+data._id)
    }else{
      alert('Incorrect email or password. Please try again.');
    }
  })
  navigate("/login")
}
  return (
  <div id="app" className="min-w-[400px] w-1/2 mx-auto mt-16">
  <div className="max-w-4xl bg-violet-500 p-4 rounded-lg shadow-lg ">
    <div className="w-full max-w-xs mx-auto mt-8">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email"/>
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" for="password">
        Password
      </label>
      <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
      <p className="text-red-500 text-xs italic">Please choose a password.</p>
    </div>
    <div className="flex items-center justify-between">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handlelogin}>
        Login 
      </button>
    </div>
    <p className='text-xs mt-4'>Don't have an Account? <a href='/'>Go to Register Page</a></p>
  </form>
  <p className="text-center text-gray-500 text-xs">
    &copy;2024 Aswin. All rights reserved.
  </p>
</div>
</div>
</div>
  )
}

export default Login