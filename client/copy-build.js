const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'build');
const dest = path.join(__dirname, '../server/public');

try {
    // Clear destination directory first
    if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
    }
    // Copy build to destination
    fs.cpSync(src, dest, { recursive: true });
    console.log('React build successfully copied to server/public!');
} catch (err) {
    console.error('Error copying build:', err);
}
