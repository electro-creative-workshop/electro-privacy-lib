'use strict';

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const webpackPath = path.join(root, 'node_modules', 'webpack');

if (fs.existsSync(webpackPath)) {
    try {
        execSync('npm run build', { stdio: 'inherit', cwd: root });
    } catch (error) {
        // Build failed, but don't fail the install (e.g. missing src files in old versions)
        console.warn('electro-privacy: Build failed during postinstall, but installation will continue.');
        console.warn('This is normal if installing as a dependency without devDependencies.');
        process.exit(0);
    }
}
