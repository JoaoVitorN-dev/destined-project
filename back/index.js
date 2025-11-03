import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import mongod from "./db.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Like from "./models/Like.js";
import Message from "./models/Message.js";

const app = express();
app.use(cors());
app.use(express.json());

// Criar servidor HTTP e Socket.io
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

// Armazenar conexões de usuários online
const onlineUsers = new Map(); // userId -> socketId

const authMiddleware = async (req, res, next) => {
    const userId = req.headers["user-token"];
    const user = await User.findById(userId);
    req.current_user = user;
    next();
}

mongoose.connect(mongod.getUri()).then(() => {
    app.get("/health", (_,res) => {
        res.send({message: "Alive"});
    });

    // Debug endpoint - verificar dados do usuário atual
    app.get("/debug/me", authMiddleware, async (req, res) => {
        res.send({
            user: req.current_user,
            message: "Current user data"
        });
    });

    // Login endpoint - verificar se usuário existe
    app.post("/auth/login", async (req, res) => {
        const { username, password } = req.body;

        try {
            // Buscar usuário por username
            const user = await User.findOne({ username });
            
            if (!user) {
                return res.status(404).send({ error: "User not found" });
            }

            // Verificar senha (em produção, usar bcrypt)
            if (user.password !== password) {
                return res.status(401).send({ error: "Invalid password" });
            }

            console.log("User logged in:", username);
            res.send(user);
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).send({ error: "Login failed" });
        }
    });

    // Register endpoint - criar novo usuário
    app.post("/auth/register", async (req, res) => {
        const { username, password } = req.body;

        try {
            // Verificar se usuário já existe
            const existingUser = await User.findOne({ username });
            
            if (existingUser) {
                return res.status(409).send({ error: "Username already exists" });
            }

            // Criar novo usuário
            const user = await User.create({ username, password });
            console.log("User registered:", username);
            res.send(user);
        } catch (error) {
            console.error("Register error:", error);
            res.status(500).send({ error: "Registration failed" });
        }
    });

    // Endpoint antigo mantido para compatibilidade
    app.post("/users", async (req, res) => {
        const {
            username,
            password
        } = req.body;

        // Tentar fazer login primeiro
        let user = await User.findOne({ username });
        
        // Se não existe, criar novo
        if (!user) {
            user = await User.create({username, password});
            console.log("New user created via /users:", username);
        } else {
            console.log("Existing user found via /users:", username);
        }
        
        res.send(user);
    });

    app.get("/users", authMiddleware, async (req, res) => {
        console.log('Current user:', req.current_user.username, 'preference:', req.current_user.preference); // Debug
        
        // Buscar usuários excluindo o usuário atual
        let query = { _id: { $ne: req.current_user._id } };
        
        // Se o usuário tem preferência definida, filtrar por gênero
        if (req.current_user.preference && req.current_user.preference !== 'Both') {
            query.gender = req.current_user.preference;
            console.log('Filtering by gender:', query.gender); // Debug
        }
        
        // Excluir usuários que já foram curtidos
        const likedUsers = await Like.find({ curtidor: req.current_user._id });
        const likedUserIds = likedUsers.map(like => like.curtido.toString());
        
        if (likedUserIds.length > 0) {
            // Corrigir: não sobrescrever o $ne, adicionar $nin
            query._id = { 
                $ne: req.current_user._id,
                $nin: likedUserIds 
            };
        }
        
        console.log('Query:', JSON.stringify(query)); // Debug
        const users = await User.find(query);
        console.log('Found users:', users.length); // Debug
        res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        res.send(user);
    });

    app.put("/users/:id", authMiddleware, async (req, res) => {
        const userId = req.params.id;
        
        // Verificar se o usuário está atualizando seu próprio perfil
        if (req.current_user._id.toString() !== userId) {
            return res.status(403).send({ error: "Forbidden" });
        }

        const {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            preference,
            interests,
            profileImage
        } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                dateOfBirth,
                gender,
                preference,
                interests,
                profileImage
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        res.send(user);
    });

    app.post("/likes", authMiddleware, async (req, res) => {
        const {
            curtidoId
        } = req.body;

        const curtido = await User.findById(curtidoId);

        if (!curtido) {
            return res.status(404).send({ error: "User not found" });
        }

        // Verificar se já existe o like para evitar duplicatas
        const existingLike = await Like.findOne({
            curtido: curtidoId,
            curtidor: req.current_user._id
        });

        if (existingLike) {
            return res.send({ match: false, message: "Already liked" });
        }

        const like = await Like.create({
            curtido: curtidoId,
            curtidor: req.current_user._id
        });

        // Verificar se é um match (o outro usuário também curtiu)
        const itsAMatch = await Like.findOne({
            curtido: req.current_user._id,
            curtidor: curtidoId
        });

        res.send({ 
            match: !!itsAMatch, 
            like,
            matchedUser: itsAMatch ? curtido : null 
        });
    });

    app.get("/likes/matches", authMiddleware, async (req, res) => {
        // Buscar likes que o usuário deu
        const myLikes = await Like.find({ curtidor: req.current_user._id });
        const myLikedIds = myLikes.map(like => like.curtido.toString());

        // Buscar likes que o usuário recebeu
        const receivedLikes = await Like.find({ curtido: req.current_user._id });
        const receivedLikedIds = receivedLikes.map(like => like.curtidor.toString());

        // Encontrar matches (interseção)
        const matchIds = myLikedIds.filter(id => receivedLikedIds.includes(id));

        // Buscar informações dos usuários que deram match
        const matches = await User.find({ _id: { $in: matchIds } });

        res.send(matches);
    });

    app.get("/likes/received", authMiddleware, async (req, res) => {
        // Buscar likes que o usuário recebeu
        const receivedLikes = await Like.find({ curtido: req.current_user._id })
            .populate('curtidor');
        
        const users = receivedLikes.map(like => like.curtidor);
        res.send(users);
    });

    app.get("/likes/sent", authMiddleware, async (req, res) => {
        // Buscar likes que o usuário enviou
        const sentLikes = await Like.find({ curtidor: req.current_user._id })
            .populate('curtido');
        
        const users = sentLikes.map(like => like.curtido);
        res.send(users);
    });

    // ========== ENDPOINTS DE MENSAGENS ==========

    // Buscar histórico de mensagens entre dois usuários
    app.get("/messages/:userId", authMiddleware, async (req, res) => {
        const otherUserId = req.params.userId;
        const currentUserId = req.current_user._id;

        try {
            const messages = await Message.find({
                $or: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId }
                ]
            })
            .sort({ createdAt: 1 })
            .limit(100);

            res.send(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).send({ error: "Failed to fetch messages" });
        }
    });

    // Enviar mensagem (também via HTTP, além do Socket.io)
    app.post("/messages", authMiddleware, async (req, res) => {
        const { receiverId, text } = req.body;
        const senderId = req.current_user._id;

        try {
            const message = await Message.create({
                senderId,
                receiverId,
                text
            });

            // Emitir via Socket.io se o destinatário estiver online
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("new-message", message);
            }

            res.send(message);
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).send({ error: "Failed to send message" });
        }
    });

    // Marcar mensagens como lidas
    app.put("/messages/read/:userId", authMiddleware, async (req, res) => {
        const otherUserId = req.params.userId;
        const currentUserId = req.current_user._id;

        try {
            await Message.updateMany(
                { senderId: otherUserId, receiverId: currentUserId, read: false },
                { read: true }
            );

            res.send({ success: true });
        } catch (error) {
            console.error("Error marking messages as read:", error);
            res.status(500).send({ error: "Failed to mark messages as read" });
        }
    });

    // ========== SOCKET.IO ==========

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Registrar usuário online
        socket.on("register-user", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
            
            // Notificar todos sobre usuários online
            io.emit("users-online", Array.from(onlineUsers.keys()));
        });

        // Enviar mensagem em tempo real
        socket.on("send-message", async (data) => {
            const { senderId, receiverId, text } = data;

            try {
                // Salvar no banco
                const message = await Message.create({
                    senderId,
                    receiverId,
                    text
                });

                // Enviar para o remetente (confirmação)
                socket.emit("message-sent", message);

                // Enviar para o destinatário se estiver online
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("new-message", message);
                }
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("message-error", { error: "Failed to send message" });
            }
        });

        // Notificar que está digitando
        socket.on("typing", (data) => {
            const { receiverId, isTyping } = data;
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("user-typing", {
                    userId: data.senderId,
                    isTyping
                });
            }
        });

        // Desconexão
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            
            // Remover usuário da lista de online
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User ${userId} removed from online list`);
                    break;
                }
            }

            // Notificar todos sobre usuários online atualizados
            io.emit("users-online", Array.from(onlineUsers.keys()));
        });
    });

    server.listen(3000, () => {
        console.log("Server rodando na porta http://localhost:3000");
        console.log("Socket.io pronto para conexões");
    });
}).catch((e) => {
    console.log("Error", e);
})