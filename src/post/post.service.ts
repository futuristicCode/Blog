import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/createPostDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {

    constructor(private readonly prismaService: PrismaService) { }
    
    async createPost(createPostDto: CreatePostDto, userId: any) {
        const { body, title, image } = createPostDto;
        const authorId = userId
        await this.prismaService.post.create({ data : {body,image,title,authorId}});
        return { data : "Post Created !" };
    }
}
