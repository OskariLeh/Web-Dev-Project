import React, { useState, useEffect } from 'react'
import { Container, Box, TextField, Button } from '@mui/material'
import MyList from "./MyList"

// Lists your matches and allows you to send and read messages
function Chats() {
  const [chatData, setChatData] = useState()
  const [openUser, setOpenUser] = useState({username: "Username"})
  const [items, setItems] = useState([])
  const authToken = localStorage.getItem("auth_token")
    if (!authToken){
        window.location.href = "/login"
    } 

  //get matches from server
  useEffect(() =>
    async function getMatches() {
        const authToken = localStorage.getItem("auth_token")
        
        await fetch("/users/get/matches", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              "Authorization": "Bearer " + authToken
            },
            body: JSON.stringify({token: authToken})
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            setItems(data.matches)
          })
        
    }, []) 

    const matchClicked = (user) => {
      setOpenUser(user)
    }

    const handleChange = (e) => {
      setChatData({...chatData, [e.target.name]: e.target.value})
    }

  return (
    <Container maxWidth="md" sx={{display: "flex", justifyContent: "right"}}>
        <Box sx={{ bgcolor: '#1a9aba', height: '50vh', width: "25vh", marginTop: "50px", borderRadius: "25px", marginRight: "15px"}}>
            <MyList 
            items={items}
            matchClicked={matchClicked}
            />
        </Box> 
        <Box sx={{ bgcolor: '#cfe8fc', height: '50vh', width: "35vh", marginTop: "50px", borderRadius: "25px"}}>
            <h1>{openUser.username}</h1>
            <div>
              <TextField id="chat-input" label="Chat" variant="filled" name='chat' onChange={handleChange} sx={{position: "relative", marginTop: "500px"}}/>
              <Button variant="outlined" sx={{ marginTop: "510px", marginLeft: "10px" }}>Send </Button> 
            </div>
            
        </Box> 

      </Container>
  )
}

export default Chats