import { test, expect } from '@playwright/test';
import { convertToSeconds } from '../utils/helpers';

test.describe('Playlist App UI Tests', () => {
  test('User can filter tracks using the search input', async ({ page }) => {
    await page.goto('https://vite-react-alpha-lemon.vercel.app/');
    const searchInput = page.getByRole('textbox', { name: 'Search' });
    await expect(searchInput).toBeVisible();
    await searchInput.fill('summer');
    await page.waitForTimeout(1000);
    const trackList = page.locator('div').filter({ hasText: /\d{2}:\d{2}\+$/ });
    const visibleTracks = await trackList.all();
    for (const track of visibleTracks) {
      const trackName = await track.textContent();
      expect(trackName.toLowerCase()).toContain('summer');
    }
    expect(visibleTracks.length).toBeGreaterThan(0);
  });

  test('User can add a track to the playlist using the "+" button', async ({ page }) => {
    await page.goto('https://vite-react-alpha-lemon.vercel.app/');
    const trackList = page.locator('div').filter({ has: page.locator('button.MuiButtonBase-root') });
    const firstTrack = trackList.first();
    const trackName = await firstTrack.textContent();
    await firstTrack.locator('button.MuiButtonBase-root').click();
    await page.waitForTimeout(1000);
    const playlist = page.locator('div').filter({ hasText: /^Your playlist$/ }).locator('..').locator('div');
    const playlistTracks = await playlist.all();
    const playlistTrackNames = await Promise.all(
      playlistTracks.map(async (track) => await track.textContent())
    );
    expect(playlistTrackNames.some((name) => name.includes(trackName.split('+')[0].trim()))).toBeTruthy();
  });

  test('Total playlist duration is accurately displayed in seconds', async ({ page }) => {
    await page.goto('https://vite-react-alpha-lemon.vercel.app/');
    const trackList = page.locator('div').filter({ has: page.locator('button.MuiButtonBase-root') });
    const firstTrack = trackList.first();
    const secondTrack = trackList.nth(1);
    const firstDuration = await firstTrack.textContent().then((text) => text.match(/\d{2}:\d{2}/)[0]);
    const secondDuration = await secondTrack.textContent().then((text) => text.match(/\d{2}:\d{2}/)[0]);
    await firstTrack.locator('button.MuiButtonBase-root').click();
    await secondTrack.locator('button.MuiButtonBase-root').click();
    await page.waitForTimeout(1000);
    const totalDurationDisplay = page.locator('div').filter({ hasText: /Total duration: \d+ seconds/ });
    const displayedDuration = await totalDurationDisplay.textContent().then((text) => parseInt(text.match(/\d+/)[0]));
    const expectedDuration = convertToSeconds(firstDuration) + convertToSeconds(secondDuration);
    expect(displayedDuration).toEqual(expectedDuration);
  });
});

