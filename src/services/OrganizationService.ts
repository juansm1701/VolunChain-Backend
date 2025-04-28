// import { PrismaClient } from "@prisma/client";
// import { ValidationError } from "../errors";


// interface PrismaOrganization {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   name: string;
//   email: string;
//   password: string;
//   category: string;
//   wallet: string;
//   nfts: PrismaNFT[];
// }

// interface PrismaNFT {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   userId: string;
//   organizationId: string;
//   description: string;
// }

// type OrganizationWithNFTs = PrismaOrganization;
// type OrganizationUpdateData = Partial<
//   Omit<PrismaOrganization, "id" | "createdAt" | "updatedAt">
// >;

// export class OrganizationService {
//   private prisma = new PrismaClient();

//   async createOrganization(
//     name: string,
//     email: string,
//     password: string,
//     category: string,
//     wallet: string
//   ): Promise<OrganizationWithNFTs> {
//     // Check if organization with email already exists
//     const existingOrgEmail = await this.prisma.organization.findUnique({
//       where: { email },
//     });
//     if (existingOrgEmail) {
//       throw new ValidationError("Organization with this email already exists");
//     }

//     // Check if organization with wallet already exists
//     const existingOrgWallet = await this.prisma.organization.findUnique({
//       where: { wallet },
//     });
//     if (existingOrgWallet) {
//       throw new ValidationError("Organization with this wallet already exists");
//     }

//     return this.prisma.organization.create({
//       data: {
//         name,
//         email,
//         password, 
//         category,
//         wallet,
//       },
//       include: {
//         nfts: true,
//       },
//     }) as unknown as OrganizationWithNFTs;
//   }

//   async getOrganizationById(id: string): Promise<OrganizationWithNFTs | null> {
//     return this.prisma.organization.findUnique({
//       where: { id },
//       include: {
//         nfts: true,
//       },
//     }) as unknown as OrganizationWithNFTs | null;
//   }

//   async getOrganizationByEmail(
//     email: string
//   ): Promise<OrganizationWithNFTs | null> {
//     return this.prisma.organization.findUnique({
//       where: { email },
//       include: {
//         nfts: true,
//       },
//     }) as unknown as OrganizationWithNFTs | null;
//   }

//   async updateOrganization(
//     id: string,
//     updateData: OrganizationUpdateData
//   ): Promise<OrganizationWithNFTs> {
//     const organization = await this.getOrganizationById(id);
//     if (!organization) {
//       throw new ValidationError("Organization not found");
//     }

//     // If email is being updated, check for uniqueness
//     if (updateData.email && updateData.email !== organization.email) {
//       const existingOrgEmail = await this.prisma.organization.findUnique({
//         where: { email: updateData.email },
//       });
//       if (existingOrgEmail) {
//         throw new ValidationError(
//           "Organization with this email already exists"
//         );
//       }
//     }

//     // If wallet is being updated, check for uniqueness
//     if (updateData.wallet && updateData.wallet !== organization.wallet) {
//       const existingOrgWallet = await this.prisma.organization.findUnique({
//         where: { wallet: updateData.wallet },
//       });
//       if (existingOrgWallet) {
//         throw new ValidationError(
//           "Organization with this wallet already exists"
//         );
//       }
//     }

//     return this.prisma.organization.update({
//       where: { id },
//       data: updateData,
//       include: {
//         nfts: true,
//       },
//     }) as unknown as OrganizationWithNFTs;
//   }

//   async deleteOrganization(id: string): Promise<void> {
//     const organization = await this.getOrganizationById(id);
//     if (!organization) {
//       throw new ValidationError("Organization not found");
//     }

//     await this.prisma.organization.delete({
//       where: { id },
//     });
//   }

//   async getAllOrganizations(
//     page: number = 1,
//     pageSize: number = 10
//   ): Promise<{ organizations: OrganizationWithNFTs[]; total: number }> {
//     const skip = (page - 1) * pageSize;

//     const [organizations, total] = await Promise.all([
//       this.prisma.organization.findMany({
//         skip,
//         take: pageSize,
//         include: {
//           nfts: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       }),
//       this.prisma.organization.count(),
//     ]);

//     return { 
//       organizations: organizations as unknown as OrganizationWithNFTs[], 
//       total 
//     };
//   }
// }
