// ----- Theme Functionality -----
const themeToggle = document.querySelector('.theme-toggle');
const themeToggleText = document.querySelector('.theme-toggle__text');

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleText.textContent = 'Light Mode';
} else {
  document.body.classList.add('light-mode');
  localStorage.setItem('theme', 'light');
  themeToggleText.textContent = 'Dark Mode';
}

themeToggle.onclick = () => {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  const isLightMode = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  themeToggleText.textContent = isLightMode ? 'Dark Mode' : 'Light Mode';
};

// ----- Chat UI Handling -----
const outputDiv = document.getElementById('output');
const chatInput = document.querySelector('.chat-input__field');
const chatForm = document.querySelector('.chat-input');

// Function to handle chat messages
async function handleChat(message) {
  try {
    // Display user message and AI thinking message
    outputDiv.innerHTML = marked.parse(`**User**: ${message}\n\n*AI is thinking...*`);

    // Send user message to the server
    const response = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    // Display AI response
    outputDiv.innerHTML = marked.parse(`**User**: ${message}\n\n**AI**: ${data.response}`);
  } catch (error) {
    // Display error message
    outputDiv.innerHTML = marked.parse(`❌ **Error**: ${error.message}`);
  }
}

// Event listener for form submission
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  chatInput.value = '';
  handleChat(message);
});

// Event listener for Shift + Enter to send message
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    chatInput.value = '';
    handleChat(message);
  }
});

// Event listeners for action buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.querySelector('.btn__text').textContent;
    chatInput.value = action + " ";
    chatInput.focus();
  });
});
