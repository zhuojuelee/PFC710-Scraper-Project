import { Chip } from "@mui/material";
import type { Status } from "../../types";

function StatusChip({ status } : { status: Status }) {
  const color = status === 'UPCOMING' ? 'blue' : 'red';
  return (
    <Chip 
      variant="outlined" label={status} 
      sx={{ 
        color,
        borderColor: color
    }}
    />
  );
};

export default StatusChip;