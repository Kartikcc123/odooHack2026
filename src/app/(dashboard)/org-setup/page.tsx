    "use client";
import { useEffect, useState } from "react";
import { getDepartments, getCategories, getEmployees } from "@/lib/api";
import { Department, Category, Employee, Role } from "@/lib/types";

const TABS = ["Departments", "Categories", "Employee Directory"] as const;
type Tab = typeof TABS[number];

export default function OrgSetupPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Departments");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    getDepartments().then(setDepartments);
    getCategories().then(setCategories);
    getEmployees().then(setEmployees);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 animate-in">Organization Setup</h1>
      <p className="mb-6 text-sm animate-in stagger-1" style={{ color: "var(--text-muted)" }}>
        Master data — departments, categories, employee roles
      </p>

      <div className="animate-in stagger-2 flex gap-1 mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: activeTab === tab ? "var(--accent)" : "transparent",
              color: activeTab === tab ? "var(--accent)" : "var(--text-muted)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Departments" && (
        <div className="animate-in">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{departments.length} departments</p>
            <button className="rounded-md px-4 py-2 text-sm font-medium" style={{ background: "var(--accent)", color: "#12161F" }}>
              + Add Department
            </button>
          </div>
          <Table
            headers={["Name", "Head", "Parent", "Status"]}
            rows={departments.map((d) => [
              d.name,
              d.headName ?? "—",
              departments.find((p) => p.id === d.parentId)?.name ?? "—",
              d.status,
            ])}
          />
        </div>
      )}

      {activeTab === "Categories" && (
        <div className="animate-in">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{categories.length} categories</p>
            <button className="rounded-md px-4 py-2 text-sm font-medium" style={{ background: "var(--accent)", color: "#12161F" }}>
              + Add Category
            </button>
          </div>
          <Table headers={["Name"]} rows={categories.map((c) => [c.name])} />
        </div>
      )}

      {activeTab === "Employee Directory" && (
        <div className="animate-in">
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{employees.length} employees</p>
          <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead style={{ background: "var(--surface-elevated)" }}>
                <tr className="text-left" style={{ color: "var(--text-muted)" }}>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-3">{e.name}</td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{e.email}</td>
                    <td className="px-4 py-3">{e.departmentName}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
                      >
                        {e.role.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">{e.status}</td>
                    <td className="px-4 py-3">
                      <select
                        defaultValue={e.role}
                        className="rounded-md border px-2 py-1 text-xs"
                        style={{ background: "var(--surface-elevated)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                        onChange={() => alert("Wire this to PATCH /api/employees/:id/role")}
                      >
                        {(["EMPLOYEE", "DEPARTMENT_HEAD", "ASSET_MANAGER"] as Role[]).map((r) => (
                          <option key={r} value={r}>{r.replaceAll("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | undefined)[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead style={{ background: "var(--surface-elevated)" }}>
          <tr className="text-left" style={{ color: "var(--text-muted)" }}>
            {headers.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
              {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}