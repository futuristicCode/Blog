import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/createPostDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Exclude } from 'class-transformer';
import { UpdatePostDto } from './dto/updatePostDto';

@Injectable()
export class PostService {

    constructor(private readonly prismaService: PrismaService) { }



    // ** CREATE POST ** //
    async createPost(createPostDto: CreatePostDto, userId: any) {
        const { body, title, image } = createPostDto;
        const authorId = userId
        await this.prismaService.post.create({ data: { body, image, title, authorId } });
        return { data: "Post Created !" };
    }
    
    // ** UPDATE POST ** //
    async updatePost(postId:number,authorId:number,updatePostDto: UpdatePostDto) {
        const post = await this.prismaService.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException("Post Does Not Exists Or Not Found")
        if (post.authorId != authorId) throw new ForbiddenException("Forbidden Action") 
        await this.prismaService.post.update({ where: { postId }, data: { ...updatePostDto } })
        return {data: "Post Update!"}
    }

    // ** DELETE POST ** //
    async deletePost(postId:number,authorId:number) {
        const post = await this.prismaService.post.findUnique({ where: { postId } })
        if (!post) throw new NotFoundException("Post Does Not Exists Or Not Found")
        if (post.authorId != authorId) throw new ForbiddenException("Forbidden Action")
        await this.prismaService.post.delete({ where: { postId } }
        )
        return {data : "Post Deleted!"}
    }

    //** GET ALL POST **/

    async getAllPosts() {
        
        const posts = await this.prismaService.post.findMany({
             include: {
                author: {
                     select: {
                         userId:true,
                        username: true,
                        email: true,
                        password: false,
                        created_at: true,
                        updated_at: true,
                         role:true
                     }
                 },
                 comment: true,
                 categories: true

             }  
        })
        
        console.log(posts)
        return posts
    }

    //**     GET POST BY ID */

    async getPost() {
        
    }

}
