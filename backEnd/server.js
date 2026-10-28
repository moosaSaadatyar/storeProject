/**
 * نقطه‌ی شروع سرور — اتصال DB، seed اولیه و listen
 */
require('./src/config/env');

const { connectDB, disconnectDB } = require('./src/database/db');
const { seedDatabase } = require('./src/utils/seed');
const app = require('./app');

async function start() {
  await connectDB();
  await seedDatabase();

  const port = parseInt(process.env.PORT, 10) || 3000;
  const server = app.listen(port, () => {
    console.log(`[server] API در حال اجراست: http://localhost:${port}`);
    console.log(`[server] سلامت سرویس: http://localhost:${port}/api/health`);
  });

  // بستن منظم در صورت اتمام فرآیند
  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[server] دریافت ${signal} — در حال بسته شدن...`);
    server.close(async () => {
      try {
        await disconnectDB();
        console.log('[server] سرور به‌درستی متوقف شد.');
        process.exit(0);
      } catch (err) {
        console.error('[server] خطا در بستن پایگاه داده:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  console.error('[server] خطا در راه‌اندازی سرور:', err);
  process.exit(1);
});
