
import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: 'name không được để trống'})
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    image: string;
}
