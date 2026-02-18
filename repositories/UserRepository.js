import User from "../models/User";

class UserRepository {
    async create(user) {
        return await User.create(user);
    }

    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
    }
    
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async update(id, user) {
        return await User.findByIdAndUpdate(id, user, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }
}

export default new UserRepository();