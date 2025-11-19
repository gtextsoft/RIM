document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Submission Handling (Mock)
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = 'Processing...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerText = 'Access Granted!';
                btn.style.backgroundColor = '#4CAF50'; // Green
                btn.style.color = '#fff';
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.style.marginTop = '20px';
                successMsg.style.padding = '15px';
                successMsg.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                successMsg.style.border = '1px solid #4CAF50';
                successMsg.style.borderRadius = '5px';
                successMsg.style.color = '#4CAF50';
                successMsg.style.textAlign = 'center';
                successMsg.innerHTML = '<strong>Registration Successful!</strong><br>Check your email for the access link.';
                
                form.appendChild(successMsg);
                form.reset();
            }, 1500);
        });
    }
});
