import { Alert, Box, IconButton, Snackbar, type AlertColor, type SnackbarCloseReason } from "@mui/material";
import { memo, useCallback, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import shoesAtom from "../../atoms/shoesAtom";
import { useAtom } from "jotai";

const iconSx = {
  height: 50,
  width: 50,
};

function ToastAlert({ 
  severity,
  open,
  msg,
  handleClose 
}: { 
  severity: AlertColor,
  open: boolean,
  msg: string,
  handleClose: () => void 
}) {
  return (
    <Snackbar open={open} autoHideDuration={2_500} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
       >
        {msg}
    </Alert>
    </Snackbar>
  )
}

function ActionButtons() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<AlertColor>('success');
  const [toastMsg, setToastMsg] = useState<string>('');
  const [{ refetch }] = useAtom(shoesAtom);

  const handleClose = useCallback((
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
    ) => {
      if (reason === 'clickaway') {
        return;
      }

      setToastOpen(false);
  }, []);

  const invokeLambdaToScrape = useCallback(async () => {
    if (toastOpen) {
        setToastOpen(false);
    }

    const res = await fetch('https://zzi7cyl4fe.execute-api.us-east-1.amazonaws.com/shoesLambda', {
      method: 'post',
    });

    if (!res.ok) {
      setToastSeverity('error');
      setToastMsg('An error occured when invoking Lambda');
      setToastOpen(true);
    } else {
      setToastSeverity('success');
      setToastMsg('Successfully invoked Lambda');
      setToastOpen(true);
    }
  }, [toastOpen])

  const fetchLatestData = useCallback(() => {
    if (toastOpen) {
        setToastOpen(false);
    }

    try {
      refetch();
    } catch {
      setToastSeverity('error');
      setToastMsg('An error occurred when refetching data');
      setToastOpen(true);
      return;
    }

    setToastSeverity('success');
    setToastMsg('Successfully fetched latest data');
    setToastOpen(true);
  }, [refetch, toastOpen]);

  const sendSnsNotif = useCallback(async () => {
    if (toastOpen) {
        setToastOpen(false);
    }

    const res = await fetch('https://zzi7cyl4fe.execute-api.us-east-1.amazonaws.com/shoesLambda/sns', {
      method: 'post'
    });

    if (!res.ok) {
      setToastSeverity('error');
      setToastMsg('Failed to inform subscribers');
      setToastOpen(true);
    } else {
      setToastSeverity('success');
      setToastMsg('Alerted subscribers');
      setToastOpen(true);
    }

  }, [toastOpen]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <ToastAlert open={toastOpen} severity={toastSeverity} msg={toastMsg} handleClose={handleClose} />
      <IconButton sx={iconSx} onClick={invokeLambdaToScrape}>
        <SyncAltIcon />
      </IconButton>
      <IconButton sx={iconSx} onClick={fetchLatestData}>
        <RefreshIcon />
      </IconButton>
      <IconButton sx={iconSx} onClick={sendSnsNotif}>
        <SendIcon />
      </IconButton>
    </Box>
  )
};

export default memo(ActionButtons);
