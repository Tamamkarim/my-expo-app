import {fetchData} from '../utils/fetch-data';
import type {MediaItem} from '../types/DBTypes';
import type {RegisterInputs} from '../contexts/UserContext';
import Constants from 'expo-constants';

interface AvailabilityResponse {
	available: boolean;
}

interface NewMediaPayload {
	title: string;
	description?: string;
	filename: string;
	media_type: string;
}

export const postUser = async (data: RegisterInputs): Promise<boolean> => {
	try {
		const {confirmPassword, ...payload} = data;
		const authApi = Constants.expoConfig?.extra?.EXPO_PUBLIC_AUTH_API ?? '';
		await fetchData<unknown>(
			`${authApi}/users`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			},
		);
		return true;
	} catch (error) {
		console.error('User registration failed', error);
		return false;
	}
};

export const checkUsernameAvailable = async (
	username: string,
): Promise<boolean> => {
	try {
		const authApi = Constants.expoConfig?.extra?.EXPO_PUBLIC_AUTH_API ?? '';
		const result = await fetchData<AvailabilityResponse>(
			`${authApi}/users/username/${encodeURIComponent(
				username,
			)}`,
		);
		return result.available;
	} catch (error) {
		console.error('Checking username availability failed', error);
		// On network error, don't block the user from continuing;
		// backend will still enforce uniqueness when posting the user.
		return true;
	}
};

export const checkEmailAvailable = async (email: string): Promise<boolean> => {
	try {
		const authApi = Constants.expoConfig?.extra?.EXPO_PUBLIC_AUTH_API ?? '';
		const result = await fetchData<AvailabilityResponse>(
			`${authApi}/users/email/${encodeURIComponent(
				email,
			)}`,
		);
		return result.available;
	} catch (error) {
		console.error('Checking email availability failed', error);
		// On network error, allow the form to proceed; backend will validate.
		return true;
	}
};

export const postMedia = async (
	data: NewMediaPayload,
	token: string,
): Promise<MediaItem | null> => {
	try {
		const mediaApi = Constants.expoConfig?.extra?.EXPO_PUBLIC_MEDIA_API ?? '';
		const created = await fetchData<MediaItem>(
			`${mediaApi}/media`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(data),
			},
		);
		return created;
	} catch (error) {
		console.error('Posting media failed', error);
		return null;
	}
};

