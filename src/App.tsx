import { Box, Divider, Typography } from '@mui/material';
import DataTable from './components/DataTable';
import useTableData from './hoooks/useTableData';
import ActionButtons from './components/ActionButtons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useAtom } from 'jotai';
import shoesAtom from './atoms/shoesAtom';

function App() {
  const queryClient = new QueryClient();

  const [{ data: shoesData }] = useAtom(shoesAtom);
  const { upcoming, past } = useTableData(shoesData);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Box sx={{ p:2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' , justifyContent: 'space-between' }}>
            <Typography variant="h5">FootLocker Releases</Typography>
            <ActionButtons />
          </Box>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="h6">Upcoming Releases</Typography>
          <DataTable data={upcoming} />
          <Typography variant="h6">Past Releases</Typography>
          <DataTable data={past} />
        </Box>
      </Provider>
    </QueryClientProvider>
  )
}

export default App
