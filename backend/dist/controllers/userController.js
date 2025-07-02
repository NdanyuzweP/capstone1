"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getRegularUsers = exports.getDrivers = exports.getUserStats = exports.deleteUser = exports.updateUserRole = exports.updateUserStatus = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const getAllUsers = async (req, res) => {
    try {
        const { role, isActive, page = 1, limit = 10 } = req.query;
        let query = {};
        if (role)
            query.role = role;
        if (isActive !== undefined)
            query.isActive = isActive === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const users = await User_1.default.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await User_1.default.countDocuments(query);
        res.json({
            users,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalUsers: total,
                hasNext: skip + users.length < total,
                hasPrev: Number(page) > 1,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUserById = getUserById;
const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const userId = req.params.id;
        const currentUserId = req.user.id;
        if (userId === currentUserId && isActive === false) {
            return res.status(400).json({ error: 'Cannot deactivate your own account' });
        }
        const user = await User_1.default.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateUserStatus = updateUserStatus;
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;
        const currentUserId = req.user.id;
        if (userId === currentUserId) {
            return res.status(400).json({ error: 'Cannot change your own role' });
        }
        const user = await User_1.default.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            message: 'User role updated successfully',
            user,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.updateUserRole = updateUserRole;
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.user.id;
        if (userId === currentUserId) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }
        const user = await User_1.default.findByIdAndUpdate(userId, { isActive: false }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.deleteUser = deleteUser;
const getUserStats = async (req, res) => {
    try {
        const stats = await Promise.all([
            User_1.default.countDocuments({ role: 'user', isActive: true }),
            User_1.default.countDocuments({ role: 'driver', isActive: true }),
            User_1.default.countDocuments({ role: 'admin', isActive: true }),
            User_1.default.countDocuments({ isActive: false }),
            User_1.default.countDocuments({}),
        ]);
        res.json({
            stats: {
                activeUsers: stats[0],
                activeDrivers: stats[1],
                activeAdmins: stats[2],
                inactiveUsers: stats[3],
                totalUsers: stats[4],
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getUserStats = getUserStats;
const getDrivers = async (req, res) => {
    try {
        const { isActive = true, page = 1, limit = 10 } = req.query;
        let query = { role: 'driver' };
        if (isActive !== undefined)
            query.isActive = isActive === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const drivers = await User_1.default.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await User_1.default.countDocuments(query);
        res.json({
            drivers,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalDrivers: total,
                hasNext: skip + drivers.length < total,
                hasPrev: Number(page) > 1,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getDrivers = getDrivers;
const getRegularUsers = async (req, res) => {
    try {
        const { isActive = true, page = 1, limit = 10 } = req.query;
        let query = { role: 'user' };
        if (isActive !== undefined)
            query.isActive = isActive === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const users = await User_1.default.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await User_1.default.countDocuments(query);
        res.json({
            users,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalUsers: total,
                hasNext: skip + users.length < total,
                hasPrev: Number(page) > 1,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getRegularUsers = getRegularUsers;
const createUser = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;
        const user = new User_1.default({ name, email, phone, password, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};
exports.createUser = createUser;
//# sourceMappingURL=userController.js.map