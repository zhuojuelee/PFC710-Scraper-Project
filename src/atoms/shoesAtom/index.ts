import { atomWithSuspenseQuery } from "jotai-tanstack-query";
import { mockData } from "../../mockData";
import Papa from "papaparse";
import type { ShoesData } from "../../types";

const shoesAtom = atomWithSuspenseQuery(_get => {
  return {
    queryKey: ['shoes'],
    queryFn: async () => {
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return mockData;
      }

      const res = await fetch('http://pfc710-shoes.s3-website-us-east-1.amazonaws.com/data.csv');
      if (!res.ok) {
        return []        
      }

      const dataCsvAsString = await res.text();
      const parsedData = Papa.parse<ShoesData>(dataCsvAsString, {
        delimiter: ',',
        header: true,
        skipEmptyLines: true,
      });

      console.log(parsedData.data)
      return parsedData.data;
    },
  };
});

export default shoesAtom;
