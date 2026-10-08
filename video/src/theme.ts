import { loadFont } from "@remotion/google-fonts/Inter";

export const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

export const C = {
  bg: "#051424",
  bg2: "#0d1c2d",
  card: "#122131",
  cardHi: "#1c2b3c",
  teal: "#46f1c5",
  tealDim: "#00b894",
  text: "#d4e4fa",
  muted: "#8fa3b8",
  amber: "#ffcf96",
  danger: "#ffb4ab",
  line: "#2a3b4d",
};

export const FPS = 30;
export const REPO_URL = "github.com/seppam/sectors-ai-advisor";
