/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,

  images: { remotePatterns: [{ hostname: 'cdn.sanity.io' }] },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: {
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                name: 'removeViewBox',
                active: false,
              },
            ],
          },
        },
      },
    });

    config.module.rules.push({
      test: /\.glsl/,
      type: 'asset/source',
    });

    return config;
  },
};

export default config;
