import { atomWithSuspenseQuery } from "jotai-tanstack-query";
import { mockData } from "../../mockData";
import Papa from "papaparse";
import type { ShoesData } from "../../types";

type LastUpdatedAt = string | null;

const shoesAtom = atomWithSuspenseQuery(() => {
  return {
    queryKey: ['shoes', Date.now()],
    queryFn: async () => {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return {
          lastUpdatedAt: 'Sun, 29 Jun 2025 04:44:51 GMT',
          data: mockData
        };
      }

      const res = await fetch('http://pfc710-shoes.s3-website-us-east-1.amazonaws.com/data.csv');
      if (!res.ok) {
        const errorRes = await res.json();
        return {
          lastUpdatedAt: null,
          data: [],
          error: errorRes.message ?? `Failed to fetch data: ${errorRes.message}`
        };
      }

      const lastUpdatedAt: LastUpdatedAt = res.headers.get('last-modified');
      const dataCsvAsString = await res.text();
      const parsedData = Papa.parse<ShoesData>(dataCsvAsString, {
        delimiter: ',',
        header: true,
        skipEmptyLines: true,
      });

      return {
        lastUpdatedAt,
        data: parsedData.data
      };
    },
    staleTime: 0,
  };
});

export default shoesAtom;
