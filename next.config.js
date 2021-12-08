/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    return {
      ...config,
      module: {
        ...config.module,
        rules: config.module.rules.concat({
          test: /\.(glsl|vs|fs|vert|frag)$/,
          type: "asset/source",
        }),
      },
    };
  },
};
