import { Box, Button, TextField, Modal, Typography, LinearProgress } from "@mui/material";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import { memo, useCallback, useState } from "react";

const style = {
  position: 'absolute',
  display: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function SubscribeModal({
  open = false,
  onClose,
  onSubscribe,
}: {
  open: boolean;
  onClose: () => void;
  onSubscribe: (success: boolean, email: string, errorMsg?: string) => void;
}) {
  const [email, setEmail] = useState<string>('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const onEmailChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmail(e.target.value);
  }, []);

  const onSubscribeClick = useCallback(async () => {
    if (!isValidEmail(email)) {
      onSubscribe(false, email, 'Invalid Email format');
      return;
    }

    setIsSubscribing(true);
    const res = await fetch(
      `https://zzi7cyl4fe.execute-api.us-east-1.amazonaws.com/shoesLambda/sns/subscribe?email=${email}`, 
      {
        method: 'post'
      }
    );

    if (!res.ok) {
      onSubscribe(false, email);
    } else {
      onSubscribe(true, email);
    }

    setIsSubscribing(false);
  }, [email, onSubscribe]);

  return (
    <Modal
    open={open}
    onClose={onClose}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Please enter your E-mail to subscribe
        </Typography>
        <LinearProgress 
          {...(!isSubscribing && { variant: 'determinate', value: 0 })}
          sx={{ marginY: 1 }}
        />
        <Box sx={{ display: 'flex', mt: 3, justifyContent: 'space-between', gap: 2 }}>
          <TextField 
            label="E-mail"
            variant="outlined"
            sx={{ width: 275 }}
            onChange={onEmailChange}
          />
          <Button
            disabled={isSubscribing}
            variant="contained"
            onClick={onSubscribeClick}
            endIcon={<NotificationAddIcon />}
          >
            Subscribe
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default memo(SubscribeModal);
