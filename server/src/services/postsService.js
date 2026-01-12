const prisma = require("../config/database");

class PostsService {
  async findAll() {
    return await prisma.post.findMany({
      include: { author: true },
    });
  }

  async findPublished() {
    return await prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    });
  }

  async create(postData) {
    return await prisma.post.create({
      data: postData,
    });
  }
}

module.exports = new PostsService();
