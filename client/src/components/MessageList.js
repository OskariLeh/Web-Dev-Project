import { ListItem, List } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';


// This returns a list used by Chat.js
const MessageList = (props) => {
    const items = props.items
    const receiver = props.receiver.id
    if (!items.sentMessages && !items.receivedMessages) {
        return
    }
    let messages = []
    if (!items.sentMessages) {
        
        messages = items.receivedMessages
    } else if (!items.receivedMessages) {
       
        messages = items.sentMessages
    } else {
        messages = items.sentMessages.concat(items.receivedMessages)
    }

    // sort the messages by time
    // https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property
    messages.sort(function(a,b) {
        let timeA = new Date(a.time)
        let timeB = new Date(b.time)
        return timeA.getTime() - timeB.getTime()
    })
    const listItems = messages.map((message) => {
        let date = new Date(message.time)
        // If the message is from current user it is disblayed on the right
        if (message.receiver === receiver) {
            return (
                <ListItem key={message._id} >
                    <ListItemText
                      primary={message.content}
                      // https://stackoverflow.com/questions/19263524/how-to-position-an-element-to-the-right-side
                      sx={{textAlign: "end"}}
                      // Formatting time https://stackoverflow.com/questions/221294/how-do-i-get-a-timestamp-in-javascript
                      secondary={date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear() + " " + date.getHours() + "." + date.getMinutes()}
                    />
                  </ListItem>
                ) 
        // If not from current user message on the left
        } else {
            return (
                <ListItem key={message._id} >
                    <ListItemText
                      primary={message.content}
                      secondary={date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " " + date.getHours() + "." + date.getMinutes()}
                    />
                  </ListItem>
                )
        }
        
})
    return (
    <List
    sx={{
        width: '100%',
        maxWidth: "35vh",
        position: 'relative',
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        maxHeight: 350,
        minWidth: 400, 
        '& ol': { padding: 0 },
      }}>
      
      <ol>{listItems}</ol>
    </List>
    )
}


export default MessageList