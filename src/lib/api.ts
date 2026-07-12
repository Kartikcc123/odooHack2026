import {
  mockDepartments, mockCategories, mockEmployees,
  mockAssets, mockAllocations, mockBookings, mockKpis,
} from "./mock-data";
import { Department, Category, Employee, Asset, Allocation, Booking, KpiData } from "./types";

// swap each body to a real fetch("/api/...") call as Person A ships routes

export async function getDepartments(): Promise<Department[]> {
  return mockDepartments;
}

export async function getCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function getEmployees(): Promise<Employee[]> {
  return mockEmployees;
}

export async function getAssets(): Promise<Asset[]> {
  return mockAssets;
}

export async function getAllocations(): Promise<Allocation[]> {
  return mockAllocations;
}

export async function getBookings(): Promise<Booking[]> {
  return mockBookings;
}

export async function getKpis(): Promise<KpiData> {
  return mockKpis;
}

// example of how a real conflict-handling call will look once Person A's route is live
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