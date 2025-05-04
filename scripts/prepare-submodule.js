const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const archivePath = path.resolve(__dirname, '../submodule.tgz');
const targetDir = path.resolve(__dirname, '../submodule');

// Удаляем старую папку
if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir);

// Определяем команду для распаковки
const isWindows = process.platform === 'win32';
const tarCommand = isWindows
    ? `tar -xf "${archivePath}" -C "${targetDir}"`
    : `tar -xzf "${archivePath}" -C "${targetDir}"`;

// Выполняем распаковку
try {
    execSync(tarCommand, { stdio: 'inherit' });

    // Переместим файлы из submodule/package/* в submodule/
    const packageDir = path.join(targetDir, 'package');
    if (fs.existsSync(packageDir)) {
        const files = fs.readdirSync(packageDir);
        for (const file of files) {
            fs.renameSync(
                path.join(packageDir, file),
                path.join(targetDir, file)
            );
        }
        fs.rmSync(packageDir, { recursive: true, force: true });
    }

    // Устанавливаем зависимости
    execSync('yarn install', { cwd: targetDir, stdio: 'inherit' });

} catch (err) {
    console.error('Ошибка:', err.message);
    process.exit(1);
}
