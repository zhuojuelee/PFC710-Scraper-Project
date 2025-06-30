import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import PreviewIcon from '@mui/icons-material/Preview';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { memo, useCallback, useMemo, useState } from "react";
import type { Status, TableData } from "../../types";
import Preview from "../Preview";
import StatusChip from "../StatusChip";
import { useAtom, useAtomValue } from "jotai";
import { toggleWatchlistAtom, watchlistAtom } from "../../atoms/watchlistAtom";

type MetaData = {
  id: string;
  label: string;
};

const headerColor = '#eeeeee';
const columns: MetaData[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status' },
  { id: 'previewImgSrc', label: 'Preview' },
  { id: 'gender', label: 'Gender' },
  { id: 'style', label: 'Style' },
  { id: 'price', label: 'Price' },
  { id: 'releaseDateTimestamp', label: 'Release Date' },
  { id: 'releasePageUrl', label: 'Info Page' },
  { id: 'watchList', label: 'Watch'},
];

function unixToDate(timestamp: number) {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function DataTable({ data } : { data: TableData[]; }) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // watch list states
  const watchlistToggle = useAtomValue(toggleWatchlistAtom)
  const [watchList, setWatchList] = useAtom(watchlistAtom);

  const onClickReleasePage = useCallback((
    url: string,
    id: string,
    status: Status
  ) => {
    let linkUrl: string = url;
    if (status === 'RELEASED') {
      linkUrl = `https://www.footlocker.ca/en/product/~/${id}.html`;
      window.open();
    }
    window.open(linkUrl, '_blank');
  }, []);

  const onClickWatch = useCallback((id: string) => {
    const idFound = watchList[id];
    if (!idFound) {
      setWatchList({
        ...watchList,
        [id]: true,
      });
    } else {
      const watchListCopy = {...watchList};
      delete watchListCopy[id];
      setWatchList(watchListCopy);
    }
  }, [setWatchList, watchList]);

  const filteredData = useMemo(() => {
    if (watchlistToggle) {
      return data.filter(shoe => !!watchList[shoe.id]);
    }

    return data;
  }, [data, watchList, watchlistToggle])

  return (
    <TableContainer sx={{ marginY: 3 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: headerColor }}>
            {columns.map(col => (
              <TableCell align="left" key={`header-${col.id}`}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {col.label}
                </Typography>
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
          {filteredData.length > 0 && filteredData.map(row => (
            <TableRow key={`row-${row.id}`}>
              <TableCell align="left">{row.id}</TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">
                <StatusChip status={row.status} />
              </TableCell>
              <TableCell align="left"
                onMouseEnter={() => setHoveredCell(row.id)}
                onMouseLeave={() => setHoveredCell(null)}
              >
                <PreviewIcon />
                {hoveredCell === row.id && <Preview imgSrc={row.previewImgSrc} />}
              </TableCell>
              <TableCell align="left">{row.gender}</TableCell>
              <TableCell align="left">{row.style}</TableCell>
              <TableCell align="left">{`$${Number(row.price).toFixed(2)}`}</TableCell>
              <TableCell align="left">{unixToDate(row.releaseDateTimestamp)}</TableCell>
              <TableCell align="left">
                <IconButton onClick={() => onClickReleasePage(row.releasePageUrl, row.id, row.status)}>
                  <OpenInNewIcon />
                </IconButton>
              </TableCell>
              <TableCell align="left">
                <IconButton onClick={() => onClickWatch(row.id)}>
                  <Typography variant="h6">{watchList[row.id] ? '✅' : '👀'}</Typography>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default memo(DataTable);