const MyList = (props) => {
    const items = props.items
    const listItems = items.map((item) => {
        return <li key={item.id} >{item.username}</li>
})
    return (
        <div>
            <h1>Matches</h1>
            <ol>{listItems}</ol>
        </div>
    )
}


export default MyList