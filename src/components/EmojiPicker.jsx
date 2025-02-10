import { useState } from 'react';
import { Box, IconButton, Popover, Typography } from '@mui/material';
import AddReactionIcon from '@mui/icons-material/AddReaction';

const EMOJI_LIST = [
  { emoji: '❤️', name: 'heart' },
  { emoji: '👍', name: 'thumbs_up' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '😂', name: 'joy' },
  { emoji: '🎉', name: 'party' },
  { emoji: '👏', name: 'clap' },
  { emoji: '🚀', name: 'rocket' },
  { emoji: '💯', name: 'hundred' }
];

function EmojiPicker({ onEmojiSelect }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <AddReactionIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', maxWidth: 200 }}>
          {EMOJI_LIST.map((emoji) => (
            <IconButton
              key={emoji.name}
              onClick={() => handleEmojiSelect(emoji)}
              size="small"
              sx={{ p: 1 }}
            >
              <Typography variant="body1" component="span">
                {emoji.emoji}
              </Typography>
            </IconButton>
          ))}
        </Box>
      </Popover>
    </>
  );
}

export default EmojiPicker;