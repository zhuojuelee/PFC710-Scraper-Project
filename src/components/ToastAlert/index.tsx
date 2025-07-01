import { type AlertColor, Snackbar, Alert } from '@mui/material';
import { memo } from 'react';

function ToastAlert({
  severity,
  open,
  msg,
  handleClose,
}: {
  severity: AlertColor;
  open: boolean;
  msg: string;
  handleClose: () => void;
}) {
  return (
    <Snackbar open={open} autoHideDuration={2_500} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {msg}
      </Alert>
    </Snackbar>
  );
}

export default memo(ToastAlert);
