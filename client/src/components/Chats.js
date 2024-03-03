import React, { useState, useEffect } from 'react'
import { Container, Box, TextField, Button } from '@mui/material'
import MatchList from "./MatchList"
import MessageList from "./MessageList"

// Lists your matches and allows you to send and read messages
function Chats() {
  const [chatData, setChatData] = useState()
  const [messageData, setMessageData] = useState({sentMessages: [], receivedMessages: []})
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
            if (data.fail === true) {
              localStorage.removeItem("auth_token")
            } else {
              setItems(data.matches)
            }
            
          })
        
    }, []) 

    const matchClicked = (user) => {
      setOpenUser(user)
    }

    // When match is selected fetch messages
    useEffect(() => {
    const authToken = localStorage.getItem("auth_token")

      fetch("/users/list/messages", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + authToken
        },
        body: JSON.stringify({token: authToken, receiver: openUser})
      })
      .then(response => response.json())
      .then(data => {
        if (data.fail === true) {
          localStorage.removeItem("auth_token")
        } else {
          setMessageData(data)
        }
      })
    }, [openUser]) 
        
    const handleChange = (e) => {
      setChatData(e.target.value)
    }

    // Sends message to server and saves it to database
    const sendMessage = () => {
      const authToken = localStorage.getItem("auth_token")
        
      fetch("/users/send/message", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + authToken
          },
          body: JSON.stringify({token: authToken, receiver: openUser, content: chatData})
        })
        .then(response => response.json())
        .then(data => {
          if (data.fail === true) {
            localStorage.removeItem("auth_token")
          } else {
            // Update messages after new message sent
            fetch("/users/list/messages", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + authToken
              },
              body: JSON.stringify({token: authToken, receiver: openUser})
            })
            .then(response => response.json())
            .then(data => {
              if (data.fail === true) {
                localStorage.removeItem("auth_token")
              } else {
                setMessageData(data)
              }
            })
          }
        })
    }

  return (
    <Container maxWidth="md" sx={{display: "flex", justifyContent: "right"}}>
        <Box sx={{ bgcolor: '#1a9aba', height: '50vh', width: "25vh", marginTop: "50px", borderRadius: "25px", marginRight: "15px", minWidth: 250, minHeight: 500}}>
            <MatchList 
            items={items}
            matchClicked={matchClicked}
            />
        </Box> 
        <Box sx={{ position:"relative", bgcolor: '#cfe8fc', height: '50vh', width: "35vh", marginTop: "50px", borderRadius: "25px", minWidth: 400, minHeight: 500}}>
            <h1>{openUser.username}</h1>
            <MessageList
            items={messageData}
            receiver={openUser}
            />

            <TextField id="chat-input" label="Chat" variant="filled" name='chat' onChange={handleChange} sx={{position: "absolute", bottom: 2, left: 70}}/>
            <Button variant="outlined" onClick={sendMessage} sx={{position: "absolute", bottom: 10, left: 290 }}>Send </Button> 
            
            
        </Box> 

      </Container>
  )
}

export default Chats