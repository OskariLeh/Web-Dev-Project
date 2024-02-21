import React from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { Button, TextField } from '@mui/material'

function Login() {
  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#cfe8fc', height: '50vh', marginTop: "50px" }}>
            <h2>Email</h2>
            <TextField id="email-input" label="example@example.com" variant="filled" />
            <h2>Password</h2>
            <TextField id="password-input" label="Password" variant="filled" type='password'/>   
            <div>
                <Button variant="outlined" sx={{ marginTop: "30px" }}>Login </Button> 
            </div>

            <div>
                <p>Dont have an account?</p>
                <a href='/signUp'>Sign up</a>
            </div>
        </Box> 
      </Container>
    </>
  )
}

export default Login