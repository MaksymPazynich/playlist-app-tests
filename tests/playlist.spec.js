import { test, expect } from '@playwright/test';
import { convertToSeconds } from '../utils/helpers';

// Test suite for Playlist App
test.describe('Playlist App UI Tests', () => {
  // Test 1: Search Functionality (fixed selector and wait)
  test('User can filter tracks using the search input', async ({ page }) => {
    // Navigate to the app
    await page.goto('https://vite-react-alpha-lemon.vercel.app/');
    // Find search input and ensure it's visible
    const searchInput = page.getByRole('textbox', { name: 'Search' });
    await expect(searchInput).toBeVisible();
    // Enter 'summer'
    await searchInput.fill('summer');
    // Wait for filtering to complete
    await page.waitForTimeout(1000);
    // Find all tracks (divs with duration and '+' button)
    const trackList = page.locator('div').filter({ hasText: /\d{2}:\d{2}\+$/ });
    const visibleTracks = await trackList.all();
    // Check that each visible track contains 'summer'
    for (const track of visibleTracks) {
      const trackName = await track.textContent();
      expect(trackName.toLowerCase()).toContain('summer');
    }
    // Ensure at least one track is visible
    expect(visibleTracks.length).toBeGreaterThan(0);
  });

  // Test 2: Add Track (fixed selector)
  test('User can add a track to the playlist using the "+" button', async ({ page }) => {
    // Navigate to the app
    await page.goto('https://vite-react-alpha-lemon.vercel.app/');
    // Find all tracks with a '+' button
    const trackList = page.locator('div').filter({ has: page.locator('button.MuiButtonBase-root') });
    // Select the first track and get its name
    const firstTrack = trackList.first();
    const trackName = await firstTrack.textContent();
    // Click the '+' button using Material-UI class
    await firstTrack.locator('button.MuiButtonBase-root').click();
    // Wait for playlist update
    await page.waitForTimeout(1000);
    // Find playlist tracks
    const playlist = page.locator('div').filter({ hasText: /^Your playlist$/ }).locator('..').locator('div');
    const playlistTracks = await playlist.all();
    // Get names of tracks in playlist
    const playlistTrackNames = await Promise.all(
      playlistTracks.map(async (track) => await track.textContent())
    );
    // Check that the added track is in the playlist
    expect(playlistTrackNames.some((name) => name.includes(trackName.split('+')[0].trim()))).toBeTruthy();
  });

  // Test 3: Total Duration (fixed selector)
  test('Total playlist duration is accurately displayed in seconds', async ({ page }) => {
    // Navigate to the app
    await page.goto('https://vite-react-alpha-lemon.vercel.app/');
    // Find all tracks with a '+' button
    const trackList = page.locator('div').filter({ has: page.locator('button.MuiButtonBase-root') });
    // Select first and second tracks
    const firstTrack = trackList.first();
    const secondTrack = trackList.nth(1);
    // Get durations
    const firstDuration = await firstTrack.textContent().then((text) => text.match(/\d{2}:\d{2}/)[0]);
    const secondDuration = await secondTrack.textContent().then((text) => text.match(/\d{2}:\d{2}/)[0]);
    // Add tracks to playlist using Material-UI class
    await firstTrack.locator('button.MuiButtonBase-root').click();
    await secondTrack.locator('button.MuiButtonBase-root').click();
    // Wait for UI update
    await page.waitForTimeout(1000);
    // Find total duration display
    const totalDurationDisplay = page.locator('div').filter({ hasText: /Total duration: \d+ seconds/ });
    // Get displayed duration
    const displayedDuration = await totalDurationDisplay.textContent().then((text) => parseInt(text.match(/\d+/)[0]));
    // Calculate expected duration
    const expectedDuration = convertToSeconds(firstDuration) + convertToSeconds(secondDuration);
    // Check that displayed duration matches expected
    expect(displayedDuration).toEqual(expectedDuration);
  });
});
