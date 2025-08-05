import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsUrl,
  IsBoolean,
} from "class-validator";

export class UpdateOrganizationDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  @MinLength(2, { message: "Name must be at least 2 characters long" })
  @MaxLength(100, { message: "Name cannot exceed 100 characters" })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Please provide a valid email address" })
  email?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MinLength(10, { message: "Description must be at least 10 characters long" })
  @MaxLength(500, { message: "Description cannot exceed 500 characters" })
  description?: string;

  @IsOptional()
  @IsString({ message: "Category must be a string" })
  @MaxLength(50, { message: "Category cannot exceed 50 characters" })
  category?: string;

  @IsOptional()
  @IsUrl({}, { message: "Please provide a valid website URL" })
  website?: string;

  @IsOptional()
  @IsString({ message: "Address must be a string" })
  @MaxLength(200, { message: "Address cannot exceed 200 characters" })
  address?: string;

  @IsOptional()
  @IsString({ message: "Phone must be a string" })
  @MaxLength(20, { message: "Phone cannot exceed 20 characters" })
  phone?: string;

  @IsOptional()
  @IsBoolean({ message: "isVerified must be a boolean" })
  isVerified?: boolean;

  @IsOptional()
  @IsString({ message: "Logo URL must be a string" })
  @MaxLength(1000, { message: "Logo URL cannot exceed 1000 characters" })
  logoUrl?: string;
}
