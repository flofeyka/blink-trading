import type {NextConfig} from "next";
import path from "node:path";

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.(js|ts|tsx)$/,
            include: [path.resolve(__dirname, 'submodule')],
            use: 'ignore-loader'
        });
        return config;
    }};

export default nextConfig;
