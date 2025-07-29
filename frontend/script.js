    let token = localStorage.getItem('authToken') || "";

    function showMessage(msg, isError = false) {
      const response = document.getElementById('response');
      response.className = isError ? 'message error' : 'message';
      response.innerText = msg;
    }

    function toggleForm(type) {
      document.getElementById('login-form').classList.remove('active');
      document.getElementById('register-form').classList.remove('active');
      if (type === 'login') {
        document.getElementById('login-form').classList.add('active');
      } else if (type === 'register') {
        document.getElementById('register-form').classList.add('active');
      }
    }

    function register() {
      const username = document.getElementById('reg-name').value;
      const email = document.getElementById('reg-email').value;
      const password = document.getElementById('reg-password').value;

      fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      .then(res => res.json())
      .then(data => {
        showMessage(data.msg || "Registration completed", data.error);
      })
      .catch(err => showMessage('Registration failed', true));
    }

    function login() {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.token && data.user) {
          token = data.token;
          localStorage.setItem('authToken', token);
          showMessage(`Welcome, ${data.user.name}`);
        } else {
          showMessage(JSON.stringify(data, null, 2), true);
        }
      })
      .catch(err => showMessage('Login failed', true));
    }

    function checkAdmin() {
  if (!token) return showMessage("Please login first!", true);

  fetch("http://localhost:5000/api/auth/admin", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Access denied");
      }
      return res.json();
    })
    .then(data => {
      if (data.error) {
        showMessage(data.error, true);
      } else {
        showMessage("✅ Access granted. Welcome Admin!", false);
        // Optionally, load admin dashboard here
        // loadAdminDashboard(data); 
      }
    })
    .catch(err => {
      console.error("Admin check error:", err);
      showMessage("❌ Admin check failed. " + err.message, true);
    });
}

    function logout() {
      token = "";
      localStorage.removeItem('authToken');
      showMessage('You have been logged out.');
    }
 