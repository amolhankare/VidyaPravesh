import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf-8');
}

// Helper to read backend submissions
function readSubmissions(): any[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading submissions file:', err);
    return [];
  }
}

// Helper to write backend submissions
function writeSubmissions(data: any[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing submissions file:', err);
  }
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET all submissions from server backend
app.get('/api/submissions', (_req, res) => {
  const list = readSubmissions();
  res.json(list);
});

// POST submit or update school assessment data
app.post('/api/submissions', async (req, res) => {
  const submission = req.body;
  if (!submission || !submission.udiseNo || !submission.month) {
    return res.status(400).json({ error: 'Missing udiseNo or month' });
  }

  const list = readSubmissions();
  const existingIndex = list.findIndex(
    (item: any) =>
      String(item.udiseNo) === String(submission.udiseNo) &&
      String(item.month) === String(submission.month)
  );

  const timestamp = new Date().toISOString();
  const updatedSubmission = {
    ...submission,
    updatedAt: timestamp,
    submittedAt: submission.submittedAt || timestamp,
  };

  if (existingIndex >= 0) {
    list[existingIndex] = updatedSubmission;
  } else {
    list.unshift(updatedSubmission);
  }

  writeSubmissions(list);

  // Sync to external Google Sheet Webhook if configured in ENV or query
  const googleSheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (googleSheetUrl && googleSheetUrl.startsWith('http')) {
    try {
      fetch(googleSheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(updatedSubmission),
      }).catch((e) => console.warn('Backend Google Sheet sync error:', e));
    } catch (e) {
      console.warn('Backend fetch failed:', e);
    }
  }

  res.json({
    status: 'success',
    action: existingIndex >= 0 ? 'updated' : 'created',
    submission: updatedSubmission,
  });
});

// DELETE reset all submissions (Admin feature)
app.delete('/api/submissions', (_req, res) => {
  writeSubmissions([]);
  res.json({ status: 'success', message: 'All backend submissions cleared' });
});

// ----------------------------------------------------
// VITE / STATIC SERVING
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
