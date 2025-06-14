import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  logoUrl?: string;

  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true || value === 1 || value === '1',
  )
  @IsBoolean()
  isMainTeam?: boolean;
}
