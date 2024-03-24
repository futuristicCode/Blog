import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Request, request } from 'express';
import { CreateCommentDto } from './dto/createCommentDto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from './dto/updateCommentDto';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }


    //** CREATE POST */
    @UseGuards(AuthGuard("jwt"))
    @Post()
    createCommentDto(@Req() request: Request,@Body() createCommentDto: CreateCommentDto) {
        const userId = request.user['userId']
        return this.commentService.createComment(userId,createCommentDto)
    }

    //** DELETE POST */
    @UseGuards(AuthGuard("jwt"))
    @Delete(':id')
    deleteComment(@Req() request: Request, @Param('id', ParseIntPipe) commentId: number, @Body('postId') postId: number) {
        const userId = request.user['userId']
        return this.commentService.deleleComment(commentId,userId,postId)
    }

    //** UPDATE COMMENT */
    @UseGuards(AuthGuard("jwt"))
    @Put(':id')
    updateComment(@Req() request: Request, @Param('id', ParseIntPipe) commentId: number, @Body() updateCommentDto:UpdateCommentDto) {
        const userId = request.user['userId']
        return this.commentService.updateComment(commentId,userId,updateCommentDto)
    }

}
