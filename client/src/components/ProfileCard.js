import React, { useEffect, useState } from 'react'
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import { IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';

// Shows you profiles user has not yet liked or disliked
function ProfileCard() {
    const [profilesToLike, setProfilesTolike] = useState([])
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const authToken = localStorage.getItem("auth_token")
    if (!authToken){
        window.location.href = "/login"
    }
    
    
    // Saves where swipe starts
    // Used https://stackoverflow.com/questions/40463173/swipe-effect-in-react-js
    // for help with swipes
    function handleTouchStart(e) {
      setTouchStart(e.targetTouches[0].clientX);
    }

    // Saves where swipe ends
    function handleTouchMove(e) {
      setTouchEnd(e.targetTouches[0].clientX);
      }

    //Checks if swipe was left or right  
    function handleTouchEnd() {
      if (touchStart - touchEnd > 400) {
        //Swipe left => dislike
        setTouchEnd(0)
        setTouchStart(0)
        handleLike(false)
      }

      if (touchStart - touchEnd < -400) {
        //Swipe right => like
        setTouchEnd(0)
        setTouchStart(0)
        handleLike(true)
      }
    }
    

    // Gets a list of profiles that user has not yet liked
    // https://stackoverflow.com/questions/58101018/react-calling-a-method-on-load-only-once
    useEffect(() =>
    async function getProfilesToLike() {
        const authToken = localStorage.getItem("auth_token")
        
        await fetch("/users/get/profiles", {
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
              setProfilesTolike(data.profiles)
            }
            
          })
        
    }, []) 

    // Handles the like/dislike button functionality
    const handleLike = async (liked) => {
        if (profilesToLike.length === 0 || profilesToLike === undefined){
            return 
        }

        await fetch("/users/like", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + authToken
            },
            body: JSON.stringify({token: authToken, id: profilesToLike[0].id, like: liked})
          })
          .then(response => response.json())
          .then(data => {
            if (data.fail === true) {
              localStorage.removeItem("auth_token")
            }
            if (data.fail === false){
                let profiles = profilesToLike
                profiles.shift()
                setProfilesTolike(profiles)

                // This is a bad solution to get this page to work but could not figure out a better way
                // Further development this should be improved
                window.location.reload()
            }
          })
    }

    const parseProfileInfo = () =>{
        if (profilesToLike.length === 0 || profilesToLike === undefined){
            return {username: "No profiles to view", bio: "Please come back later"}
        } else {
            return profilesToLike[0]
        }
    }

  return (
    <Container maxWidth="sm">
        <Box 
        sx={{ bgcolor: '#1a9aba', height: '50vh', marginTop: "50px", borderRadius: "25px", minHeight: 400}}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        >
            <h1>{parseProfileInfo().username}</h1>
            <hr></hr>
            <p>{parseProfileInfo().bio}</p>
        </Box> 
        <IconButton 
        sx={{ color: "red", marginRight: "50px"}} 
        name="like" 
        onClick={() => handleLike(true)}
        >
            <FavoriteIcon sx={{fontSize: "100px"}}/>
        </IconButton>
        <IconButton 
        sx={{ color: "black"}} 
        name="dislike" 
        onClick={() => handleLike(false)} 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        >
            <CloseIcon sx={{fontSize: "100px"}}/>
        </IconButton>

      </Container>
  )
}

export default ProfileCard