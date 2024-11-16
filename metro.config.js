// eslint-disable-next-line @typescript-eslint/no-var-requires
import { getDefaultConfig } from "expo/metro-config";

export default (() => {
  const config = getDefaultConfig(process.cwd());

  const { transformer, resolver } = config;

  // Update the transformer and resolver configurations
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return config;
})();
