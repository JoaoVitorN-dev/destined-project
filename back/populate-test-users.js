// Script para popular o banco de dados com usuários de teste
// Execute: node populate-test-users.js

import mongoose from "mongoose";
import User from "./models/User.js";
import mongod from "./db.js";

const testUsers = [
  {
    username: "maria_silva",
    password: "123456",
    firstName: "Maria",
    lastName: "Silva",
    dateOfBirth: new Date("1995-05-15"),
    gender: "Female",
    preference: "Male",
    interests: ["Music", "Fitness", "Traveling"]
  },
  {
    username: "joao_santos",
    password: "123456",
    firstName: "João",
    lastName: "Santos",
    dateOfBirth: new Date("1993-08-20"),
    gender: "Male",
    preference: "Female",
    interests: ["Cooking", "Swimming", "Video Games"]
  },
  {
    username: "ana_costa",
    password: "123456",
    firstName: "Ana",
    lastName: "Costa",
    dateOfBirth: new Date("1997-03-10"),
    gender: "Female",
    preference: "Male",
    interests: ["Art", "Music", "Speeches"]
  },
  {
    username: "pedro_oliveira",
    password: "123456",
    firstName: "Pedro",
    lastName: "Oliveira",
    dateOfBirth: new Date("1994-11-25"),
    gender: "Male",
    preference: "Female",
    interests: ["Extreme Sports", "Fitness", "Traveling"]
  },
  {
    username: "julia_ferreira",
    password: "123456",
    firstName: "Julia",
    lastName: "Ferreira",
    dateOfBirth: new Date("1996-07-08"),
    gender: "Female",
    preference: "Male",
    interests: ["Shopping", "Drinking", "Music"]
  },
  {
    username: "carlos_lima",
    password: "123456",
    firstName: "Carlos",
    lastName: "Lima",
    dateOfBirth: new Date("1992-12-30"),
    gender: "Male",
    preference: "Female",
    interests: ["Video Games", "Cooking", "Swimming"]
  },
  {
    username: "alex_souza",
    password: "123456",
    firstName: "Alex",
    lastName: "Souza",
    dateOfBirth: new Date("1995-09-14"),
    gender: "Other",
    preference: "Both",
    interests: ["Art", "Music", "Traveling", "Fitness"]
  }
];

async function populateDatabase() {
  try {
    await mongoose.connect(mongod.getUri());
    console.log("✅ Connected to MongoDB");

    // Limpar usuários de teste existentes (opcional)
    // await User.deleteMany({ username: { $in: testUsers.map(u => u.username) } });
    // console.log("🗑️ Cleared existing test users");

    // Inserir novos usuários
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
        console.log(`⚠️ User ${userData.username} already exists, skipping...`);
        continue;
      }

      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.username} (${user.gender}, prefers ${user.preference})`);
    }

    console.log("\n🎉 Database populated successfully!");
    console.log("\n📊 Summary:");
    console.log(`Total users created: ${testUsers.length}`);
    console.log(`Males (prefer Female): ${testUsers.filter(u => u.gender === 'Male').length}`);
    console.log(`Females (prefer Male): ${testUsers.filter(u => u.gender === 'Female').length}`);
    console.log(`Other (prefer Both): ${testUsers.filter(u => u.gender === 'Other').length}`);
    
    console.log("\n🔑 Login credentials (all passwords: 123456):");
    testUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.gender}, prefers ${user.preference})`);
    });

  } catch (error) {
    console.error("❌ Error populating database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

populateDatabase();
