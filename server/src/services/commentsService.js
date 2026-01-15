const prisma = require("../config/database");

class CommentsService {
  async findAll() {
    return prisma.comment.findMany({
      where: { approved: true },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllAdmin() {
    return prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id) {
    return prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async create(commentData, userId = null) {
    let authorName = commentData.author;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      authorName = user.username;
    }

    const createData = {
      content: commentData.content,
      author: authorName,
      email: userId ? null : commentData.email || null,
      post: {
        connect: { id: commentData.postId },
      },
    };

    if (userId) {
      createData.user = {
        connect: { id: userId },
      };
    }

    return prisma.comment.create({
      data: createData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async update(id, updateData) {
    return prisma.comment.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id) {
    return prisma.comment.delete({
      where: { id },
    });
  }

  async postExists(postId) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    return !!post;
  }
}

module.exports = new CommentsService();
