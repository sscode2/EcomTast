// DOM Elements
        const adminPanel = document.getElementById('adminPanel');
        const adminToggle = document.getElementById('adminToggle');
        const refreshBtn = document.getElementById('refreshBtn');
        const booksGrid = document.getElementById('booksGrid');
        const booksList = document.getElementById('booksList');
        const ordersList = document.getElementById('ordersList');
        const recentOrders = document.getElementById('recentOrders');
        const addBookForm = document.getElementById('addBookForm');
        const adminTabs = document.querySelectorAll('.admin-tab');
        const adminSections = document.querySelectorAll('.admin-section');

        // Stats elements
        const totalBooks = document.getElementById('totalBooks');
        const totalOrders = document.getElementById('totalOrders');
        const totalRevenue = document.getElementById('totalRevenue');
        const usersCount = document.getElementById('usersCount');

        // Initialize the page
        function init() {
            renderBooks();
            updateStats();
            renderOrders();
            setupEventListeners();
            setupCommunication();
        }

        // Render books in the user panel
        function renderBooks() {
            const books = sharedData.getBooks();
            booksGrid.innerHTML = '';
            booksList.innerHTML = '';
            
            books.forEach(book => {
                // Add to user panel
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
                            <button class="btn btn-primary btn-sm" onclick="openBuyModal('${book.title}')">Buy Now</button>
                            <button class="btn btn-sm" onclick="openDetailsModal(${book.id})">Details</button>
                        </div>
                    </div>
                `;
                booksGrid.appendChild(bookCard);
                
                // Add to admin panel
                const bookRow = document.createElement('tr');
                bookRow.innerHTML = `
                    <td>${book.title}</td>
                    <td>$${book.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm" onclick="editBook(${book.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                `;
                booksList.appendChild(bookRow);
            });
        }

        // Update statistics
        function updateStats() {
            const books = sharedData.getBooks();
            const orders = sharedData.getOrders();
            
            totalBooks.textContent = books.length;
            totalOrders.textContent = orders.length;
            
            const revenue = orders.reduce((sum, order) => sum + order.price, 0);
            totalRevenue.textContent = revenue.toFixed(2);
            
            usersCount.textContent = Math.floor(books.length * 3.7); // Simulated user count
            
            // Update recent orders
            recentOrders.innerHTML = '';
            orders.slice(0, 3).forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>#${order.id}</td>
                    <td>${order.book}</td>
                    <td>$${order.price.toFixed(2)}</td>
                    <td>${order.status}</td>
                `;
                recentOrders.appendChild(row);
            });
        }

        // Render orders in admin panel
        function renderOrders() {
            const orders = sharedData.getOrders();
            ordersList.innerHTML = '';
            
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>#${order.id}</td>
                    <td>${order.customer}</td>
                    <td>$${order.price.toFixed(2)}</td>
                    <td>${order.status}</td>
                    <td>
                        <button class="btn btn-sm">View</button>
                    </td>
                `;
                ordersList.appendChild(row);
            });
        }

        // Add a new book
        function addBook(event) {
            event.preventDefault();
            
            const title = document.getElementById('bookTitle').value;
            const price = parseFloat(document.getElementById('bookPrice').value);
            const image = document.getElementById('bookImage').value;
            const description = document.getElementById('bookDescription').value;
            const learnings = document.getElementById('bookLearnings').value.split('\n');
            
            const newBook = {
                title,
                price,
                image,
                description,
                learnings: learnings.filter(l => l.trim() !== '')
            };
            
            sharedData.addBook(newBook);
            
            // Reset form
            addBookForm.reset();
            
            // Show notification
            alert(`Book "${title}" has been added successfully!`);
        }

        // Edit a book
        function editBook(id) {
            const book = sharedData.getBookById(id);
            if (book) {
                // In a real app, you would show a modal or form to edit the book
                // For now, we'll just show an alert with book details
                alert(`Editing book: ${book.title}\nPrice: $${book.price.toFixed(2)}\nDescription: ${book.description}`);
                // You would implement the actual edit functionality here
            }
        }

        // Delete a book
        function deleteBook(id) {
            if (confirm('Are you sure you want to delete this book?')) {
                sharedData.deleteBook(id);
                alert('Book has been deleted successfully!');
            }
        }

        // Open buy modal (to be called from user panel)
        function openBuyModal(bookTitle) {
            // This function will be called from the user panel
            // In a real implementation, you would communicate with the user panel
            alert(`Opening buy modal for: ${bookTitle}\nIn a full implementation, this would open the purchase flow.`);
        }

        // Open details modal (to be called from user panel)
        function openDetailsModal(bookId) {
            // This function will be called from the user panel
            // In a real implementation, you would communicate with the user panel
            const book = sharedData.getBookById(bookId);
            if (book) {
                alert(`Showing details for: ${book.title}\nPrice: $${book.price.toFixed(2)}\nDescription: ${book.description}`);
            }
        }

        // Set up event listeners
        function setupEventListeners() {
            // Admin panel toggle
            adminToggle.addEventListener('click', () => {
                adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
            });
            
            // Refresh button
            refreshBtn.addEventListener('click', () => {
                renderBooks();
                updateStats();
                renderOrders();
                alert('Data refreshed successfully!');
            });
            
            // Admin tabs
            adminTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.dataset.tab;
                    
                    // Update active tab
                    adminTabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Show corresponding section
                    adminSections.forEach(section => {
                        section.classList.remove('active');
                        if (section.id === `${target}Section`) {
                            section.classList.add('active');
                        }
                    });
                });
            });
            
            // Add book form
            addBookForm.addEventListener('submit', addBook);
        }

        // Set up communication between panels
        function setupCommunication() {
            // Listen for book changes
            panelComm.subscribe('bookChange', () => {
                renderBooks();
                updateStats();
            });
            
            // Listen for order changes
            panelComm.subscribe('orderChange', () => {
                updateStats();
                renderOrders();
            });
        }

        // Initialize the application
        init();