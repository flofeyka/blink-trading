import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        config.externals = {
            ...(config.externals || {}),
            'submodule': 'commonjs submodule'
        };
        return config;
    }
}

export default nextConfig;
