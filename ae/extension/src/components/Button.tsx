import { styled } from "../../stitches.config";

export const Filled = styled("button", {
  backgroundColor: "$primary",
  color: "$on-primary",
  border: "none",
  fontFamily: "$text",
  fontWeight: "$medium",
  fontSize: "14px",
  paddingX: "$6",
  paddingY: "$2-5",
  borderRadius: "$large",
  "&:hover": {
    filter: "brightness(85%)",
    boxShadow: "$hover",
  },
});

export const Tonal = styled(Filled, {
  backgroundColor: "$secondary-container",
  color: "$on-secondary-container",
  "&:hover": {
    filter: "brightness(110%)",
  },
});

export const Elevated = styled(Filled, {
  backgroundColor: "$surface3",
  color: "$primary",
  boxShadow: "$elevated",
  "&:hover": {
    boxShadow: "$elevated-hover",
    filter: "brightness(110%)",
  },
});

export const Outlined = styled(Filled, {
  backgroundColor: "$surface",
  color: "$primary",
  borderColor: "$outline",
  borderWidth: "1px",
  borderStyle: "solid",
  "&:hover": {
    backgroundColor: "#25323a",
  },
});

export const Text = styled(Outlined, {
  background: "none",
  border: "none",
});
