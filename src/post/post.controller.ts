import { Controller, Post, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('posts')
export class PostController {
  constructor(private readonly postService:PostService) {
  }

  // ** CREATE POST
  @UseGuards(AuthGuard("jwt"))
  @Post("create")
  createPostDto(){

  }
  // ** UPDATE POST
  // ** DELETE POST
  // ** GET POST BY ID
  // ** GET ALL POST

}
