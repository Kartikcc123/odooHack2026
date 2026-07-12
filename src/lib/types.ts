export type Role = "EMPLOYEE" | "DEPARTMENT_HEAD" | "ASSET_MANAGER" | "ADMIN";

export type AssetStatus =
  | "AVAILABLE" | "ALLOCATED" | "RESERVED"
  | "UNDER_MAINTENANCE" | "LOST" | "RETIRED" | "DISPOSED";

export type BookingStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type AllocationStatus = "ACTIVE" | "RETURNED" | "OVERDUE" | "PENDING_TRANSFER";

export interface Department {
  id: string;
  name: string;
  headId?: string;
  headName?: string;
  parentId?: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface Category {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  departmentName: string;
  role: Role;
  status: "ACTIVE" | "INACTIVE";
}

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  categoryId: string;
  categoryName: string;
  serialNumber: string;
  status: AssetStatus;
  condition: string;
  location: string;
  isBookable: boolean;
  currentHolderId?: string;
  currentHolderName?: string;
}

export interface Allocation {
  id: string;
  assetId: string;
  assetTag: string;
  assetName: string;
  employeeId: string;
  employeeName: string;
  allocatedAt: string;
  expectedReturnDate?: string;
  status: AllocationStatus;
}

export interface Booking {
  id: string;
  resourceAssetId: string;
  resourceName: string;
  bookedById: string;
  bookedByName: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

export interface KpiData {
  assetsAvailable: number;
  assetsAllocated: number;
  maintenanceToday: number;
  activeBookings: number;
  pendingTransfers: number;
  upcomingReturns: number;
  overdueReturns: { assetId: string; assetTag: string; employeeName: string; expectedReturnDate: string }[];
}