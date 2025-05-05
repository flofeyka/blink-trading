import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        // Ignore all build errors
        config.ignoreWarnings = [
            // Ignore any TypeScript related errors
            /Could not find a declaration file for module 'elliptic'/,
            /Type error:/,
        ];

        // Additionally: show only errors (ignore warnings)
        config.stats = 'errors-only';

        return config;
    },
    images: {
        domains: ['shdw-drive.genesysgo.net'],
    },
}

export default nextConfig;
