import { apiVersion } from '../config/globals';
import { doRefreshToken, getAccessToken } from './token';

export async function request(path, options = {}) {
	const token = getAccessToken();
	// Merge in headers needed for all authenticated calls
	const defaultHeaders = {
		'Content-Type': 'application/json',
		Accept: `application/vnd.myapp.${apiVersion}+json`,
		Authorization: token ? `Bearer ${token}` : '',
	};

	// If options.credentials is not set, set it to 'include' so that
	// cookies (e.g. refresh‐token cookie) will get sent when we call /refresh
	const credentials = options.credentials || 'include';

	// Build the fetch options
	const fetchOpts = {
		...options,
		headers: { ...(options.headers || {}), ...defaultHeaders },
		credentials,
	};

	// First attempt
	let resp = await fetch(path, fetchOpts);
	if (resp.status !== 401) {
		return resp; // either success or another error—let caller handle it
	}

	// If status is 401 → try “refresh” once
	console.warn('401 received. Attempting to refresh token...');
	const refreshed = await doRefreshToken();
	const newToken = getAccessToken();
	if (!newToken) {
		// If refresh failed (no new token), just return the original 401
		return resp;
	}

	// Retry the original request with the new token
	fetchOpts.headers.Authorization = `Bearer ${newToken}`;
	resp = await fetch(path, fetchOpts);
	return resp;
}
