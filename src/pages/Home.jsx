import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import LockIcon from '@mui/icons-material/Lock';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      title: 'Custom Profile',
      description: 'Create your unique profile and showcase your content'
    },
    {
      icon: <MessageIcon sx={{ fontSize: 40 }} />,
      title: 'Instant Messaging',
      description: 'Connect with your audience through real-time messaging'
    },
    {
      icon: <LiveTvIcon sx={{ fontSize: 40 }} />,
      title: 'Live Streaming',
      description: 'Go live and interact with your followers in real-time'
    },
    {
      icon: <LockIcon sx={{ fontSize: 40 }} />,
      title: 'Exclusive Content',
      description: 'Share premium content with your dedicated supporters'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ 
          pt: 15,
          pb: 8,
          textAlign: 'center',
          color: 'white'
        }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            BossMasterCarlos
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 6,
              opacity: 0.9
            }}
          >
            Your Ultimate Platform for Content Creation and Community Building
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)'
                },
                px: 4,
                py: 1.5
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.9)',
                  bgcolor: 'rgba(255,255,255,0.1)'
                },
                px: 4,
                py: 1.5
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ py: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <IconButton
                    color="primary"
                    sx={{
                      mb: 2,
                      '&:hover': { bgcolor: 'transparent' },
                      cursor: 'default'
                    }}
                    disableRipple
                  >
                    {feature.icon}
                  </IconButton>
                  <Typography gutterBottom variant="h6" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;