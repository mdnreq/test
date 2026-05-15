const ngrok = require('ngrok');

async function startTunnel() {
  try {
    console.log('\n🌐 Starting public tunnel...\n');
    
    const url = await ngrok.connect({
      proto: 'http',
      addr: 3001,
      onLogEvent: (data) => {
        if (data.includes('started') || data.includes('Established')) {
          console.log(data);
        }
      }
    });

    console.log('\n✓ Tunnel created successfully!\n');
    console.log('═'.repeat(60));
    console.log('PUBLIC URL FOR CLIENTS:');
    console.log('═'.repeat(60));
    console.log(`\n  🔗 ${url}\n`);
    console.log('═'.repeat(60));
    console.log('\nShare this URL with your clients.');
    console.log('Your local dev server is now publicly accessible.\n');
    console.log('Press Ctrl+C to stop the tunnel.\n');

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

startTunnel();

// Keep the tunnel running
process.on('SIGINT', async () => {
  console.log('\n\nShutting down tunnel...');
  await ngrok.kill();
  process.exit(0);
});
