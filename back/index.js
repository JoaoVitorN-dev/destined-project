import express from "express";
import cors from "cors";
import mongod from "./db.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import Like from "./models/Like.js";

const server = express();
server.use(cors());
server.use(express.json());

const authMiddleware = async (req, res, next) => {
    const userId = req.headers["user-token"];
    const user = await User.findById(userId);
    req.current_user = user;
    next();
}

mongoose.connect(mongod.getUri()).then(() => {
    server.get("/health", (_,res) => {
        res.send({message: "Alive"});
    });

    server.post("/users", async (req, res) => {
        const {
            username,
            password
        } = req.body;

        const user = await User.create({username, password});
        res.send(user);
    });

    server.get("/users", authMiddleware, async (req, res) => {
        const users = await User.find({ _id: { $ne: req.current_user._id } });
        res.send(users);
    });

    server.get("/users/:id", async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        res.send(user);
    });

    server.post("/likes", authMiddleware, async (req, res) => {
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

    server.get("/likes/matches", authMiddleware, async (req, res) => {
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

    server.get("/likes/received", authMiddleware, async (req, res) => {
        // Buscar likes que o usuário recebeu
        const receivedLikes = await Like.find({ curtido: req.current_user._id })
            .populate('curtidor');
        
        const users = receivedLikes.map(like => like.curtidor);
        res.send(users);
    });

    server.get("/likes/sent", authMiddleware, async (req, res) => {
        // Buscar likes que o usuário enviou
        const sentLikes = await Like.find({ curtidor: req.current_user._id })
            .populate('curtido');
        
        const users = sentLikes.map(like => like.curtido);
        res.send(users);
    });
    server.listen(3000, () => {
        console.log("Server rodando na porta http://localhost:3000");
    });
}).catch((e) => {
    console.log("Error", e);
})