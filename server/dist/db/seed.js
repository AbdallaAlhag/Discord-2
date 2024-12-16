"use strict";
// import prisma from './prisma';
// async function main() {
//   // Create users
//   const user1 = await prisma.user.create({
//     data: {
//       username: 'user_one',
//       email: 'user1@example.com',
//       password: 'password1',
//     },
//   });
//   const user2 = await prisma.user.create({
//     data: {
//       username: 'user_two',
//       email: 'user2@example.com',
//       password: 'password2',
//     },
//   });
//   const user3 = await prisma.user.create({
//     data: {
//       username: 'user_three',
//       email: 'user3@example.com',
//       password: 'password3',
//     },
//   });
//   // Create servers
//   const server1 = await prisma.server.create({
//     data: {
//       name: 'Tech Enthusiasts',
//       iconUrl: 'https://example.com/icon1.png',
//       members: {
//         create: [
//           { userId: user1.id },
//           { userId: user2.id },
//           { userId: user3.id },
//         ],
//       },
//     },
//   });
//   const server2 = await prisma.server.create({
//     data: {
//       name: 'Gaming Hub',
//       iconUrl: 'https://example.com/icon2.png',
//       members: {
//         create: [{ userId: user1.id }, { userId: user2.id }],
//       },
//     },
//   });
//   // Create channels
//   const generalChannel = await prisma.channel.create({
//     data: {
//       name: 'general',
//       isVoice: false,
//       serverId: server1.id,
//     },
//   });
//   const techNewsChannel = await prisma.channel.create({
//     data: {
//       name: 'tech-news',
//       isVoice: false,
//       serverId: server1.id,
//     },
//   });
//   const gamingChannel = await prisma.channel.create({
//     data: {
//       name: 'gaming-talk',
//       isVoice: false,
//       serverId: server2.id,
//     },
//   });
//   // Create messages
//   await prisma.message.createMany({
//     data: [
//       {
//         content: 'Welcome to the server!',
//         userId: user1.id,
//         channelId: generalChannel.id,
//       },
//       {
//         content: 'Hey everyone!',
//         userId: user2.id,
//         channelId: generalChannel.id,
//       },
//       {
//         content: 'Did you see the latest tech news?',
//         userId: user3.id,
//         channelId: techNewsChannel.id,
//       },
//       {
//         content: 'Who wants to play tonight?',
//         userId: user1.id,
//         channelId: gamingChannel.id,
//       },
//     ],
//   });
// // Create roles
// const adminRole = await prisma.role.create({
//     data: {
//       name: 'Admin',
//       serverId: server1.id, // Include the serverId
//       permissions: {
//         create: [{ serverId: server1.id, userId: user1.id }],
//       },
//     },
//   });
//   const memberRole = await prisma.role.create({
//     data: {
//       name: 'Member',
//       serverId: server1.id, // Include the serverId
//       permissions: {
//         create: [{ serverId: server1.id, userId: user2.id }],
//       },
//     },
//   });
//   // Create friendships
//   await prisma.friend.createMany({
//     data: [
//       { userId: user1.id, friendId: user2.id },
//       { userId: user2.id, friendId: user3.id },
//       { userId: user1.id, friendId: user3.id },
//     ],
//   });
//   console.log('Database has been seeded successfully!');
// }
// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
