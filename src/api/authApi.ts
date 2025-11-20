import apiClient from './axiosConfig';

export const login = async (username: string, password: string, deviceName: string) => {
    const device = navigator.userAgent;
    const response = await apiClient.post('/login', {
        username,
        password,
        device_name: deviceName,
        device,
    });

    if (response.data.status !== 'success') {
        // Explicitly throw an error if the login status indicates failure
        throw new Error(response.data.message || 'Login failed');
    }

    return response.data.token; // Return token on success
};
