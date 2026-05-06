import prisma from "../../lib/prisma";

export const createGuest = async (data: {
  name: string;
  phone?: string;
  purpose?: string;
}) => {
  return prisma.guest.create({ data });
};

export const getGuests = async (page = 1, limit = 10) => {
  const [guests, total] = await Promise.all([
    prisma.guest.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.guest.count(),
  ]);
  return {
    guests,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
};

export const getGuestById = async (id: string) => {
  const guest = await prisma.guest.findUnique({ where: { id } });
  if (!guest) throw new Error("Guest not found");
  return guest;
};