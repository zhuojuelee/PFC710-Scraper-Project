import { Box } from "@mui/material";
import { memo } from "react";

function Preview({ imgSrc }: { imgSrc: string }) {
  return (
    <Box 
      component="img"
      src={imgSrc}
      alt="Preview"
      sx={{
        position: 'absolute',
        width: 300,
        height: 300,
        mt: 1,
        boxShadow: 3,
        borderRadius: 1,
        backgroundColor: 'white',
      }}
    />
  )
};

export default memo(Preview);
