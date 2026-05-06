import prisma from "../../lib/prisma";

const generateEmployeeCode = async (): Promise<string> => {
  const count = await prisma.employee.count();
  return `EMP${String(count + 1).padStart(4, "0")}`;
};

export const createEmployee = async (data: {
  name: string;
  email?: string;
  phone?: string;
}) => {
  const employeeCode = await generateEmployeeCode();
  return prisma.employee.create({
    data: { ...data, employeeCode },
  });
};

export const getEmployees = async (
  search?: string,
  page = 1,
  limit = 10
) => {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { employeeCode: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    employees,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getEmployeeById = async (id: string) => {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) throw new Error("Employee not found");
  return employee;
};

export const toggleEmployeeStatus = async (id: string, isActive: boolean) => {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) throw new Error("Employee not found");

  return prisma.employee.update({
    where: { id },
    data: { isActive },
  });
};