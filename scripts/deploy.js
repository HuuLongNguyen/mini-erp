import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../package.json');
const manifestPath = path.resolve(__dirname, '../manifest.json'); // Might be required for pac code push

// Increment version
const args = process.argv.slice(2);
const shouldIncrement = !args.includes('--no-increment');

if (shouldIncrement) {
    try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const versionParts = pkg.version.split('.').map(Number);

        // Increment patch version (major.minor.patch)
        versionParts[2] += 1;
        pkg.version = versionParts.join('.');

        fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
        console.log(`Version incremented to ${pkg.version}`);
    } catch (error) {
        console.error('Failed to increment version:', error);
        process.exit(1);
    }
} else {
    console.log('Skipping version increment (--no-increment flag detected)');
}

// Run build
console.log('Running build...');
try {
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}

// Deploy
console.log('Deploying via pac code push...');
try {
    execSync('pac code push', { stdio: 'inherit' });
} catch (error) {
    console.error('Deployment failed. Ensure you have authenticated with pac auth create first.');
    console.error('Error:', error.message);
    process.exit(1);
}
