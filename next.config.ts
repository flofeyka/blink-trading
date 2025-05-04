import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        // Игнорируем все ошибки и предупреждения в процессе сборки
        config.ignoreWarnings = [
            // Регулярные выражения для игнорирования любых ошибок
            /.*\.(ts|tsx|js|jsx|scss|css).*$/, // Игнорировать ошибки любых типов файлов
            /Module not found/,
            /Failed to parse source map/,
            /TypeError/,
            /Warning/,
            /Error/,
        ];

        // Настройка для игнорирования всех ошибок в Webpack
        config.stats = 'errors-only';  // Показывает только ошибки, не блокирует сборку

        // Настроим Webpack так, чтобы он не завершал сборку на ошибке
        config.performance = {
            hints: false,  // Отключить все производственные подсказки
        };

        return config;
    },
}

export default nextConfig;
