import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { memo, useCallback, useMemo, useState } from 'react';
import type { Status, ShoesTableData } from '../../types';
import Preview from '../Preview';
import StatusChip from '../StatusChip';
import { useAtom, useAtomValue } from 'jotai';
import { toggleWatchlistAtom, watchlistAtom } from '../../atoms/watchlistAtom';

type Column = {
  id: string;
  label: string;
  width: number;
  align?: 'left' | 'center' | 'right';
};

const headerColor = '#eeeeee';
const columns: Column[] = [
  { id: 'id', label: 'ID', width: 100 },
  { id: 'name', label: 'Name', width: 400 },
  { id: 'status', label: 'Status', width: 150, align: 'center' },
  { id: 'previewImgSrc', label: 'Preview', width: 60, align: 'center' },
  { id: 'gender', label: 'Gender', width: 350 },
  { id: 'style', label: 'Style', width: 550 },
  { id: 'price', label: 'Price', width: 150, align: 'center' },
  { id: 'releaseDateTimestamp', label: 'Release Date', width: 150, align: 'center' },
  { id: 'releasePageUrl', label: 'Info Page', width: 120, align: 'center' },
  { id: 'watchList', label: 'Watch', width: 150, align: 'center' },
];

function unixToDate(timestamp: number) {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function DataTable({ data }: { data: ShoesTableData[] }) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // watch list states
  const watchlistToggle = useAtomValue(toggleWatchlistAtom);
  const [watchList, setWatchList] = useAtom(watchlistAtom);

  const onClickReleasePage = useCallback((url: string, id: string, status: Status) => {
    let linkUrl: string = url;
    if (status === 'RELEASED') {
      linkUrl = `https://www.footlocker.ca/en/product/~/${id}.html`;
      window.open(linkUrl, '_blank');
    }
    window.open(linkUrl, '_blank');
  }, []);

  const onClickWatch = useCallback(
    (id: string) => {
      const idFound = watchList[id];
      if (!idFound) {
        setWatchList({
          ...watchList,
          [id]: true,
        });
      } else {
        const watchListCopy = { ...watchList };
        delete watchListCopy[id];
        setWatchList(watchListCopy);
      }
    },
    [setWatchList, watchList],
  );

  const filteredData = useMemo(() => {
    if (watchlistToggle) {
      return data.filter((shoe) => !!watchList[shoe.id]);
    }

    return data;
  }, [data, watchList, watchlistToggle]);

  return (
    <TableContainer sx={{ marginY: 3 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: headerColor }}>
            {columns.map((col) => (
              <TableCell align={col.align ?? 'left'} key={`header-${col.id}`} sx={{ width: col.width }}>
                <Typography sx={{ fontWeight: 'bold' }}>{col.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Typography>No data available</Typography>
              </TableCell>
            </TableRow>
          )}
          {filteredData.length > 0 &&
            filteredData.map((row) => (
              <TableRow key={`row-${row.id}`}>
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="center">
                  <StatusChip status={row.status} />
                </TableCell>
                <TableCell
                  align="center"
                  onMouseEnter={() => setHoveredCell(row.id)}
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <PreviewIcon />
                  {hoveredCell === row.id && <Preview imgSrc={row.previewImgSrc} />}
                </TableCell>
                <TableCell align="left">{row.gender}</TableCell>
                <TableCell align="left">{row.style}</TableCell>
                <TableCell align="center">{`$${Number(row.price).toFixed(2)}`}</TableCell>
                <TableCell align="center">{unixToDate(row.releaseDateTimestamp)}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onClickReleasePage(row.releasePageUrl, row.id, row.status)}>
                    <OpenInNewIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onClickWatch(row.id)}>
                    <Typography variant="h6">{watchList[row.id] ? '✅' : '👀'}</Typography>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default memo(DataTable);
