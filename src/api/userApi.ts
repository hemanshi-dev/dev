import apiClient from './axiosConfig';

export const fetchUser = async () => {
    const response = await apiClient.get('/user');
    return response.data.data;
};


export const signUp = async (data: any) => {
    return await apiClient.post('/signup', data);
}