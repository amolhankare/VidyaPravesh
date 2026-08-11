import { SchoolAssessmentSubmission } from '../types';

const STORAGE_KEY = 'maharashtra_vidya_pravesh_submissions_v2';
const OLD_STORAGE_KEY = 'maharashtra_vidya_pravesh_submissions_v1';

// All demo/seed data has been completely removed.
// The app now starts with 0 submissions for clean production usage.
const INITIAL_SEED_DATA: SchoolAssessmentSubmission[] = [];

const GAS_URL_KEY = 'maharashtra_vidya_pravesh_gas_url_v1';

export function getGoogleAppsScriptUrl(): string | null {
  try {
    return localStorage.getItem(GAS_URL_KEY) || null;
  } catch (err) {
    return null;
  }
}

export function saveGoogleAppsScriptUrl(url: string): void {
  try {
    if (!url) {
      localStorage.removeItem(GAS_URL_KEY);
    } else {
      localStorage.setItem(GAS_URL_KEY, url);
    }
  } catch (err) {
    console.error('Error saving Google Apps Script URL:', err);
  }
}

export function getStoredSubmissions(): SchoolAssessmentSubmission[] {
  try {
    // Clear legacy storage key containing mock demo data if it exists
    if (localStorage.getItem(OLD_STORAGE_KEY)) {
      localStorage.removeItem(OLD_STORAGE_KEY);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return [];
  }
}

export function saveSubmission(submission: SchoolAssessmentSubmission): boolean {
  try {
    const current = getStoredSubmissions();
    // Check if school already submitted for this month
    const existingIdx = current.findIndex(
      (s) => s.udiseNo === submission.udiseNo && s.month === submission.month
    );

    if (existingIdx >= 0) {
      current[existingIdx] = {
        ...submission,
        updatedAt: new Date().toISOString(),
      };
    } else {
      current.unshift(submission);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));

    // 1. Sync to local Express backend server endpoint
    fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    }).catch((err) => {
      console.warn('Backend API submission sync warning:', err);
    });

    // 2. Send data to Google Apps Script (Google Sheets ₹0 Free integration) if URL is configured
    const gasUrl = getGoogleAppsScriptUrl();
    if (gasUrl && gasUrl.startsWith('http')) {
      fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(submission),
      }).catch((err) => {
        console.warn('Google Sheet background sync warning:', err);
      });
    }

    return true;
  } catch (err) {
    console.error('Error saving submission:', err);
    return false;
  }
}

export function resetToSeedData(): SchoolAssessmentSubmission[] {
  // Clear all data to empty state
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  fetch('/api/submissions', { method: 'DELETE' }).catch(() => {});
  return [];
}

export function clearAllSubmissions(): SchoolAssessmentSubmission[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  fetch('/api/submissions', { method: 'DELETE' }).catch(() => {});
  return [];
}

export async function fetchRemoteSubmissions(): Promise<SchoolAssessmentSubmission[] | null> {
  // Try fetching from Express backend API first
  try {
    const apiRes = await fetch('/api/submissions');
    if (apiRes.ok) {
      const apiData = await apiRes.json();
      if (Array.isArray(apiData) && apiData.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
        return apiData;
      }
    }
  } catch (err) {
    console.warn('Could not fetch from backend API /api/submissions:', err);
  }

  // Fallback to Google Sheet Apps Script URL if configured
  const gasUrl = getGoogleAppsScriptUrl();
  if (!gasUrl || !gasUrl.startsWith('http')) return null;

  try {
    const res = await fetch(gasUrl);
    if (!res.ok) return null;
    const remoteData = await res.json();
    if (Array.isArray(remoteData)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
      return remoteData;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch remote Google Sheet data:', err);
    return null;
  }
}
