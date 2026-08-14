import { baseAPI } from './base.api';

export const logoutApi = () => baseAPI('/logout', 'GET');