import React from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { Button, TextField } from '@mui/material'

function signUp() {

  // On button press try to register with given information
  const signUpButton = async () => {
    let result
    await fetch("/users/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: document.getElementById("email-input").value,
        username: document.getElementById("username-input").value,
        password: document.getElementById("password-input").value
      })
    })
    .then(response => response.json())
    .then(data => {
      result = data
      console.log(result)
    })
  }       
      
  

  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#cfe8fc', height: '50vh', marginTop: "50px" }}>
            <h2>Email</h2>
            <TextField id="email-input" label="example@example.com" variant="filled" />
            <h2>Username</h2>
            <TextField id="username-input" label="Username" variant="filled" />
            <h2>Password</h2>
            <TextField id="password-input" label="Password" variant="filled" type='password'/>   
            <div>
                <Button variant="outlined" sx={{ marginTop: "30px" }} onClick={() => signUpButton()}>Sign Up </Button> 
            </div>
        </Box> 
      </Container>
    </>
  )
}

export default signUp