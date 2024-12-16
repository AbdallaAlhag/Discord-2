"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getFriendsInfo = exports.getServersInfo = void 0;
const Queries_1 = require("../db/Queries");
const getServersInfo = async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        const servers = await (0, Queries_1.getServers)(userId);
        res.status(200).json({ servers });
    }
    catch (err) {
        if (!res.headersSent) {
            next(err); // Passes the error to the error handler only if headers aren't sent
        }
    }
};
exports.getServersInfo = getServersInfo;
const getFriendsInfo = async (req, res, next) => {
    try {
        const userId = Number(req.params.userId);
        const friends = await (0, Queries_1.getFriends)(userId);
        res.status(200).json({ friends });
    }
    catch (err) {
        if (!res.headersSent) {
            next(err); // Passes the error to the error handler only if headers aren't sent
        }
    }
};
exports.getFriendsInfo = getFriendsInfo;
const getUserInfo = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const user = await (0, Queries_1.getUser)(userId);
        // console.log(user);
        res.status(200).json({ user });
    }
    catch (err) {
        if (!res.headersSent) {
            next(err); // Passes the error to the error handler only if headers aren't sent
        }
    }
};
exports.getUserInfo = getUserInfo;
