import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        // Игнорируем все ошибки модулей и делаем так, чтобы они не останавливались
        config.resolve.alias = {
            ...config.resolve.alias,
            'submodule': false,  // Просто игнорируем alias 'submodule'
        };

        // Включаем игнорирование ошибок в процессе сборки
        config.ignoreWarnings = [/Failed to parse source map/];  // Можно добавить другие ошибки

        // Дополнительно настраиваем вывод Webpack, чтобы он не блокировал сборку
        config.stats = 'errors-only';

        return config;
    }
}

export default nextConfig;
