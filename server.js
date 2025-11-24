import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('=== Server Startup Debug ===');
console.log('Current working directory:', process.cwd());
console.log('Server script location:', __dirname);

// Check if dist exists and what files are present
const cwd = process.cwd();
const distPath = join(cwd, 'dist');

console.log('Looking for dist at:', distPath);

if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist folder not found!');
  console.error('Contents of', cwd, ':');
  try {
    const contents = fs.readdirSync(cwd);
    console.log(contents);
  } catch (e) {
    console.error('Could not read directory:', e.message);
  }
  console.error('\nMake sure you run: npm run build');
  process.exit(1);
}

console.log('✓ Found dist folder');
console.log('Contents of dist:');
const distContents = fs.readdirSync(distPath);
console.log(distContents);

// Serve static files
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-file routes
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  res.sendFile(indexPath);
});

const server = app.listen(PORT, () => {
  console.log(`\n✓ Server running on port ${PORT}`);
  console.log(`✓ Serving static files from: ${distPath}`);
  console.log(`✓ Ready at http://localhost:${PORT}\n`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
