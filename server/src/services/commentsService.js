const prisma = require("../config/database");

class CommentsService {
  baseSelect = {
    id: true,
    content: true,
    postId: true,
    author: true,
    approved: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  };

  adminSelect = {
    ...this.baseSelect,
    email: true,
    user: {
      select: {
        id: true,
        username: true,
        email: true,
      },
    },
  };

  async findAll() {
    return prisma.comment.findMany({
      where: { approved: true },
      select: this.baseSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id) {
    return prisma.comment.findUnique({
      where: { id },
      select: this.baseSelect,
    });
  }

  async findAllByPostId(postId) {
    return prisma.comment.findMany({
      where: {
        postId: postId,
        approved: true,
      },
      select: this.baseSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async findAllAdmin() {
    return prisma.comment.findMany({
      select: this.adminSelect,
      orderBy: { createdAt: "desc" },
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
      select: this.baseSelect,
    });
  }

  async update(id, updateData, includeEmail = false) {
    return prisma.comment.update({
      where: { id },
      data: updateData,
      select: includeEmail ? this.adminSelect : this.baseSelect,
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
