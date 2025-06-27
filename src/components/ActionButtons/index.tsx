import { Box, IconButton } from "@mui/material";
import { memo, useCallback } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import shoesAtom from "../../atoms/shoesAtom";
import { useAtom } from "jotai";
import AwsLambdaClient from "../../aws/lambdaClient";
import AwsSnsClient from "../../aws/snsClient";

const iconSx = {
  height: 50,
  width: 50,
};

function ActionButtons() {
  const [{ refetch }] = useAtom(shoesAtom);

  const invokeLambdaToScrape = useCallback(() => {
    AwsLambdaClient.invokeShoesLambda();
  }, [])

  const fetchLatestData = useCallback(() => {
    refetch();
  }, []);

  const sendSnsNotif = useCallback(() => {
    AwsSnsClient.sendMessage('CHECK OUR APP NOW!');
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
