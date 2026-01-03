// Get form elements
const form = document.getElementById('subscriptionForm');
const emailInput = document.getElementById('emailInput');
const submitBtn = document.getElementById('submitBtn');
const messageElement = document.getElementById('subscriptionMessage');

// Function to handle email submission using EmailJS
async function handleEmailSubmission(email) {
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // Initialize EmailJS (replace with your Public Key)
        emailjs.init("YOUR_PUBLIC_KEY"); // Get this from emailjs.com

        // Send email
        const response = await emailjs.send(
            "SERVICE_ID", // Replace with your Service ID
            "TEMPLATE_ID", // Replace with your Template ID
            {
                subscriber_email: email,
                to_email: "your-email@gmail.com" // Your email address
            }
        );

        if (response.status === 200) {
            showMessage('✓ Email sent successfully! Check your inbox.', 'success');
            // Clear input
            emailInput.value = '';
        } else {
            showMessage('✗ Failed to send email. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('✗ Connection error. Please try again later.', 'error');
    } finally {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Function to show message
function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = 'subscription-message ' + type;

    // Auto-hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    handleEmailSubmission(email);
});

// Allow submission with Enter key
emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});

/*---------------------------------------------------------------*/
//Quick Setup:

//Go to emailjs.com and create a free account
/*Get your credentials:

Public Key
Service ID (Gmail or your email provider)
Template ID


Replace these in the code:

javascript   emailjs.init("YOUR_PUBLIC_KEY");
   
   emailjs.send(
       "SERVICE_ID",
       "TEMPLATE_ID",
       {...}
   );

Create an Email Template in EmailJS dashboard with variables:

{{subscriber_email}} - The subscriber's email
{{to_email}} - Your email address*/