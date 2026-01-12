const jwt = require("jsonwebtoken");
const usersService = require("./usersService");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "24h";

class AuthService {
  async register(userData) {
    const existingUser = await usersService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user = await usersService.createUser(userData);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email, password) {
    const user = await usersService.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await usersService.validatePassword(user, password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}

module.exports = new AuthService();
