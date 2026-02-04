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
        // Build failed - log details but don't fail the install
        // This can happen if source files are missing (e.g. installing old published version)
        // or if there are actual build errors that should be investigated
        console.error('electro-privacy: Build failed during postinstall:');
        console.error(error.message || error);
        console.warn('electro-privacy: Installation will continue, but the build should be investigated.');
        console.warn('If you see this error, try running "npm run build" manually after installation.');
        // Exit with 0 to avoid breaking the install, but error was logged for visibility
        process.exit(0);
    }
}
