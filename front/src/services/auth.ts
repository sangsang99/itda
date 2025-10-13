import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  userType: string;
}

export interface User {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  userType: string;
}

class AuthService {
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', loginData);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    this.clearAuth();
  }

  saveAuth(authData: LoginResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({
      userId: authData.userId,
      username: authData.username,
      email: authData.email,
      fullName: authData.fullName,
      userType: authData.userType,
    }));
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();