import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const upsertOrder = await prisma.order.upsert({
    where: {
      email: "test@mail.io",
      id: 1,
    },
    update: {},
    create: {
      firstName: "Tariq",
      lastName: "St. Patrick",
      courseType: "Project Management for Training",
      courseScheduleType: "weekday",
      courseSchedule: [
        new Date("2024-04-13"),
        new Date("2024-04-14"),
        new Date("2024-04-15"),
        new Date("2024-04-16"),
        new Date("2024-04-17"),
      ],
      startDate: "2024-04-13",
      email: "test@mail.io",
      amount: 10000,
      participants: [
        {
          id: 1,
          firstName: "Samson",
          lastName: "Ekong",
          otherName: "Chisom",
        },
        {
          id: 2,
          firstName: "Elizabeth",
          lastName: "Lesley",
        },
      ],
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    include: { transaction: true },
  });

  const upsertTransaction = await prisma.transaction.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      txid: "3",
      orderRef: upsertOrder.id,
      pid: "sample_pid",
      reference: "sample_reference",
      status: "completed",
      accessCode: "sample_accessCode",
      currency: "naira",
      fee: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(upsertTransaction);

  const updatedOrder = await prisma.order.update({
    where: {
      email: "test@mail.io",
      id: 1,
    },
    data: {
      transaction: { connect: { id: upsertTransaction.id } },
    },
    include: { transaction: true },
  });

  console.log(updatedOrder);

  const updatePromocode = await prisma.promoCode.upsert({
    where: { code: "test-promocode" },
    update: {},
    create: {
      code: "test-promocode",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    },
  });

  console.log(updatePromocode);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
