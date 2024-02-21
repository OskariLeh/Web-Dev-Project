import React, {Suspense} from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link as RouterLink, MemoryRouter } from 'react-router-dom';

function Header() {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
        
            
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default function App() {
  return (
    <Suspense fallback="loading">
      <Header/>
    </Suspense>
  )
}