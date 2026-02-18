import UserRepository from "@/repositories/UserRepository";

class UserService {
    async createUser(data) {
      const existingUser = await UserRepository.findByEmail(data.email);
  
      if (existingUser) {
        throw new Error("Email já cadastrado");
      }
  
      return await UserRepository.create(data);
    }
  
    async getAllUsers() {
      return await UserRepository.findAll();
    }
  
    async updateUser(id, data) {
      return await UserRepository.update(id, data);
    }
  
    async deleteUser(id) {
      return await UserRepository.delete(id);
    }
  }
  
export default new UserService();