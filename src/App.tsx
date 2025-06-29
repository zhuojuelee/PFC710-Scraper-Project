import { Box, Divider, Typography } from '@mui/material';
import DataTable from './components/DataTable';
import useTableData from './hooks/useTableData';
import ActionButtons from './components/ActionButtons';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useAtom } from 'jotai';
import shoesAtom from './atoms/shoesAtom';

function App() {
  const queryClient = new QueryClient();

  const [{ data: shoesData }] = useAtom(shoesAtom);
  const { upcoming, past } = useTableData(shoesData.data);

  const lastUpdatedAt = shoesData.lastUpdatedAt;
  
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Box sx={{ p:2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
              <AutoGraphIcon sx={{ height: 40, width: 40, color: 'coral' }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                FootLocker Releases
              </Typography>
              <Typography>Last Updated at {lastUpdatedAt ?? 'unknown'}</Typography>
            </Box>
            <ActionButtons />
          </Box>
          <Divider sx={{ marginY: 3 }} />
          <Typography variant="h6">Upcoming Releases {`[${upcoming.length}]`}</Typography>
          <DataTable data={upcoming} />
          <Typography variant="h6">Past Releases {`[${past.length}]`}</Typography>
          <DataTable data={past} />
        </Box>
      </Provider>
    </QueryClientProvider>
  )
}

export default App
