require('dotenv').config();
const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

router.post('/create', function(req, res, next) {
    async function run() {
        try {
            await client.connect();
            const database = client.db('test');
            const collection = database.collection('notifications');
            const { type, senderId, senderUsername, receiverId, groupId, groupName } = req.body;

            let notificationData = {
                type,
                senderId,
                senderUsername,
                receiverId,
                createdAt: new Date()
            };

            if (type === 'group_invite') {
                notificationData.groupId = groupId;
                notificationData.groupName = groupName;
            }

            const result = await collection.insertOne(notificationData);
            res.status(201).json({ success: true, notificationId: result.insertedId });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});

// 获取用户的所有通知
router.get('/:userId', function(req, res, next) {
    async function run() {
        try {
            await client.connect();
            const database = client.db('test');
            const collection = database.collection('notifications');
            const { userId } = req.params;

            const notifications = await collection.find({ receiverId: userId }).sort({ createdAt: -1 }).toArray();
            res.status(200).json(notifications);
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});

// 接受通知
router.post('/:id/accept', function(req, res, next) {
    async function run() {
        try {
            await client.connect();
            const database = client.db('test');
            const collection = database.collection('notifications');
            const { id } = req.params;
            const notification = await collection.findOne({ _id: new MongoClient.ObjectId(id) });

            if (!notification) {
                res.status(404).json({ success: false, message: "Notification not found." });
                return;
            }

            if (notification.type === 'friend_request') {
                const userCollection = database.collection('users');
                const { senderId, receiverId } = notification;
                const sender = await userCollection.findOne({ _id: new MongoClient.ObjectId(senderId) });
                const receiver = await userCollection.findOne({ _id: new MongoClient.ObjectId(receiverId) });

                if (sender && receiver) {
                    sender.friends = sender.friends || [];
                    receiver.friends = receiver.friends || [];
                    sender.friends.push({ id: receiverId, username: receiver.username });
                    receiver.friends.push({ id: senderId, username: sender.username });

                    await userCollection.updateOne({ _id: new MongoClient.ObjectId(senderId) }, { $set: { friends: sender.friends } });
                    await userCollection.updateOne({ _id: new MongoClient.ObjectId(receiverId) }, { $set: { friends: receiver.friends } });

                    await collection.deleteOne({ _id: new MongoClient.ObjectId(id) });
                    res.status(200).json({ success: true, message: "Friend request accepted." });
                } else {
                    res.status(404).json({ success: false, message: "User not found." });
                }
            } else if (notification.type === 'group_invite') {
                const groupCollection = database.collection('groups');
                const userCollection = database.collection('users');
                const { groupId, receiverId } = notification;
                const group = await groupCollection.findOne({ _id: new MongoClient.ObjectId(groupId) });
                const user = await userCollection.findOne({ _id: new MongoClient.ObjectId(receiverId) });

                if (group && user) {
                    group.members = group.members || [];
                    user.groups = user.groups || [];
                    group.members.push(receiverId);
                    user.groups.push(groupId);

                    await groupCollection.updateOne({ _id: new MongoClient.ObjectId(groupId) }, { $set: { members: group.members } });
                    await userCollection.updateOne({ _id: new MongoClient.ObjectId(receiverId) }, { $set: { groups: user.groups } });

                    await collection.deleteOne({ _id: new MongoClient.ObjectId(id) });
                    res.status(200).json({ success: true, message: "Group invite accepted." });
                } else {
                    res.status(404).json({ success: false, message: "Group or user not found." });
                }
            } else {
                res.status(400).json({ success: false, message: "Invalid notification type." });
            }
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});

// 拒绝通知
router.post('/:id/decline', function(req, res, next) {
    async function run() {
        try {
            await client.connect();
            const database = client.db('test');
            const collection = database.collection('notifications');
            const { id } = req.params;

            const result = await collection.deleteOne({ _id: new MongoClient.ObjectId(id) });
            if (result.deletedCount > 0) {
                res.status(200).json({ success: true, message: "Notification declined." });
            } else {
                res.status(404).json({ success: false, message: "Notification not found." });
            }
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});

module.exports = router;
