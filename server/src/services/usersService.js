const prisma = require("../config/database");
const bcrypt = require("bcryptjs");

class UsersService {
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        role: userData.role || "USER",
      },
    });
  }

  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await prisma.user.findMany();
  }
}

module.exports = new UsersService();
