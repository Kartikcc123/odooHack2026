import { Department, Category, Employee, Asset, Allocation, Booking, KpiData } from "./types";

export const mockDepartments: Department[] = [
  { id: "d1", name: "Engineering", headId: "e2", headName: "Priya Sharma", status: "ACTIVE" },
  { id: "d2", name: "Operations", headId: "e3", headName: "Raj Verma", status: "ACTIVE" },
  { id: "d3", name: "Facilities", status: "ACTIVE" },
];

export const mockCategories: Category[] = [
  { id: "c1", name: "Electronics" },
  { id: "c2", name: "Furniture" },
  { id: "c3", name: "Vehicles" },
  { id: "c4", name: "Meeting Rooms" },
];

export const mockEmployees: Employee[] = [
  { id: "e1", name: "Sakshi Kadu", email: "sakshi@org.com", departmentId: "d1", departmentName: "Engineering", role: "ADMIN", status: "ACTIVE" },
  { id: "e2", name: "Priya Sharma", email: "priya@org.com", departmentId: "d1", departmentName: "Engineering", role: "DEPARTMENT_HEAD", status: "ACTIVE" },
  { id: "e3", name: "Raj Verma", email: "raj@org.com", departmentId: "d2", departmentName: "Operations", role: "ASSET_MANAGER", status: "ACTIVE" },
  { id: "e4", name: "Ankit Joshi", email: "ankit@org.com", departmentId: "d3", departmentName: "Facilities", role: "EMPLOYEE", status: "ACTIVE" },
];

export const mockAssets: Asset[] = [
  { id: "a1", assetTag: "AF-0001", name: "Dell Latitude Laptop", categoryId: "c1", categoryName: "Electronics", serialNumber: "SN-2291", status: "ALLOCATED", condition: "Good", location: "Nagpur HQ - 3F", isBookable: false, currentHolderId: "e2", currentHolderName: "Priya Sharma" },
  { id: "a2", assetTag: "AF-0002", name: "Office Chair - Ergo", categoryId: "c2", categoryName: "Furniture", serialNumber: "SN-1187", status: "AVAILABLE", condition: "Good", location: "Nagpur HQ - 2F", isBookable: false },
  { id: "a3", assetTag: "AF-0003", name: "Toyota Innova", categoryId: "c3", categoryName: "Vehicles", serialNumber: "SN-VEH-04", status: "AVAILABLE", condition: "Good", location: "Parking Bay 1", isBookable: true },
  { id: "a4", assetTag: "AF-0004", name: "Conference Room B2", categoryId: "c4", categoryName: "Meeting Rooms", serialNumber: "SN-ROOM-B2", status: "AVAILABLE", condition: "Good", location: "Nagpur HQ - 4F", isBookable: true },
  { id: "a5", assetTag: "AF-0005", name: "HP Printer LaserJet", categoryId: "c1", categoryName: "Electronics", serialNumber: "SN-3390", status: "UNDER_MAINTENANCE", condition: "Fair", location: "Nagpur HQ - 1F", isBookable: false },
  { id: "a6", assetTag: "AF-0006", name: "Projector Epson", categoryId: "c1", categoryName: "Electronics", serialNumber: "SN-4471", status: "RESERVED", condition: "Good", location: "Nagpur HQ - 4F", isBookable: true },
];

export const mockAllocations: Allocation[] = [
  { id: "al1", assetId: "a1", assetTag: "AF-0001", assetName: "Dell Latitude Laptop", employeeId: "e2", employeeName: "Priya Sharma", allocatedAt: "2026-06-01T09:00:00Z", expectedReturnDate: "2026-07-15T00:00:00Z", status: "ACTIVE" },
];

export const mockBookings: Booking[] = [
  { id: "b1", resourceAssetId: "a4", resourceName: "Conference Room B2", bookedById: "e3", bookedByName: "Raj Verma", startTime: "2026-07-12T09:00:00Z", endTime: "2026-07-12T10:00:00Z", status: "UPCOMING" },
  { id: "b2", resourceAssetId: "a3", resourceName: "Toyota Innova", bookedById: "e4", bookedByName: "Ankit Joshi", startTime: "2026-07-13T08:00:00Z", endTime: "2026-07-13T12:00:00Z", status: "UPCOMING" },
];

export const mockKpis: KpiData = {
  assetsAvailable: 2,
  assetsAllocated: 1,
  maintenanceToday: 1,
  activeBookings: 2,
  pendingTransfers: 0,
  upcomingReturns: 1,
  overdueReturns: [],
};