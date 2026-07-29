/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/", destination: "/tr", permanent: true },
      {
        source: "/hizmetler",
        destination: "/tr/hizmetler",
        permanent: true,
      },
      {
        source: "/iletisim",
        destination: "/tr/iletisim",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
