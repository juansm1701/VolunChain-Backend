import { MetricsService } from "../../application/services/MetricsService";
import { MetricsRepository } from "../../repositories/MetricsRepository";
import {
  ImpactMetrics,
  OrganizationImpactMetrics,
  ProjectImpactMetrics,
} from "../../types/metrics";

jest.mock("../../repositories/MetricsRepository");
jest.mock("redis", () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn(),
    set: jest.fn(),
  })),
}));

describe("MetricsService", () => {
  let metricsService: MetricsService;
  let mockMetricsRepository: jest.Mocked<MetricsRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMetricsRepository = new MetricsRepository() as jest.Mocked<MetricsRepository>;
    metricsService = new MetricsService();
    (metricsService as any).metricsRepository = mockMetricsRepository;
  });

  describe("getGlobalMetrics", () => {
    it("should return global metrics from database when cache is empty", async () => {
      const mockMetrics: ImpactMetrics = {
        totalProjects: 10,
        totalVolunteers: 50,
        totalOrganizations: 5,
        totalHoursVolunteered: 1000,
        totalCertificatesIssued: 25,
        environmentalImpact: {
          co2Saved: 100,
          treesPlanted: 50,
          wasteReduced: 200,
        },
        socialImpact: {
          livesImpacted: 500,
          communitiesServed: 10,
          educationHours: 300,
        },
      };

      mockMetricsRepository.getGlobalMetrics.mockResolvedValue(mockMetrics);
      (metricsService as any).redisClient = null;

      const result = await metricsService.getGlobalMetrics();

      expect(result).toEqual(mockMetrics);
      expect(mockMetricsRepository.getGlobalMetrics).toHaveBeenCalledTimes(1);
    });

    it("should return metrics from cache when available", async () => {
      const mockMetrics: ImpactMetrics = {
        totalProjects: 10,
        totalVolunteers: 50,
        totalOrganizations: 5,
        totalHoursVolunteered: 1000,
        totalCertificatesIssued: 25,
        environmentalImpact: {
          co2Saved: 100,
          treesPlanted: 50,
          wasteReduced: 200,
        },
        socialImpact: {
          livesImpacted: 500,
          communitiesServed: 10,
          educationHours: 300,
        },
      };

      const mockRedisClient = {
        get: jest.fn().mockResolvedValue(JSON.stringify(mockMetrics)),
        set: jest.fn(),
      };

      (metricsService as any).redisClient = mockRedisClient;

      const result = await metricsService.getGlobalMetrics();

      expect(result).toEqual(mockMetrics);
      expect(mockRedisClient.get).toHaveBeenCalledWith("global:metrics");
      expect(mockMetricsRepository.getGlobalMetrics).not.toHaveBeenCalled();
    });
  });

  describe("getOrganizationMetrics", () => {
    it("should return organization metrics from database when cache is empty", async () => {
      const organizationId = "org-123";
      const mockMetrics: OrganizationImpactMetrics = {
        organizationId,
        organizationName: "Test Org",
        totalProjects: 5,
        totalVolunteers: 25,
        totalHoursVolunteered: 500,
        totalCertificatesIssued: 10,
        environmentalImpact: {
          co2Saved: 50,
          treesPlanted: 25,
          wasteReduced: 100,
        },
        socialImpact: {
          livesImpacted: 250,
          communitiesServed: 5,
          educationHours: 150,
        },
      };

      mockMetricsRepository.getOrganizationMetrics.mockResolvedValue(mockMetrics);
      (metricsService as any).redisClient = null;

      const result = await metricsService.getOrganizationMetrics(organizationId);

      expect(result).toEqual(mockMetrics);
      expect(mockMetricsRepository.getOrganizationMetrics).toHaveBeenCalledWith(organizationId);
    });

    it("should return null when organization not found", async () => {
      const organizationId = "non-existent";

      mockMetricsRepository.getOrganizationMetrics.mockResolvedValue(null);
      (metricsService as any).redisClient = null;

      const result = await metricsService.getOrganizationMetrics(organizationId);

      expect(result).toBeNull();
      expect(mockMetricsRepository.getOrganizationMetrics).toHaveBeenCalledWith(organizationId);
    });
  });

  describe("getProjectMetrics", () => {
    it("should return project metrics from database when cache is empty", async () => {
      const projectId = "project-123";
      const mockMetrics: ProjectImpactMetrics = {
        projectId,
        projectName: "Test Project",
        organizationId: "org-123",
        organizationName: "Test Org",
        totalVolunteers: 10,
        totalHoursVolunteered: 200,
        totalCertificatesIssued: 5,
        environmentalImpact: {
          co2Saved: 20,
          treesPlanted: 10,
          wasteReduced: 40,
        },
        socialImpact: {
          livesImpacted: 100,
          communitiesServed: 2,
          educationHours: 60,
        },
      };

      mockMetricsRepository.getProjectMetrics.mockResolvedValue(mockMetrics);
      (metricsService as any).redisClient = null;

      const result = await metricsService.getProjectMetrics(projectId);

      expect(result).toEqual(mockMetrics);
      expect(mockMetricsRepository.getProjectMetrics).toHaveBeenCalledWith(projectId);
    });

    it("should return null when project not found", async () => {
      const projectId = "non-existent";

      mockMetricsRepository.getProjectMetrics.mockResolvedValue(null);
      (metricsService as any).redisClient = null;

      const result = await metricsService.getProjectMetrics(projectId);

      expect(result).toBeNull();
      expect(mockMetricsRepository.getProjectMetrics).toHaveBeenCalledWith(projectId);
    });
  });

  describe("refreshMetricsCache", () => {
    it("should refresh global metrics cache successfully", async () => {
      const mockMetrics: ImpactMetrics = {
        totalProjects: 10,
        totalVolunteers: 50,
        totalOrganizations: 5,
        totalHoursVolunteered: 1000,
        totalCertificatesIssued: 25,
        environmentalImpact: {
          co2Saved: 100,
          treesPlanted: 50,
          wasteReduced: 200,
        },
        socialImpact: {
          livesImpacted: 500,
          communitiesServed: 10,
          educationHours: 300,
        },
      };

      const mockRedisClient = {
        set: jest.fn(),
      };

      mockMetricsRepository.getGlobalMetrics.mockResolvedValue(mockMetrics);
      (metricsService as any).redisClient = mockRedisClient;

      await metricsService.refreshMetricsCache();

      expect(mockMetricsRepository.getGlobalMetrics).toHaveBeenCalledTimes(1);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "global:metrics",
        JSON.stringify(mockMetrics),
        { EX: 86400 }
      );
    });

    it("should throw error when refresh fails", async () => {
      mockMetricsRepository.getGlobalMetrics.mockRejectedValue(new Error("Database error"));

      await expect(metricsService.refreshMetricsCache()).rejects.toThrow("Database error");
    });
  });
});