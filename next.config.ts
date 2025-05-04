import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
        // Игнорируем все ошибки при сборке
        config.ignoreWarnings = [
            // Игнорируем любые ошибки, связанные с TypeScript
            /Could not find a declaration file for module 'elliptic'/,
            /Type error:/,
        ];

        // Дополнительно: показываем только ошибки (игнорируем предупреждения)
        config.stats = 'errors-only';

        return config;
    },
}

export default nextConfig;
