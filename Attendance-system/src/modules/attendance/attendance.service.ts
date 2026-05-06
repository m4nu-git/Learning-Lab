import { PersonType, PunchType } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";

// Get the last punch event for an employee or guest
const getLastPunchEvent = async (
  personType: PersonType,
  id: string
) => {
  const where =
    personType === PersonType.EMPLOYEE
      ? { employeeId: id }
      : { guestId: id };

  return prisma.punchEvent.findFirst({
    where,
    orderBy: { timestamp: "desc" },
  });
};

export const punchInEmployee = async (employeeId: string) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) throw new Error("Employee not found");
  if (!employee.isActive) throw new Error("Employee is disabled");

  const last = await getLastPunchEvent(PersonType.EMPLOYEE, employeeId);
  if (last && last.type === PunchType.IN) {
    throw new Error("Employee is already punched in. Please punch out first");
  }

  return prisma.punchEvent.create({
    data: {
      type: PunchType.IN,
      personType: PersonType.EMPLOYEE,
      employeeId,
    },
    include: { employee: true },
  });
};

export const punchOutEmployee = async (employeeId: string) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) throw new Error("Employee not found");

  const last = await getLastPunchEvent(PersonType.EMPLOYEE, employeeId);
  if (!last || last.type === PunchType.OUT) {
    throw new Error("Employee is not punched in");
  }

  return prisma.punchEvent.create({
    data: {
      type: PunchType.OUT,
      personType: PersonType.EMPLOYEE,
      employeeId,
    },
    include: { employee: true },
  });
};

export const punchInGuest = async (guestId: string) => {
  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest) throw new Error("Guest not found");

  const last = await getLastPunchEvent(PersonType.GUEST, guestId);
  if (last && last.type === PunchType.IN) {
    throw new Error("Guest is already punched in. Please punch out first");
  }

  return prisma.punchEvent.create({
    data: {
      type: PunchType.IN,
      personType: PersonType.GUEST,
      guestId,
    },
    include: { guest: true },
  });
};

export const punchOutGuest = async (guestId: string) => {
  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest) throw new Error("Guest not found");

  const last = await getLastPunchEvent(PersonType.GUEST, guestId);
  if (!last || last.type === PunchType.OUT) {
    throw new Error("Guest is not punched in");
  }

  return prisma.punchEvent.create({
    data: {
      type: PunchType.OUT,
      personType: PersonType.GUEST,
      guestId,
    },
    include: { guest: true },
  });
};

export const getPunchHistory = async (
  personType: PersonType,
  id: string,
  page = 1,
  limit = 20
) => {
  const where =
    personType === PersonType.EMPLOYEE ? { employeeId: id } : { guestId: id };

  const [events, total] = await Promise.all([
    prisma.punchEvent.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.punchEvent.count({ where }),
  ]);

  return {
    events,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};