import { Department, Category, Employee, Asset, Allocation, Booking, KpiData } from "./types";

export async function getDepartments(): Promise<Department[]> {
  const res = await fetch("/api/departments");
  const json = await res.json();
  if (!json.success) return [];
  return json.data.map((d: any) => ({
    id: d.id,
    name: d.name,
    headId: d.headId || undefined,
    headName: d.headName || undefined,
    parentId: d.parentId || undefined,
    status: d.status,
  }));
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  const json = await res.json();
  if (!json.success) return [];
  return json.data.map((c: any) => ({
    id: c.id,
    name: c.name,
  }));
}

export async function getEmployees(): Promise<Employee[]> {
  const res = await fetch("/api/users");
  const json = await res.json();
  if (!json.success) return [];
  return json.data.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    departmentId: u.departmentId,
    departmentName: u.department?.name || "",
    role: u.role,
    status: u.status,
  }));
}

export async function getAssets(): Promise<Asset[]> {
  const res = await fetch("/api/assets");
  const json = await res.json();
  if (!json.success) return [];
  return json.data.map((a: any) => ({
    id: a.id,
    assetTag: a.tag || "",
    name: a.name || "",
    categoryId: a.categoryId || "",
    categoryName: a.category?.name || "",
    serialNumber: a.serial || "",
    status: a.status || "AVAILABLE",
    condition: a.condition || "NEW",
    location: a.location || "",
    isBookable: !!a.isBookable,
    currentHolderId: undefined,
    currentHolderName: undefined,
  }));
}

export async function getAllocations(): Promise<Allocation[]> {
  const res = await fetch("/api/allocations");
  const json = await res.json();
  if (!json.success) return [];
  return json.data.map((a: any) => ({
    id: a.id,
    assetId: a.assetId || "",
    assetTag: a.asset?.tag || "",
    assetName: a.asset?.name || "",
    employeeId: a.userId || "",
    employeeName: a.user?.name || "",
    allocatedAt: a.createdAt || new Date().toISOString(),
    expectedReturnDate: a.expectedReturnDate || undefined,
    status: a.status || "ACTIVE",
  }));
}

export async function getBookings(): Promise<Booking[]> {
  const res = await fetch("/api/bookings");
  const json = await res.json();
  if (!json.success) return [];
  return json.data.map((b: any) => ({
    id: b.id,
    resourceAssetId: b.assetId || "",
    resourceName: b.asset?.name || "",
    bookedById: b.userId || "",
    bookedByName: b.user?.name || "",
    startTime: b.startTime || "",
    endTime: b.endTime || "",
    status: b.status || "UPCOMING",
  }));
}

export async function getKpis(): Promise<KpiData> {
  const res = await fetch("/api/dashboard");
  const json = await res.json();
  if (!json.success) {
    return {
      assetsAvailable: 0,
      assetsAllocated: 0,
      maintenanceToday: 0,
      activeBookings: 0,
      pendingTransfers: 0,
      upcomingReturns: 0,
      overdueReturns: [],
    };
  }
  return json.data;
}

export async function createAllocation(assetId: string, employeeId: string, expectedReturnDate?: string) {
  const res = await fetch("/api/allocations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assetId, employeeId, expectedReturnDate }),
  });
  if (res.status === 409) {
    const data = await res.json();
    throw { code: "ALREADY_ALLOCATED", currentHolderName: data.currentHolderName };
  }
  return res.json();
}

export async function createBooking(resourceAssetId: string, startTime: string, endTime: string) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceAssetId, startTime, endTime }),
  });
  if (res.status === 409) {
    const data = await res.json();
    throw { code: "OVERLAP", conflictingBooking: data.conflictingBooking };
  }
  return res.json();
}