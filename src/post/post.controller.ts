import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { AuthGuard } from "@nestjs/passport";
import { CreatePostDto } from './dto/createPost.dto';
import { Request, request } from "express";
import { UpdatePostDto } from "./dto/updatePost.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('POSTS')
@Controller('posts')
export class PostController {
  constructor(private readonly postService:PostService) {
  }

  // ** CREATE POST
  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post()
  createPostDto(@Body() createPostDto: CreatePostDto, @Req() request: Request ) {
    const userId = request.user["userId"]
    return this.postService.createPost(createPostDto, userId)
  }

  // ** UPDATE POST
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
   updatePostDto(@Param("id", ParseIntPipe) postId: number,@Body() updatePostDto: UpdatePostDto, @Req() request: Request) {
    const userId = request.user['userId']
    return this.postService.updatePost(postId,userId,updatePostDto) 
  }
  // ** DELETE POST
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deletePostDto(@Param("id", ParseIntPipe) postId: number, @Req() request: Request) {
    const userId = request.user['userId']
    return this.postService.deletePost(postId,userId)
  }
  // ** GET POST BY ID
  //@UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getPost(@Param("id", ParseIntPipe) postId: number) {
    return this.postService.getPost(postId)
  }

  // ** GET ALL POST
  @Get()
  getAllPosts() {
    const posts = this.postService.getAllPosts()
    return posts
  }

}
