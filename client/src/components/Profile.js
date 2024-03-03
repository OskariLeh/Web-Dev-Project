import React, { useEffect, useState } from 'react'
import { Button, Container, TextField } from '@mui/material'

    // Page for the user to view and edit their profile
function Profile() {
    const [userData, setUserData] = useState({})

    const authToken = localStorage.getItem("auth_token")
    if (!authToken){
        window.location.href = "/login"
    }

    // Gets your own profile information to display on this page
    useEffect(() =>
    async function getUserData() {
        const authToken = localStorage.getItem("auth_token")
    
        await fetch("/users/get/profile", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + authToken
            },
            body: JSON.stringify({token: authToken})
          })
          .then(response => response.json())
          .then(data => {
            if (data.fail === true) {
              localStorage.removeItem("auth_token")
            } else {
              setUserData(data.profile)
            }
            
          })
        
    }, []) 
    
    // Saves edited data to database
    const handleSave = async (e) => {
        await fetch("/users/update/profile", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + authToken
            },
            body: JSON.stringify({token: authToken, bio: userData.bio})
          })
          .then(response => response.json())
          .then(data => {
            if (data.fail === true) {
              localStorage.removeItem("auth_token")
            }
          })
    }

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
      }

  return (
    <Container maxWidth="sm" sx={{position: 'absolute', left: 5, marginTop: "20px"}}>
        <h1>{userData.username}</h1>

        <TextField
          id="bio-text-field"
          label="Bio"
          name='bio'
          multiline
          fullWidth
          focused
          minRows={3}
          maxRows={10}
          defaultValue={userData.bio}
          onChange={handleChange}
        />

        <Button variant='contained' onClick={handleSave} sx={{marginTop: "10px"}}>Save</Button>
      </Container>
  )
}



export default Profile