import { useMemo } from 'react';
import type { ShoesData, ShoesTableData } from '../types';

type ProcessedShoesTableData = {
  upcoming: ShoesTableData[];
  past: ShoesTableData[];
  all: ShoesTableData[];
};

export default function (shoesData: ShoesData[]) {
  const ShoesTableData: ProcessedShoesTableData = useMemo(() => {
    const upcoming: ShoesTableData[] = [];
    const past: ShoesTableData[] = [];
    const all: ShoesTableData[] = [];

    const timeNow = Date.now() / 1_000; // convert to seconds
    for (const data of shoesData) {
      if (data.releaseDateTimestamp < timeNow) {
        const releasedProduct: ShoesTableData = {
          id: data.id,
          name: data.name,
          status: 'RELEASED',
          previewImgSrc: data.imgUrl,
          gender: data.gender,
          style: data.style,
          price: data.price,
          releaseDateTimestamp: data.releaseDateTimestamp,
          releasePageUrl: data.releasePageUrl,
        };
        past.push(releasedProduct);
        all.push(releasedProduct);
      } else {
        const upcomingProduct: ShoesTableData = {
          id: data.id,
          name: data.name,
          status: 'UPCOMING',
          previewImgSrc: data.imgUrl,
          gender: data.gender,
          style: data.style,
          price: data.price,
          releaseDateTimestamp: data.releaseDateTimestamp,
          releasePageUrl: data.releasePageUrl,
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
  }, [shoesData]);

  return {
    ...ShoesTableData,
  };
}
