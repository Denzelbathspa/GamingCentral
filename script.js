const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });

        // Form validation and redirection
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm(this)) {
                window.location.href = 'GOW/GOW.html';
            }
        });

        document.getElementById('registerForm').addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm(this)) {
                window.location.href = 'GOW/GOW.html';
            }
        });

        function validateForm(form) {
            const inputs = form.querySelectorAll('input[required]');
            for (let input of inputs) {
                if (!input.value) {
                    alert('Please fill out all required fields.');
                    return false;
                }
            }
            return true;
        }