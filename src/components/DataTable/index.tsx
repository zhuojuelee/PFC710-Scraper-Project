import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import PreviewIcon from '@mui/icons-material/Preview';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { memo, useCallback, useState } from "react";
import type { TableData } from "../../types";
import Preview from "../Preview";
import StatusChip from "../StatusChip";

type MetaData = {
  id: string;
  label: string;
};

const columns: MetaData[] = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'status', label: 'Status' },
  { id: 'previewImgSrc', label: 'Preview' },
  { id: 'gender', label: 'Gender' },
  { id: 'style', label: 'Style' },
  { id: 'price', label: 'Price' },
  { id: 'releaseDateTimestamp', label: 'Release Date' },
  { id: 'releasePageUrl', label: 'Release Page' },
];

function unixToDate(timestamp: number) {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function DataTable({ data } : { data: TableData[] }) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const onClickReleasePage = useCallback((url: string) => {
    window.open(url, '_blank')
  }, [])

  return (
    <TableContainer sx={{ marginY: 4 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell align="left">
                <Typography sx={{ fontWeight: 'bold' }}>
                  {col.label}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow>
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
                <IconButton onClick={() => onClickReleasePage(row.releasePageUrl)}>
                  <OpenInNewIcon />
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