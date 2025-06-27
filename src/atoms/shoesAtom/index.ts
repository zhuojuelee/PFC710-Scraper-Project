import { atomWithSuspenseQuery } from "jotai-tanstack-query";
import { mockData } from "../../mockData";
import AwsS3Client from "../../aws/s3Client";
import type { Readable } from "stream";
import Papa from "papaparse";
import type { ShoesData } from "../../types";

// Helper to stream S3 Body into a string
const streamToString = async (stream: Readable): Promise<string> => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
};

const shoesAtom = atomWithSuspenseQuery(_get => {
  return {
    queryKey: ['shoes'],
    queryFn: async () => {
      if (import.meta.env.VITE_USE_MOCK_DATA) {
        return mockData;
      }

      const dataCsv = await AwsS3Client.getShoesData();
      const dataCsvAsString = await streamToString(dataCsv as Readable);

      const parsedData = Papa.parse<ShoesData>(dataCsvAsString, {
        delimiter: ',',
        header: false,
      });

      return parsedData.data;
    },
  };
});

export default shoesAtom;
