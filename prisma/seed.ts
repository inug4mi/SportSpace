import { PrismaClient, Role } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  const adminEmail = process.env.ADMIN_EMAIL || (!isProduction ? 'helloadmin@udea.edu.co' : null);
  const adminPassword = process.env.ADMIN_PASSWORD || (!isProduction ? 'AdminPass123!' : null);
  if (!adminEmail || !adminPassword) {
    throw new Error('❌ En producción es obligatorio definir ADMIN_EMAIL y ADMIN_PASSWORD.');
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await argon2.hash(adminPassword, { type: argon2.argon2id });
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
      },
    });
    console.log(`[SEED] Usuario ADMIN inicial creado: ${adminEmail}`);
  } else {
    console.log(`[SEED] El usuario ADMIN ya existe.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });