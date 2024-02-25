import React from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';

function ProfileCard() {
    // Shows you profiles to like or not
    
    const authToken = localStorage.getItem("auth_token")
    if (!authToken){
        window.location.href = "/login"
    } 

  return (
    <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#1a9aba', height: '50vh', marginTop: "50px", borderRadius: "25px"}}>
            <h1>Profile Name</h1>
            <hr></hr>
            <p>Profile information</p>
        </Box> 
        <IconButton sx={{ color: "red", marginRight: "50px"}}>
            <FavoriteIcon sx={{fontSize: "100px"}}/>
        </IconButton>
        <IconButton sx={{ color: "black"}}>
            <CloseIcon sx={{fontSize: "100px"}}/>
        </IconButton>

      </Container>
  )
}

export default ProfileCard