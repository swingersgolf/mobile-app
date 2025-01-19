import AssetIcon from "@/assets/branding/Icon.svg";
import AssetIconLight from "@/assets/branding/IconLight.svg";
import { Appearance } from "react-native";

const Icon = ({ width, height }: { width: number; height: number }) => {
  return Appearance.getColorScheme() === "dark" ? (
    <AssetIconLight width={width} height={height} />
  ) : (
    <AssetIcon width={width} height={height} />
  );
};

export default Icon;
