import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

const SOCKET_URL = 'http://localhost:3000';

let socket: Socket | null = null;
const isConnected = ref(false);
const onlineUsers = ref<string[]>([]);

// Conectar ao Socket.io
export const connectSocket = (userId: string) => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Connected to Socket.io server');
    isConnected.value = true;
    
    // Registrar usuário
    socket?.emit('register-user', userId);
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from Socket.io server');
    isConnected.value = false;
  });

  socket.on('users-online', (users: string[]) => {
    console.log('👥 Users online:', users);
    onlineUsers.value = users;
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    isConnected.value = false;
  });

  return socket;
};

// Desconectar Socket.io
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected.value = false;
    onlineUsers.value = [];
    console.log('Socket disconnected manually');
  }
};

// Obter instância do socket
export const getSocket = () => {
  return socket;
};

// Enviar mensagem
export const sendMessage = (receiverId: string, text: string, senderId: string) => {
  if (!socket?.connected) {
    console.error('Socket not connected');
    return false;
  }

  socket.emit('send-message', {
    senderId,
    receiverId,
    text,
  });

  return true;
};

// Notificar que está digitando
export const sendTypingStatus = (receiverId: string, isTyping: boolean, senderId: string) => {
  if (!socket?.connected) return;

  socket.emit('typing', {
    senderId,
    receiverId,
    isTyping,
  });
};

// Listeners para eventos do socket
export const onNewMessage = (callback: (message: any) => void) => {
  socket?.on('new-message', callback);
};

export const onMessageSent = (callback: (message: any) => void) => {
  socket?.on('message-sent', callback);
};

export const onUserTyping = (callback: (data: { userId: string; isTyping: boolean }) => void) => {
  socket?.on('user-typing', callback);
};

export const onMessageError = (callback: (error: any) => void) => {
  socket?.on('message-error', callback);
};

// Remover listeners
export const offNewMessage = () => {
  socket?.off('new-message');
};

export const offMessageSent = () => {
  socket?.off('message-sent');
};

export const offUserTyping = () => {
  socket?.off('user-typing');
};

export const offMessageError = () => {
  socket?.off('message-error');
};

// Estado reativo
export const socketState = {
  isConnected,
  onlineUsers,
};
