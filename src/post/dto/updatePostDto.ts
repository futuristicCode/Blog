import { IsNotEmpty } from "class-validator"

export class UpdatePostDto{
  @IsNotEmpty()
  readonly image: string[]
  @IsNotEmpty()
  readonly title: string
  @IsNotEmpty()
  readonly body: string  
}