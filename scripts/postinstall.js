#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if dist folder already exists
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath) && fs.readdirSync(distPath).length > 0) {
    console.log('dist folder already exists, skipping build');
    process.exit(0);
}

// Check if build dependencies are available
try {
    require.resolve('webpack-cli');
    require.resolve('webpack');
    
    // Dependencies are available, run the build
    console.log('Building electro-privacy...');
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
} catch (e) {
    // Dependencies not available - try to install them
    console.log('Build dependencies not found. Installing devDependencies...');
    try {
        execSync('npm install --only=dev', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
        console.log('Building electro-privacy...');
        execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    } catch (installError) {
        console.log('Could not install devDependencies or build. This is normal when installing as a dependency.');
        console.log('To build manually, run: cd node_modules/electro-privacy && npm install && npm run build');
        process.exit(0); // Don't fail the install
    }
}

