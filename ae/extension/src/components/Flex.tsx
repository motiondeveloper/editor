import { styled } from "../../stitches.config";
import { Box } from "./Box";

export const Flex = styled(Box, {
  display: "flex",
  flexWrap: "wrap",
  gap: "$4",
});
