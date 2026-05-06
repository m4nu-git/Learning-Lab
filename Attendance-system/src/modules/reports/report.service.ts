import { PersonType, PunchType } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";

interface DailyBreakdown {
  date: string;
  totalMinutes: number;
  totalHours: string;
  sessions: { punchIn: Date; punchOut: Date | null; minutes: number }[];
}

const calculateWorkingMinutes = (
  events: { type: PunchType; timestamp: Date }[]
): { totalMinutes: number; sessions: { punchIn: Date; punchOut: Date | null; minutes: number }[] } => {
  let totalMinutes = 0;
  const sessions: { punchIn: Date; punchOut: Date | null; minutes: number }[] = [];

  let lastPunchIn: Date | null = null;

  for (const event of events) {
    if (event.type === PunchType.IN) {
      lastPunchIn = event.timestamp;
    } else if (event.type === PunchType.OUT && lastPunchIn) {
      const minutes = Math.floor(
        (event.timestamp.getTime() - lastPunchIn.getTime()) / 60000
      );
      totalMinutes += minutes;
      sessions.push({ punchIn: lastPunchIn, punchOut: event.timestamp, minutes });
      lastPunchIn = null;
    }
  }

  // Handle open punch-in (no punch-out)
  if (lastPunchIn) {
    sessions.push({ punchIn: lastPunchIn, punchOut: null, minutes: 0 });
  }

  return { totalMinutes, sessions };
};

const formatHours = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

export const getDailyReport = async (
  employeeId: string,
  date: string // YYYY-MM-DD
) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) throw new Error("Employee not found");

  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  const events = await prisma.punchEvent.findMany({
    where: {
      employeeId,
      personType: PersonType.EMPLOYEE,
      timestamp: { gte: start, lte: end },
    },
    orderBy: { timestamp: "asc" },
  });

  const { totalMinutes, sessions } = calculateWorkingMinutes(events);

  return {
    employee: { id: employee.id, name: employee.name, employeeCode: employee.employeeCode },
    date,
    totalMinutes,
    totalHours: formatHours(totalMinutes),
    sessions,
    rawEvents: events,
  };
};

export const getMonthlyReport = async (
  employeeId: string,
  year: number,
  month: number // 1-12
) => {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) throw new Error("Employee not found");

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const events = await prisma.punchEvent.findMany({
    where: {
      employeeId,
      personType: PersonType.EMPLOYEE,
      timestamp: { gte: start, lte: end },
    },
    orderBy: { timestamp: "asc" },
  });

  // Group events by day
  const byDay = new Map<string, typeof events>();
  for (const event of events) {
    const day = event.timestamp.toISOString().split("T")[0]!;
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(event);
  }

  const breakdown: DailyBreakdown[] = [];
  let totalMonthMinutes = 0;

  for (const [date, dayEvents] of byDay.entries()) {
    const { totalMinutes, sessions } = calculateWorkingMinutes(dayEvents);
    totalMonthMinutes += totalMinutes;
    breakdown.push({
      date,
      totalMinutes,
      totalHours: formatHours(totalMinutes),
      sessions,
    });
  }

  return {
    employee: { id: employee.id, name: employee.name, employeeCode: employee.employeeCode },
    year,
    month,
    totalMinutes: totalMonthMinutes,
    totalHours: formatHours(totalMonthMinutes),
    daysPresent: breakdown.length,
    breakdown: breakdown.sort((a, b) => a.date.localeCompare(b.date)),
  };
};