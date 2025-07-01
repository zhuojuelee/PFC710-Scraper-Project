import { useAtom, useAtomValue } from 'jotai';
import displayAllDataAtom from '../../atoms/displayAllDataAtom';
import { Alert, Typography } from '@mui/material';
import DataTable from '../DataTable';
import shoesAtom from '../../atoms/shoesAtom';
import useTableData from '../../hooks/useTableData';
import { memo } from 'react';
import { toggleWatchlistAtom } from '../../atoms/watchlistAtom';

function ShoesTable() {
  const displayAllData = useAtomValue(displayAllDataAtom);
  const toggleWatchlist = useAtomValue(toggleWatchlistAtom);

  const [{ data: shoesData }] = useAtom(shoesAtom);
  const { upcoming, past, all: allData } = useTableData(shoesData.data);

  return (
    <>
      {displayAllData ? (
        <>
          <Alert severity="info" sx={{ alignItems: 'center' }}>
            <Typography variant="h6">{toggleWatchlist ? 'Watch List' : 'All data'}</Typography>
          </Alert>
          <DataTable data={allData} />
        </>
      ) : (
        <>
          <Alert severity="info" sx={{ alignItems: 'center' }}>
            <Typography variant="h6">
              {toggleWatchlist ? 'Upcoming Watch List' : `${upcoming.length} Upcoming Releases`}
            </Typography>
          </Alert>
          <DataTable data={upcoming} />
          <Alert severity="warning" sx={{ alignItems: 'center' }}>
            <Typography variant="h6">
              {toggleWatchlist
                ? 'Released Watch List'
                : `${past.length} Past Releases - Preview and Info Page may not be unavailable`}
            </Typography>
          </Alert>
          <DataTable data={past} />
        </>
      )}
    </>
  );
}

export default memo(ShoesTable);
