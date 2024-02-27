import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';


// This returns a list used by Chat.js
const MyList = (props) => {
    const items = props.items
    const listItems = items.map((item) => {
        return (
            <ListItemButton key={item.id} component="a" href="#simple-list" onClick={() => props.matchClicked(item)}>
                <ListItemText primary={item.username} />
            </ListItemButton>
        )
})
    return (
        <div>
            <h1>Matches</h1>
            <ol>{listItems}</ol>
        </div>
    )
}


export default MyList