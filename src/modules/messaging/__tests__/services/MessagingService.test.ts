import { MessagingService } from "../../application/services/MessagingService";
import { IMessageRepository } from "../../repositories/interfaces/message-repository.interface";
import { Message } from "../../domain/entities/message.entity";
import { PrismaClient } from "@prisma/client";

describe("MessagingService", () => {
  let messagingService: MessagingService;
  let mockMessageRepository: jest.Mocked<IMessageRepository>;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockMessageRepository = {
      create: jest.fn(),
      findConversationByVolunteerId: jest.fn(),
      markAsRead: jest.fn(),
      isUserParticipantInConversation: jest.fn(),
    } as jest.Mocked<IMessageRepository>;

    mockPrisma = {
      userVolunteer: {
        findFirst: jest.fn(),
      },
    } as any;

    messagingService = new MessagingService(mockMessageRepository, mockPrisma);
  });

  describe("sendMessage", () => {
    it("should send a message successfully when both users are participants", async () => {
      const mockMessage = {
        id: "1",
        content: "Test message",
        senderId: "sender1",
        receiverId: "receiver1",
        volunteerId: "volunteer1",
        sentAt: new Date(),
        readAt: null,
      } as Message;

      mockPrisma.userVolunteer.findFirst
        .mockResolvedValueOnce({ id: "1", userId: "sender1", volunteerId: "volunteer1" } as any)
        .mockResolvedValueOnce({ id: "2", userId: "receiver1", volunteerId: "volunteer1" } as any);

      mockMessageRepository.create.mockResolvedValue(mockMessage);

      const result = await messagingService.sendMessage(
        "Test message",
        "sender1",
        "receiver1",
        "volunteer1"
      );

      expect(result).toEqual(mockMessage);
      expect(mockMessageRepository.create).toHaveBeenCalledWith(
        "Test message",
        "sender1",
        "receiver1",
        "volunteer1"
      );
    });

    it("should throw error when sender is not a participant", async () => {
      mockPrisma.userVolunteer.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: "2", userId: "receiver1", volunteerId: "volunteer1" } as any);

      await expect(
        messagingService.sendMessage("Test message", "sender1", "receiver1", "volunteer1")
      ).rejects.toThrow("Sender is not a participant in this volunteer event");
    });

    it("should throw error when receiver is not a participant", async () => {
      mockPrisma.userVolunteer.findFirst
        .mockResolvedValueOnce({ id: "1", userId: "sender1", volunteerId: "volunteer1" } as any)
        .mockResolvedValueOnce(null);

      await expect(
        messagingService.sendMessage("Test message", "sender1", "receiver1", "volunteer1")
      ).rejects.toThrow("Receiver is not a participant in this volunteer event");
    });
  });

  describe("getConversation", () => {
    it("should get conversation when user is participant", async () => {
      const mockMessages = [
        {
          id: "1",
          content: "Test message",
          senderId: "sender1",
          receiverId: "receiver1",
          volunteerId: "volunteer1",
          sentAt: new Date(),
          readAt: null,
        },
      ] as Message[];

      mockPrisma.userVolunteer.findFirst.mockResolvedValue({
        id: "1",
        userId: "user1",
        volunteerId: "volunteer1",
      } as any);

      mockMessageRepository.findConversationByVolunteerId.mockResolvedValue(mockMessages);

      const result = await messagingService.getConversation("volunteer1", "user1", 1, 50);

      expect(result).toEqual(mockMessages);
      expect(mockMessageRepository.findConversationByVolunteerId).toHaveBeenCalledWith(
        "volunteer1",
        "user1",
        1,
        50
      );
    });

    it("should throw error when user is not a participant", async () => {
      mockPrisma.userVolunteer.findFirst.mockResolvedValue(null);

      await expect(
        messagingService.getConversation("volunteer1", "user1", 1, 50)
      ).rejects.toThrow("User is not a participant in this volunteer event");
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark message as read when user is participant", async () => {
      const mockMessage = {
        id: "1",
        content: "Test message",
        senderId: "sender1",
        receiverId: "receiver1",
        volunteerId: "volunteer1",
        sentAt: new Date(),
        readAt: new Date(),
      } as Message;

      mockMessageRepository.isUserParticipantInConversation.mockResolvedValue(true);
      mockMessageRepository.markAsRead.mockResolvedValue(mockMessage);

      const result = await messagingService.markMessageAsRead("1", "user1");

      expect(result).toEqual(mockMessage);
      expect(mockMessageRepository.markAsRead).toHaveBeenCalledWith("1", "user1");
    });

    it("should throw error when user is not participant", async () => {
      mockMessageRepository.isUserParticipantInConversation.mockResolvedValue(false);

      await expect(
        messagingService.markMessageAsRead("1", "user1")
      ).rejects.toThrow("Unauthorized: You cannot access this message");
    });

    it("should throw error when message not found", async () => {
      mockMessageRepository.isUserParticipantInConversation.mockResolvedValue(true);
      mockMessageRepository.markAsRead.mockResolvedValue(null);

      await expect(
        messagingService.markMessageAsRead("1", "user1")
      ).rejects.toThrow("Message not found or you are not authorized to mark it as read");
    });
  });
});