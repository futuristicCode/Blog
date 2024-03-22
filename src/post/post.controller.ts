import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { AuthGuard } from "@nestjs/passport";
import { CreatePostDto } from "./dto/createPostDto";
import { Request } from "express";

@Controller('posts')
export class PostController {
  constructor(private readonly postService:PostService) {
  }

  // ** CREATE POST
  @UseGuards(AuthGuard("jwt"))
  @Post()
  createPostDto(@Body() createPostDto: CreatePostDto, @Req() request: Request ) {
    const userId = request.user["userId"]
    return this.postService.createPost(createPostDto, userId)
  }
  // ** UPDATE POST
  // ** DELETE POST
  // ** GET POST BY ID
  // ** GET ALL POST

}
