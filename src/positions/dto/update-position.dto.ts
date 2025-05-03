import { IsString } from 'class-validator';

export class UpdatePositionDto {
  @IsString()
  title: string;
}
