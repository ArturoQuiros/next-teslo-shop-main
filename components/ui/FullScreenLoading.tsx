import { Box, CircularProgress, Typography } from "@mui/material"

export const FullScreenLoading = () => {
  return (
    <Box flexDirection='column'
        display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 300px)'>
        <CircularProgress thickness={2} />
    </Box>
  )
}
