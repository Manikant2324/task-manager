const fs = require('fs');
const path = require('path');
(async () => {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'createtaskuser@example.com', password: 'password123' }),
  });
  const loginBody = await loginRes.json();
  if (!loginBody.token) {
    console.error('login failed', loginBody);
    process.exit(1);
  }
  const form = new FormData();
  form.append('title', 'Task create test');
  form.append('description', 'desc');
  form.append('priority', 'medium');
  form.append('status', 'pending');
  const fileBlob = new Blob([new TextEncoder().encode('%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')], { type: 'application/pdf' });
  form.append('documents', fileBlob, 'debug.pdf');
  const res = await fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + loginBody.token },
    body: form,
  });
  console.log('status', res.status);
  console.log(await res.text());
})();