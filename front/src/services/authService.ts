const API_URL = 'http://localhost:80/api';

export interface LoginResponse {
    token: string;
}

export interface UserResponse {
    email: string;
    roles: string[];
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    try {
        const response = await fetch(`${API_URL}/login_check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur de connexion');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data;
        }

        throw new Error('Token non trouvé dans la réponse');
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
}

export async function register(email: string, password: string): Promise<{ message: string }> {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'inscription');
        }

        return response.json();
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
    }
}

export function logout(): void {
    localStorage.removeItem('token');
}

export function isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function getAuthHeaders(): { [key: string]: string } {
    const token = getToken();
    return token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    } : {
        'Content-Type': 'application/json',
    };
}

export async function getCurrentUser(): Promise<UserResponse> {
    try {
        const response = await fetch(`${API_URL}/me`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to get current user');
        }

        return response.json();
    } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
    }
} 