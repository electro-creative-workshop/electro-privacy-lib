'use strict';

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const webpackPath = path.join(root, 'node_modules', 'webpack');

if (fs.existsSync(webpackPath)) {
    execSync('npm run build', { stdio: 'inherit', cwd: root });
}
