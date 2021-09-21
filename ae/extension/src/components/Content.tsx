import * as React from "react";
import { Box } from "./Box";

export function Content({ children }) {
  return (
    <Box
      css={{
        padding: "$4",
        flex: "1 0 auto",
        backgroundColor: "$background",
      }}
    >
      {children}
    </Box>
  );
}
