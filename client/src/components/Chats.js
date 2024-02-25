import React, { useState, useEffect } from 'react'
import { Container, Box } from '@mui/material'
import MyList from "./MyList"

// Lists your matches and allows you to send and read messages
function Chats() {
  const [items, setItems] = useState([])
  const authToken = localStorage.getItem("auth_token")
    if (!authToken){
        window.location.href = "/login"
    } 

  //get matches
  useEffect(() =>
    async function getMatches() {
        const authToken = localStorage.getItem("auth_token")
        
        await fetch("/users/get/matches", {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({token: authToken})
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            setItems(data.matches)
          })
        
    }, []) 

  return (
    <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#1a9aba', height: '50vh', marginTop: "50px", borderRadius: "25px"}}>
            <MyList items={items}/>
        </Box> 

      </Container>
  )
}

export default Chats