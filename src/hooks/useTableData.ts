import { useMemo } from "react";
import type { ShoesData, TableData } from "../types";

type ProcessedTableData = {
  upcoming: TableData[];
  past: TableData[];
  all: TableData[];
};

export default function(shoesData: ShoesData[]) {
  const tableData: ProcessedTableData = useMemo(() => {
    const upcoming: TableData[] = [];
    const past: TableData[] = [];
    const all: TableData[] = []
    
    const timeNow = Date.now() / 1_000; // convert to seconds
    for (const data of shoesData) {
      if (data.releaseDateTimestamp < timeNow) {
        const releasedProduct: TableData = {
          id: data.id,
          name: data.name,
          status: 'RELEASED',
          previewImgSrc: data.imgUrl,
          gender: data.gender,
          style: data.style,
          price: data.price,
          releaseDateTimestamp: data.releaseDateTimestamp,
          releasePageUrl: data.releasePageUrl
        };
        past.push(releasedProduct);
        all.push(releasedProduct);
      } else {
        const upcomingProduct: TableData = {
          id: data.id,
          name: data.name,
          status: 'UPCOMING',
          previewImgSrc: data.imgUrl,
          gender: data.gender,
          style: data.style,
          price: data.price,
          releaseDateTimestamp: data.releaseDateTimestamp,
          releasePageUrl: data.releasePageUrl
        };
        upcoming.push(upcomingProduct);
        all.push(upcomingProduct);
      }
    }

    return {
      upcoming,
      past,
      all,
    };
  }, [shoesData])

  return {
    ...tableData,
  };
}