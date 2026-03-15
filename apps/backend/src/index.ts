import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/database';

async function main() {
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing gracefully...');
    await prisma.$disconnect();
    process.exit(0);
  });
}

main().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
