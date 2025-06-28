import { useMemo } from "react";
import type { ShoesData, TableData } from "../types";

type ProcessedTableData = {
  upcoming: TableData[];
  past: TableData[]
};

export default function(shoesData: ShoesData[]) {
  const tableData: ProcessedTableData = useMemo(() => {
    const upcoming: TableData[] = [];
    const past: TableData[] = [];
    
    const timeNow = Date.now() / 1_000; // convert to seconds
    for (const data of shoesData) {
      if (data.releaseDateTimestamp < timeNow) {
        past.push({
          id: data.id,
          name: data.name,
          status: 'RELEASED',
          previewImgSrc: data.imgUrl,
          gender: data.gender,
          style: data.style,
          price: data.price,
          releaseDateTimestamp: data.releaseDateTimestamp,
          releasePageUrl: data.releasePageUrl
        });
      } else {
        upcoming.push({
          id: data.id,
          name: data.name,
          status: 'UPCOMING',
          previewImgSrc: data.imgUrl,
          gender: data.gender,
          style: data.style,
          price: data.price,
          releaseDateTimestamp: data.releaseDateTimestamp,
          releasePageUrl: data.releasePageUrl
        });
      }
    }

    return {
      upcoming,
      past,
    }
  }, [shoesData])

  return {
    ...tableData,
  };
}