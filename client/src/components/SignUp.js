import React, { useState } from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { Button, TextField } from '@mui/material'

function SignUp() {
  let [userData, setUserData] = useState({})

  // On button press try to register with given information
  const signUpButton = async () => {
    await fetch("/users/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href="/login"
      }
    })
  }       
      
  const handleChange = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#cfe8fc', height: '50vh', marginTop: "50px", minHeight: 400}}>
            <h2>Email</h2>
            <TextField id="email-input" label="example@example.com" variant="filled" name='email' onChange={handleChange}/>
            <h2>Username</h2>
            <TextField id="username-input" label="Username" variant="filled" name='username' onChange={handleChange}/>
            <h2>Password</h2>
            <TextField id="password-input" label="Password" variant="filled" name='password' type='password' onChange={handleChange}/>   
            <div>
                <Button variant="outlined" sx={{ marginTop: "30px" }} onClick={() => signUpButton()}>Sign Up </Button> 
            </div>
        </Box> 
      </Container>
    </>
  )
}

export default SignUp