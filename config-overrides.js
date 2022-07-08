/* config-overrides.js */
const { override, addBabelPlugins } = require('customize-cra');
const {alias, configPaths} = require('react-app-rewire-alias');
const aliasMap = configPaths('./tsconfig.paths.json') // or jsconfig.paths.json
const path = require('path');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const pkg = require("./package.json");
const webpack = require("webpack");

function myOverrides(config) {
  config.output = {
    ...config.output,
    path: path.resolve(process.env.BUILD_PATH || 'build'),
    publicPath: process.env.REACT_APP_REMOTE_DOMAIN,
  }

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"]
    }),
    new ModuleFederationPlugin({
      "name": "cms",
      filename: `remoteEntry.js`,
      exposes: {
        "./pages": './src/main.tsx'
      },
      shared: {
        'react-intl': {
          singleton: true,
          requiredVersion: pkg.dependencies[`react-intl`],
        },
        react: {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['react'],
        },
        'react-dom': {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['react-dom'],
        },
        '@kl-engineering/frontend-state': {
          singleton: true,
          requiredVersion: pkg.dependencies[`@kl-engineering/frontend-state`],
        },
        'fetch-intercept': {
          singleton: true,
          requiredVersion: pkg.dependencies['fetch-intercept'],
        },
      },
    }),
  ]);
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify")
  }
  const scopePluginIndex = config.resolve.plugins.findIndex(
    ({ constructor }) => constructor && constructor.name === "ModuleScopePlugin"
  );
  config.resolve.plugins.splice(scopePluginIndex, 1);
  return  alias(aliasMap)(config)
}


module.exports = override(
  myOverrides,
  process.env.NODE_ENV !== 'development' && addBabelPlugins(
    "transform-remove-console"
  )
);