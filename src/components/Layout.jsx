import { Outlet } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

function Layout({ darkMode, setDarkMode }) {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <Outlet />
    </Box>
  );
}

export default Layout;