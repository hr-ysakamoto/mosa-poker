import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

export default function Index() {
  return (
    <div>
      <Container sx={{ pt: 5 }}>
        <>
          <Typography variant="h5" gutterBottom>
            Hello World!
          </Typography>
        </>
      </Container>
    </div>
  );
}
