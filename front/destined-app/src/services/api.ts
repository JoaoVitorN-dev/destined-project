const API_BASE_URL = 'http://localhost:3000';

// Função para obter o token do usuário do localStorage
export const getUserToken = (): string | null => {
  return localStorage.getItem('user-token');
};

// Função para salvar o token do usuário no localStorage
export const setUserToken = (token: string): void => {
  localStorage.setItem('user-token', token);
};

// Função para remover o token do usuário do localStorage
export const removeUserToken = (): void => {
  localStorage.removeItem('user-token');
};

interface User {
  _id: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  preference?: string;
  interests?: string[];
  profileImage?: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  preference?: string;
  interests?: string[];
  profileImage?: string;
}

interface LikeResponse {
  match: boolean;
  like: any;
  matchedUser: User | null;
  message?: string;
}

// API de usuários
export const api = {
  // Health check
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Login - buscar usuário existente
  async login(username: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const user = await response.json();
    // Salvar o token do usuário após o login
    setUserToken(user._id);
    return user;
  },

  // Register - criar novo usuário
  async register(username: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    const user = await response.json();
    // Salvar o token do usuário após o registro
    setUserToken(user._id);
    return user;
  },

  // Criar usuário (registro) - mantido para compatibilidade
  async createUser(username: string, password: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    
    const user = await response.json();
    // Salvar o token do usuário após o registro
    setUserToken(user._id);
    return user;
  },

  // Buscar todos os usuários (exceto o usuário atual)
  async getUsers(): Promise<User[]> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        'user-token': token,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  },

  // Buscar um usuário específico
  async getUser(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    
    return response.json();
  },

  // Atualizar perfil do usuário
  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'user-token': token,
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return response.json();
  },

  // Buscar dados do usuário atual
  async getCurrentUser(): Promise<User> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    return this.getUser(token);
  },

  // Dar like em um usuário
  async likeUser(userId: string): Promise<LikeResponse> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-token': token,
      },
      body: JSON.stringify({ curtidoId: userId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to like user');
    }
    
    return response.json();
  },

  // Buscar matches (usuários que deram match)
  async getMatches(): Promise<User[]> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/likes/matches`, {
      headers: {
        'user-token': token,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    
    return response.json();
  },

  // Buscar likes recebidos
  async getReceivedLikes(): Promise<User[]> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/likes/received`, {
      headers: {
        'user-token': token,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch received likes');
    }
    
    return response.json();
  },

  // Buscar likes enviados
  async getSentLikes(): Promise<User[]> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/likes/sent`, {
      headers: {
        'user-token': token,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch sent likes');
    }
    
    return response.json();
  },

  // ========== MENSAGENS ==========

  // Buscar histórico de mensagens com um usuário
  async getMessages(userId: string): Promise<any[]> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/messages/${userId}`, {
      headers: {
        'user-token': token,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return response.json();
  },

  // Enviar mensagem (HTTP - alternativa ao Socket.io)
  async sendMessage(receiverId: string, text: string): Promise<any> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-token': token,
      },
      body: JSON.stringify({ receiverId, text }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  },

  // Marcar mensagens como lidas
  async markMessagesAsRead(userId: string): Promise<void> {
    const token = getUserToken();
    if (!token) {
      throw new Error('No user token found');
    }

    const response = await fetch(`${API_BASE_URL}/messages/read/${userId}`, {
      method: 'PUT',
      headers: {
        'user-token': token,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark messages as read');
    }
  },
};
