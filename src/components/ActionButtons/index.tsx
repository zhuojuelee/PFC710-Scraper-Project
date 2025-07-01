import {
  Box,
  CircularProgress,
  Divider,
  Fab,
  Typography,
  type AlertColor,
  type SnackbarCloseReason,
  type SxProps,
} from '@mui/material';
import { memo, useCallback, useState, type ReactNode } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import shoesAtom from '../../atoms/shoesAtom';
import { useAtom } from 'jotai';
import ToastAlert from '../ToastAlert';
import { toggleWatchlistAtom } from '../../atoms/watchlistAtom';
import displayAllDataAtom from '../../atoms/displayAllDataAtom';
import SubscribeModal from '../SubscribeModal';
import displayRawDataAtom from '../../atoms/displayRawDataAtom';

const fabColor = '#fafafa';
const shinyColor = '#f9a825';
const mergeColor = '#00bcd4';
const syncColor = '#6573c3';
const notifColor = '#0288d1';
const refreshColor = '#00a152';
const sendColor = '#d500f9';
const toggleColor = '#c8e6c9';

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
        <CircularProgress
          size={60}
          sx={{
            color: color,
            position: 'absolute',
            zIndex: 1,
          }}
        />
      )}
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

  // subscribe modal
  const [subscribeModalOpen, setSubscribeModalOpen] = useState<boolean>(false);

  const [displayRawData, setDisplayRawData] = useAtom(displayRawDataAtom);
  const [displayAllData, setDisplayAllData] = useAtom(displayAllDataAtom);
  const [toggleWatch, setToggleWatch] = useAtom(toggleWatchlistAtom);
  const [{ refetch, isFetching }] = useAtom(shoesAtom);

  const handleClose = useCallback((_event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
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
  }, [toastOpen]);

  const fetchLatestData = useCallback(async () => {
    if (toastOpen) {
      setToastOpen(false);
    }

    try {
      const { data } = await refetch();
      if (data?.error) {
        setToastSeverity('error');
        setToastMsg(data.error);
        setToastOpen(true);
        return;
      }
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
      method: 'post',
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

  const onToggleDisplayRawData = useCallback(() => {
    setDisplayRawData(!displayRawData);
  }, [displayRawData, setDisplayRawData]);

  const onToggleWatchlist = useCallback(() => {
    if (toggleWatch) {
      setToggleWatch(false);
    } else {
      setToggleWatch(true);
    }
  }, [setToggleWatch, toggleWatch]);

  const onDisplayAllData = useCallback(() => {
    setDisplayAllData(!displayAllData);
  }, [displayAllData, setDisplayAllData]);

  const onSubscribe = useCallback((success: boolean, email: string, errorMsg?: string) => {
    if (errorMsg) {
      setToastSeverity('error');
      setToastMsg(errorMsg);
      setToastOpen(true);
      setSubscribeModalOpen(false);
      return;
    }

    if (success) {
      setToastSeverity('success');
      setToastMsg(`${email} successfully subscribed`);
    } else {
      setToastSeverity('error');
      setToastMsg('Failed to subscribed to SNS topic');
    }

    setSubscribeModalOpen(false);
    setToastOpen(true);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <SubscribeModal
        open={subscribeModalOpen}
        onClose={() => setSubscribeModalOpen(false)}
        onSubscribe={onSubscribe}
      />
      <ToastAlert open={toastOpen} severity={toastSeverity} msg={toastMsg} handleClose={handleClose} />
      <SuspendableFloatingButton
        sx={!displayRawData ? { background: toggleColor } : {}}
        onClick={onToggleDisplayRawData}
      >
        <AutoAwesomeIcon sx={{ color: shinyColor }} />
      </SuspendableFloatingButton>
      <Divider orientation="vertical" />
      <SuspendableFloatingButton sx={displayAllData ? { background: toggleColor } : {}} onClick={onDisplayAllData}>
        <MergeTypeIcon sx={{ color: mergeColor }} />
      </SuspendableFloatingButton>
      <SuspendableFloatingButton sx={toggleWatch ? { background: toggleColor } : {}} onClick={onToggleWatchlist}>
        <Typography variant="h6">✅</Typography>
      </SuspendableFloatingButton>
      <Divider orientation="vertical" />
      <SuspendableFloatingButton onClick={() => setSubscribeModalOpen(true)}>
        <NotificationAddIcon sx={{ color: notifColor }} />
      </SuspendableFloatingButton>
      <SuspendableFloatingButton color={syncColor} isLoading={isInvokingLambda} onClick={invokeLambdaToScrape}>
        <SyncAltIcon sx={{ color: syncColor }} />
      </SuspendableFloatingButton>
      <SuspendableFloatingButton color={refreshColor} isLoading={isFetching} onClick={fetchLatestData}>
        <RefreshIcon sx={{ color: refreshColor }} />
      </SuspendableFloatingButton>
      <SuspendableFloatingButton color={sendColor} isLoading={isSendingSnsMsg} onClick={sendSnsNotif}>
        <SendIcon sx={{ color: sendColor }} />
      </SuspendableFloatingButton>
    </Box>
  );
}

export default memo(ActionButtons);
