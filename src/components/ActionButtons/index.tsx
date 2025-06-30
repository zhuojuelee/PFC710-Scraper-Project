import { Box, CircularProgress, Fab, Typography, type AlertColor, type SnackbarCloseReason, type SxProps } from "@mui/material";
import { memo, useCallback, useState, type ReactNode } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import shoesAtom from "../../atoms/shoesAtom";
import { useAtom } from "jotai";
import ToastAlert from "../ToastAlert";
import { toggleWatchlistAtom } from "../../atoms/watchlistAtom";

const fabColor = '#fafafa';
const syncColor = '#6573c3';
const refreshColor = '#00a152';
const sendColor = '#d500f9';
const watchOnColor = '#c8e6c9';

const iconSx = {
  height: 50,
  width: 50,
  backgroundColor: fabColor,
};

function SuspendableFloatingButton({
  color,
  children,
  isLoading = false,
  sx = {},
  onClick,
}: {
  color?: string;
  children: ReactNode;
  isLoading?: boolean;
  sx?: SxProps;
  onClick: () => void;
}) {
  return (
    <Fab sx={{ ...iconSx, ...sx }} onClick={onClick} disabled={isLoading}>
      {children}
      {isLoading && (
        <CircularProgress size={60} 
          sx={{
            color: color,
            position: 'absolute',
            zIndex: 1,
          }}/>
        )
      }
    </Fab>
  );
}

function ActionButtons() {
  // toast states
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<AlertColor>('success');
  const [toastMsg, setToastMsg] = useState<string>('');

  // status states
  const [isInvokingLambda, setIsInvokingLambda] = useState<boolean>(false);
  const [isSendingSnsMsg, setIsSendingSnsMsg] = useState<boolean>(false);

  const [toggleWatch, setToggleWatch] = useAtom(toggleWatchlistAtom);
  const [{ refetch, isFetching }] = useAtom(shoesAtom);

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
    setIsInvokingLambda(true);
    if (toastOpen) {
        setToastOpen(false);
    }

    const res = await fetch('https://zzi7cyl4fe.execute-api.us-east-1.amazonaws.com/shoesLambda', {
      method: 'post',
    });

    if (!res.ok) {
      setToastSeverity('error');
      setToastMsg('An error occured when invoking Lambda');
    } else {
      setToastSeverity('success');
      setToastMsg('Successfully invoked Lambda');
    }

    setToastOpen(true);
    setIsInvokingLambda(false);
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
    setIsSendingSnsMsg(false);
    if (toastOpen) {
        setToastOpen(false);
    }

    const res = await fetch('https://zzi7cyl4fe.execute-api.us-east-1.amazonaws.com/shoesLambda/sns', {
      method: 'post'
    });

    if (!res.ok) {
      setToastSeverity('error');
      setToastMsg('Failed to inform subscribers');
    } else {
      setToastSeverity('success');
      setToastMsg('Alerted subscribers');
    }

    setToastOpen(true);
    setIsSendingSnsMsg(false);
  }, [toastOpen]);

  const onToggleWatchlist = useCallback(() => {
    if (toggleWatch) {
      setToggleWatch(false);
    } else {
      setToggleWatch(true);
    }
  }, [setToggleWatch, toggleWatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <ToastAlert open={toastOpen} severity={toastSeverity} msg={toastMsg} handleClose={handleClose} />
      <SuspendableFloatingButton
        sx={toggleWatch ? { background: watchOnColor } : {}}
        onClick={onToggleWatchlist}
        >
        <Typography variant="h6">✅</Typography>
      </SuspendableFloatingButton>
      <SuspendableFloatingButton
        color={syncColor}
        isLoading={isInvokingLambda}
        onClick={invokeLambdaToScrape}
        >
        <SyncAltIcon sx={{ color: syncColor }} />
      </SuspendableFloatingButton>
      <SuspendableFloatingButton
        color={refreshColor}
        isLoading={isFetching}
        onClick={fetchLatestData}
        >
        <RefreshIcon sx={{ color: refreshColor }} />
      </SuspendableFloatingButton>
      <SuspendableFloatingButton
        color={sendColor}
        isLoading={isSendingSnsMsg}
        onClick={sendSnsNotif}
        >
        <SendIcon sx={{ color: sendColor }} />
      </SuspendableFloatingButton>
    </Box>
  )
};

export default memo(ActionButtons);
