import { apiVersion, baseUrl } from '../config/globals';

export function getAccessToken() {
	return localStorage.getItem('accessToken') || '';
}

export function setAccessToken(token) {
	if (token) localStorage.setItem('accessToken', token);
	else localStorage.removeItem('accessToken');
}

export async function doRefreshToken() {
	try {
		const resp = await fetch(`${baseUrl}/refresh`, {
			method: 'POST',
			headers: {
				Accept: `application/vnd.myapp.${apiVersion}+json`,
			},
			credentials: 'include', // send HttpOnly refresh token cookie
		});

		const json = await resp.json();
		if (!resp.ok) {
			console.warn(
				'Automatic token refresh failed:',
				json.message || resp.status,
			);
			// If refresh itself fails (e.g. refresh token expired),
			// you might choose to log the user out here:
			// setAccessToken("");
			// clearInterval(refreshTimerId);
			return;
		}

		// Extract the new accessToken and store it
		const { accessToken: newToken } = json.data;
		setAccessToken(newToken);
		console.log(
			'🔄 Token automatically refreshed at',
			new Date().toLocaleTimeString(),
		);
	} catch (err) {
		console.error('Network error during token refresh:', err);
	}
}
