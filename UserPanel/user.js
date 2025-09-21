// Current selected book for purchase
        let currentBook = "";

        // Initialize the page
        function init() {
            renderBooks();
            setupEventListeners();
            setupCommunication();
        }

        // Render books in the user panel
        function renderBooks() {
            const books = sharedData.getBooks();
            const booksGrid = document.getElementById('booksGrid');
            booksGrid.innerHTML = '';
            
            books.forEach((book, index) => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                bookCard.innerHTML = `
                    <div class="book-cover">
                        <img src="${book.image}" alt="${book.title}">
                    </div>
                    <div class="book-info">
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-price">$${book.price.toFixed(2)}</p>
                        <div class="book-actions">
                            <button class="btn btn-buy" onclick="openBuyModal('${book.title}')">Buy Now</button>
                            <button class="btn btn-details" onclick="openDetailsModal(${book.id})">Details</button>
                        </div>
                    </div>
                `;
                booksGrid.appendChild(bookCard);
            });
        }

        // Open buy modal
        function openBuyModal(bookTitle) {
            currentBook = bookTitle;
            document.getElementById('book').value = bookTitle;
            
            // Set the amount based on the book
            const book = sharedData.getBookByTitle(bookTitle);
            if (book) {
                document.getElementById('amount').value = `$${book.price.toFixed(2)}`;
            }
            
            // Reset form to first step
            document.getElementById('step1').style.display = 'block';
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'none';
            
            // Update step indicators
            const steps = document.querySelectorAll('.form-step');
            steps.forEach((step, index) => {
                step.classList.remove('step-active', 'step-completed');
                if (index === 0) step.classList.add('step-active');
            });
            
            document.getElementById('buyModal').style.display = 'block';
        }

        // Open details modal
        function openDetailsModal(bookId) {
            const book = sharedData.getBookById(bookId);
            if (!book) return;
            
            document.getElementById('detailTitle').textContent = book.title;
            document.getElementById('detailPrice').textContent = `$${book.price.toFixed(2)}`;
            document.getElementById('detailDescription').textContent = book.description;
            document.getElementById('detailCover').src = book.image;
            
            // Clear previous learnings
            const learnList = document.getElementById('learnList');
            learnList.innerHTML = '';
            
            // Add learnings
            book.learnings.forEach(learning => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check-circle"></i> ${learning}`;
                learnList.appendChild(li);
            });
            
            // Set up buy button
            document.getElementById('detailBuyBtn').onclick = function() {
                closeModal('detailsModal');
                openBuyModal(book.title);
            };
            
            document.getElementById('detailsModal').style.display = 'block';
        }

        // Close modal
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Next step in form
        function nextStep(currentStep) {
            // Validate current step
            if (currentStep === 1) {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const country = document.getElementById('country').value;
                
                if (!name || !email || !phone || !country) {
                    alert('Please fill all required fields');
                    return;
                }
            } else if (currentStep === 2) {
                const bank = document.getElementById('bank').value;
                const account = document.getElementById('account').value;
                const holder = document.getElementById('holder').value;
                
                if (!bank || !account || !holder) {
                    alert('Please fill all required fields');
                    return;
                }
                
                // Prepare order summary
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const book = document.getElementById('book').value;
                const amount = document.getElementById('amount').value;
                
                document.getElementById('orderSummary').innerHTML = `
                    <p><strong>Book:</strong> ${book}</p>
                    <p><strong>Amount:</strong> ${amount}</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                `;
            }
            
            // Hide current step
            document.getElementById(`step${currentStep}`).style.display = 'none';
            
            // Show next step
            document.getElementById(`step${currentStep + 1}`).style.display = 'block';
            
            // Update step indicators
            const steps = document.querySelectorAll('.form-step');
            steps[currentStep - 1].classList.remove('step-active');
            steps[currentStep - 1].classList.add('step-completed');
            steps[currentStep].classList.add('step-active');
        }

        // Previous step in form
        function prevStep(currentStep) {
            // Hide current step
            document.getElementById(`step${currentStep}`).style.display = 'none';
            
            // Show previous step
            document.getElementById(`step${currentStep - 1}`).style.display = 'block';
            
            // Update step indicators
            const steps = document.querySelectorAll('.form-step');
            steps[currentStep - 1].classList.remove('step-active');
            steps[currentStep - 2].classList.add('step-active');
        }

        // Form submission
        function submitOrder(event) {
            event.preventDefault();
            
            // In a real implementation, you would send this data to a server
            // For now, we'll just show an alert
            alert('Purchase completed successfully! Thank you for your order.');
            
            // Add order to shared data
            const bookTitle = document.getElementById('book').value;
            const book = sharedData.getBookByTitle(bookTitle);
            if (book) {
                const order = {
                    book: bookTitle,
                    customer: document.getElementById('name').value,
                    price: book.price,
                    status: "Processing"
                };
                sharedData.addOrder(order);
            }
            
            closeModal('buyModal');
        }

        // Set up event listeners
        function setupEventListeners() {
            // Form submission
            document.getElementById('buyForm').addEventListener('submit', submitOrder);
            
            // Close modals when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    e.target.style.display = 'none';
                }
            });
        }

        // Set up communication between panels
        function setupCommunication() {
            // Listen for book changes
            panelComm.subscribe('bookChange', () => {
                renderBooks();
            });
            
            // Listen for order changes
            panelComm.subscribe('orderChange', () => {
                // Update any order-related UI if needed
            });
        }

        // Initialize the application
        init();