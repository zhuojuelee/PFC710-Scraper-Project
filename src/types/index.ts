export type Status = 'UPCOMING' | 'RELEASED'

export type ShoesData = {
  id: string;
  name: string;
  gender: string;
  style: string;
  price: number;
  releaseDateTimestamp: number;
  releasePageUrl: string;
  imgUrl: string;
};

export type TableData = {
  id: string;
  name: string;
  status: Status;
  previewImgSrc: string;
  gender: string;
  style: string;
  price: number;
  releaseDateTimestamp: number;
  releasePageUrl: string; 
};
