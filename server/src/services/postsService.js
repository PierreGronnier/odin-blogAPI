const prisma = require("../config/database");

class PostsService {
  async findAll() {
    return await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id) {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async create(postData) {
    return await prisma.post.create({
      data: postData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id, updateData) {
    return await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return await prisma.post.delete({
      where: { id },
    });
  }

  async findPublished() {
    return await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new PostsService();
