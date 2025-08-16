/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: './dist',
    async redirects() {
        return [
            {
                source: '/',
                destination: '/search',
                permanent: true,
            },
        ];
    },
};
   
export default nextConfig;
