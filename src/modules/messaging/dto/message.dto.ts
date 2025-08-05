import { IsString, IsNotEmpty, IsUUID } from "class-validator";

export class SendMessageDto {
  @IsString({ message: "Content must be a string" })
  @IsNotEmpty({ message: "Content is required" })
  content: string;

  @IsUUID(4, { message: "Receiver ID must be a valid UUID" })
  @IsNotEmpty({ message: "Receiver ID is required" })
  receiverId: string;

  @IsUUID(4, { message: "Volunteer ID must be a valid UUID" })
  @IsNotEmpty({ message: "Volunteer ID is required" })
  volunteerId: string;
}

export class MarkAsReadDto {
  @IsUUID(4, { message: "Message ID must be a valid UUID" })
  @IsNotEmpty({ message: "Message ID is required" })
  messageId: string;
}

export class MessageResponseDto {
  id: string;
  content: string;
  sentAt: Date;
  readAt: Date | null;
  senderId: string;
  receiverId: string;
  volunteerId: string;
}
