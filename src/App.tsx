import { Box, Divider, Typography } from '@mui/material';
import ActionButtons from './components/ActionButtons';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useAtom } from 'jotai';
import shoesAtom from './atoms/shoesAtom';
import { memo, useMemo } from 'react';
import ShoesTable from './components/ShoesTable';

const convertToEst = (timeStr: string | null) => {
  if (!timeStr) {
    return 'unknown';
  }

  const date = new Date(timeStr);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Toronto', // EST/EDT (automatically handles daylight saving)
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return `${new Intl.DateTimeFormat('en-US', options).format(date)} EST`;
};

function App() {
  const queryClient = new QueryClient();

  const [{ data: shoesData }] = useAtom(shoesAtom);

  const lastUpdatedTimeInEst = useMemo(() => {
    return convertToEst(shoesData.lastUpdatedAt);
  }, [shoesData.lastUpdatedAt]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
              <AutoGraphIcon sx={{ height: 40, width: 40, color: 'coral' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Foot Locker Releases
              </Typography>
              <Typography>Last Updated at {lastUpdatedTimeInEst}</Typography>
              <AccessTimeIcon sx={{ marginX: -1 }} />
            </Box>
            <ActionButtons />
          </Box>
          <Divider sx={{ marginY: 3 }} />
          <ShoesTable />
        </Box>
      </Provider>
    </QueryClientProvider>
  );
}

export default memo(App);
