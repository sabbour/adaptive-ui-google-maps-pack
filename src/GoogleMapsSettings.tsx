import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'adaptive_google_maps_api_key';
const SERVER_KEY_STORAGE = 'adaptive_google_maps_server_key';

export function getStoredApiKey(): string {
  // Prefer server-provided key, fall back to manually entered key
  return localStorage.getItem(SERVER_KEY_STORAGE)
    || localStorage.getItem(STORAGE_KEY)
    || '';
}

export function storeApiKey(key: string): void {
  if (key) {
    localStorage.setItem(STORAGE_KEY, key);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Fetch server-provided Google Maps API key (if configured)
async function fetchServerApiKey(): Promise<string | null> {
  try {
    const resp = await fetch('/api/gmaps-key');
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.apiKey || null;
  } catch {
    return null;
  }
}

// Auto-provision from server on first load
let serverKeyChecked = false;
export function initGoogleMapsKey(): void {
  if (serverKeyChecked) return;
  serverKeyChecked = true;
  fetchServerApiKey().then(key => {
    if (key) {
      localStorage.setItem(SERVER_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(SERVER_KEY_STORAGE);
    }
  });
}

// Run on import
initGoogleMapsKey();

export function GoogleMapsSettings() {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [saved, setSaved] = useState(false);
  const [serverProvided, setServerProvided] = useState(!!localStorage.getItem(SERVER_KEY_STORAGE));

  useEffect(() => {
    setSaved(false);
  }, [apiKey]);

  // Re-check server key on mount
  useEffect(() => {
    fetchServerApiKey().then(key => {
      if (key) {
        localStorage.setItem(SERVER_KEY_STORAGE, key);
        setServerProvided(true);
        // Update displayed key if user hasn't manually set one
        if (!localStorage.getItem(STORAGE_KEY)) {
          setApiKey(key);
        }
      }
    });
  }, []);

  const handleSave = () => {
    storeApiKey(apiKey);
    setSaved(true);
  };

  const isConfigured = !!getStoredApiKey();

  return React.createElement('div', {
    style: { display: 'flex', flexDirection: 'column', gap: '8px' } as React.CSSProperties,
  },
    // Status
    React.createElement('div', {
      style: { display: 'flex', alignItems: 'center', gap: '8px' },
    },
      React.createElement('div', {
        style: {
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: isConfigured ? '#22c55e' : '#ef4444',
        },
      }),
      React.createElement('span', {
        style: { fontSize: '13px', color: isConfigured ? '#166534' : '#991b1b' },
      }, serverProvided ? 'Using built-in API key' : (isConfigured ? 'API key configured' : 'No API key'))
    ),

    // Only show manual input when no server-provided key
    !serverProvided && React.createElement('div', {
      style: { display: 'flex', gap: '6px', alignItems: 'center' },
    },
      React.createElement('input', {
        type: 'password',
        placeholder: 'Google Maps API key',
        value: apiKey,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value),
        style: {
          flex: 1, padding: '6px 10px', borderRadius: '6px',
          border: '1px solid #374151', backgroundColor: '#1f2937',
          color: '#e5e7eb', fontSize: '13px',
        },
      }),
      React.createElement('button', {
        onClick: handleSave,
        style: {
          padding: '6px 12px', borderRadius: '6px', border: 'none',
          backgroundColor: '#2563eb', color: '#fff', fontSize: '12px',
          cursor: 'pointer', fontWeight: 500,
        },
      }, saved ? '✓ Saved' : 'Save')
    ),

    !serverProvided && React.createElement('div', {
      style: { fontSize: '11px', color: '#6b7280' },
    }, 'Get an API key from the Google Cloud Console with Maps Embed API and Places API enabled.')
  );
}
