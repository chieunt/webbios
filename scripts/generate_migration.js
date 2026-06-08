const { spawn } = require('child_process');

const p = spawn('npx', ['drizzle-kit', 'generate'], { cwd: 'packages/db', shell: true });

let outputBuffer = '';

p.stdout.on('data', (data) => {
  const str = data.toString();
  process.stdout.write(str);
  outputBuffer += str;

  if (outputBuffer.includes('Is sec_menus table created or renamed from another table?')) {
    // Need to accept "create table" which is the first option
    setTimeout(() => {
      p.stdin.write('\r\n');
      outputBuffer = '';
    }, 500);
  } else if (outputBuffer.includes('created or renamed from another table?')) {
    // For roles, permissions, role_permissions, users, sessions
    // We need to move cursor DOWN to "rename table"
    setTimeout(() => {
      p.stdin.write('\u001B[B'); // Arrow down
      setTimeout(() => {
        p.stdin.write('\r\n');
        outputBuffer = '';
      }, 200);
    }, 500);
  }
});

p.stderr.on('data', (data) => {
  console.error(data.toString());
});

p.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});
