/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve(
        'react-native-video/dist/transformer',
      ),
    },
    resolver: {
      assetExts: [...assetExts, 'mp4', 'mov'],
      sourceExts: [...sourceExts, 'mp4'],
    },
  };
})();
