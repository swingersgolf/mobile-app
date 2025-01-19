import AssetBannerLogo from "@/assets/branding/BannerLogo.svg";
import AssetBannerLogoLight from "@/assets/branding/BannerLogoLight.svg";
import { Appearance } from "react-native";

const BannerLogo = ({ width, height }: { width: number; height: number }) => {
  return Appearance.getColorScheme() === "dark" ? (
    <AssetBannerLogoLight width={width} height={height} />
  ) : (
    <AssetBannerLogo width={width} height={height} />
  );
};

export default BannerLogo;
