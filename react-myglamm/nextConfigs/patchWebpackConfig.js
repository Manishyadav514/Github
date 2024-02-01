const fs = require("fs");
const path = require("path");
const WorkerPlugin = require("worker-plugin");

module.exports = { patchWebpackConfig };

function patchWebpackConfig() {
  try {
    const tsConfigPath = __dirname.replace("nextConfigs", "tsconfig.base.json");
    const tsConfigJson = fs.readFileSync(tsConfigPath, { encoding: "utf-8" });
    const tsConfig = JSON.parse(tsConfigJson);
    const tsPaths = tsConfig.compilerOptions.paths;

    return config => {
      const alias = Object.keys(tsPaths).reduce(
        (result, key) => ({
          ...result,
          [key]: tsPaths[key][0],
        }),
        {}
      );
      const patchedConfig = {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve?.alias,
            ...alias,
          },
        },
      };

      const resolverPathsOfCommonDirectories = ["libs"].map(dir => path.resolve(process.cwd(), dir));

      const dirs = getDirsWithPath(patchedConfig);
      dirs.push(...resolverPathsOfCommonDirectories);

      patchedConfig.plugins.push(
        new WorkerPlugin({
          globalObject: "self",
        })
      );

      patchedConfig.module.rules.push({
        test: /\.svg$/i,
        issuer: { and: [/\.(js|ts|md)x?$/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: "removeViewBox",
                    active: false,
                  },
                ],
              },
              titleProp: true,
            },
          },
        ],
      });

      patchedConfig.stats = "normal";

      // patchedConfig.resolve.alias["react-redux"] = process.env.NODE_ENV === "development" ? "react-redux" : "react-redux/lib";

      return patchedConfig;
    };
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function getDirsWithPath(config) {
  let dirs = [];

  if (config.module) {
    for (let i = 0; i < config.module.rules?.length; i++) {
      if (dirs.length) {
        break;
      }

      const oneOfByConfig = config.module.rules[i].oneOf;

      if (config.module.rules[i].include) {
        dirs = config.module.rules[i].include;
      } else if (oneOfByConfig && oneOfByConfig[0]?.include) {
        dirs = oneOfByConfig[0].include;
      }
    }
  }

  return dirs;
}
