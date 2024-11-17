// Initialize localStorage data if not already set
if (!localStorage.getItem('bankData')) {
  localStorage.setItem('bankData', JSON.stringify({ users: {} }));
}

// Helper function to fetch data from localStorage
function getBankData() {
  return JSON.parse(localStorage.getItem('bankData'));
}

// Helper function to save data to localStorage
function saveBankData(data) {
  localStorage.setItem('bankData', JSON.stringify(data));
}

// Register functionality (used on `register.html`)
if (window.location.pathname.includes('register.html')) {
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    const bankData = getBankData();

    if (bankData.users[username]) {
      alert('Username already exists!');
      return;
    }

    // Add user to the data
    bankData.users[username] = { password, balance: 1000 };
    saveBankData(bankData);

    alert('Registration successful! Redirecting to login...');
    window.location.href = 'index.html';
  });
}

// Login functionality (used on `index.html`)
if (window.location.pathname.includes('index.html')) {
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const bankData = getBankData();

    if (bankData.users[username] && bankData.users[username].password === password) {
      // Store the logged-in user in sessionStorage
      sessionStorage.setItem('currentUser', username);
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid username or password.');
    }
  });
}

// Dashboard functionality (used on `dashboard.html`)
if (window.location.pathname.includes('dashboard.html')) {
  const username = sessionStorage.getItem('currentUser');
  const bankData = getBankData();

  if (!username || !bankData.users[username]) {
    alert('You must log in first.');
    window.location.href = 'index.html';
  }

  // Display user details
  document.getElementById('user-display').textContent = username;
  document.getElementById('balance').textContent = bankData.users[username].balance.toFixed(2);
}

// Transfer functionality (used on `transfer.html`)
if (window.location.pathname.includes('transfer.html')) {
  const username = sessionStorage.getItem('currentUser');
  const bankData = getBankData();

  if (!username || !bankData.users[username]) {
    alert('You must log in first.');
    window.location.href = 'index.html';
  }

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const recipient = document.getElementById('recipient').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);

    if (!bankData.users[recipient]) {
      alert('Recipient does not exist.');
      return;
    }

    if (amount <= 0 || amount > bankData.users[username].balance) {
      alert('Invalid amount. Ensure you have sufficient balance.');
      return;
    }

    // Perform transfer
    bankData.users[username].balance -= amount;
    bankData.users[recipient].balance += amount;

    saveBankData(bankData);

    alert(`Transfer successful! New balance: $${bankData.users[username].balance.toFixed(2)}`);
    window.location.href = 'dashboard.html';
  });
}

// Loan functionality (used on `loan.html`)
if (window.location.pathname.includes('loan.html')) {
  const username = sessionStorage.getItem('currentUser');
  const bankData = getBankData();

  if (!username || !bankData.users[username]) {
    alert('You must log in first.');
    window.location.href = 'index.html';
  }

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const loanAmount = parseFloat(document.getElementById('loan-amount').value);

    if (loanAmount <= 0) {
      alert('Invalid loan amount.');
      return;
    }

    // Add loan amount to user's balance
    bankData.users[username].balance += loanAmount;

    saveBankData(bankData);

    alert(`Loan approved! New balance: $${bankData.users[username].balance.toFixed(2)}`);
    window.location.href = 'dashboard.html';
  });
}