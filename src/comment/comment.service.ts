import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
    constructor(private readonly prismaService: PrismaService) { }

    //** CREATE COMMENTS */
    async createComment(userId: number, createCommentDto: CreateCommentDto) {
        const { postId, content } = createCommentDto
        const post = await this.prismaService.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException("Post Not Found!")
        await this.prismaService.comment.create({
            data: {
                content,
                userId,
                postId
            }
        })
        return {data: 'Comment Created!'}
    }

    //** UPDATE COMMENT */
    async updateComment(commentId: number, userId: number, updateCommentDto: UpdateCommentDto) {
        const {postId,content} = updateCommentDto
       const comment = await this.prismaService.comment.findFirst({ where: { commentId } })
        if (!comment) throw new NotFoundException("Comment Not Found!")
        if (comment.postId !== postId) throw new UnauthorizedException("Post Id does not Match")
        if (comment.userId !== userId) throw new ForbiddenException("Forbidden Action!") 
        await this.prismaService.comment.update({ where: { commentId }, data: { content } })
        return {data:'Comment Updated!'}
    }

    //** DELETE COMMENTS */
    async deleleComment(commentId: number, userId: number, postId: number) {
        const comment = await this.prismaService.comment.findFirst({ where: { commentId } })
        if (!comment) throw new NotFoundException("Comment Not Found!")
        if (comment.postId !== postId) throw new UnauthorizedException("Post Id does not Match")
        if (comment.userId !== userId) throw new ForbiddenException("Forbidden Action!")
        await this.prismaService.comment.delete({ where: { commentId } })
        return {data : 'Comment Deleted!'}
    }
}
