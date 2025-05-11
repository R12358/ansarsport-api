import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  logoUrl?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true || value === 1 || value === '1',
  )
  isMainTeam?: boolean;
}
