import type {NextConfig} from "next";
import path from "node:path";

const nextConfig: NextConfig = {
    webpack: (config, { isServer }) => {
        // Игнорировать все файлы, чтобы не блокировать сборку
        config.module.rules.push({
            test: /\.(js|ts|tsx|css|scss|json)$/, // Применять к файлам .js, .ts, .tsx, .css, .scss, .json
            use: {
                loader: path.resolve(__dirname, 'noop-loader.js') // "Пустой" лоадер
            },
            exclude: /node_modules/, // Исключаем node_modules (если не хочешь игнорировать зависимости)
        });

        // Настроим вывод Webpack, чтобы не блокировать сборку
        config.stats = 'errors-only';

        return config;
    }
}

export default nextConfig;
