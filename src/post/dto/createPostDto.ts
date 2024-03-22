import { IsNotEmpty } from "class-validator"


export class CreatePostDto {
  @IsNotEmpty()
  readonly image: string[]
  @IsNotEmpty()
  readonly title: string
  @IsNotEmpty()
  readonly body: string  

}