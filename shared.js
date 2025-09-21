// Shared data and functions between Admin and User panels

// Book data shared between panels
let books = [
    {
        id: 1,
        title: "The Complete Web Development Guide",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "A comprehensive guide to modern web development covering HTML, CSS, JavaScript, and popular frameworks.",
        learnings: [
            "HTML5 and semantic markup",
            "CSS3 and responsive design",
            "JavaScript and ES6 features",
            "Frontend frameworks like React",
            "Backend development with Node.js",
            "Database integration and deployment"
        ]
    },
    {
        id: 2,
        title: "Data Science Fundamentals",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1536746803623-cef87080c7b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Learn the fundamentals of data science, from data collection to analysis and visualization.",
        learnings: [
            "Data collection and cleaning techniques",
            "Statistical analysis methods",
            "Data visualization principles",
            "Machine learning basics",
            "Python for data science",
            "Working with large datasets"
        ]
    },
    {
        id: 3,
        title: "Python Programming Mastery",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Master Python programming from basics to advanced concepts with practical examples.",
        learnings: [
            "Python syntax and basic constructs",
            "Object-oriented programming in Python",
            "Working with files and databases",
            "Web scraping with Python",
            "Building web applications with Flask",
            "Automation and scripting tasks"
        ]
    }
];

// Orders data
let orders = [
    { id: 1001, book: "The Complete Web Development Guide", customer: "John Doe", price: 24.99, status: "Completed" },
    { id: 1002, book: "Data Science Fundamentals", customer: "Jane Smith", price: 29.99, status: "Processing" },
    { id: 1003, book: "Python Programming Mastery", customer: "Robert Johnson", price: 19.99, status: "Pending" }
];

// Export functions to manage books
function getBooks() {
    return books;
}

function addBook(book) {
    book.id = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    books.push(book);
    // Notify about the change
    if (typeof notifyBookChange === 'function') {
        notifyBookChange();
    }
    return book;
}

function updateBook(id, updatedBook) {
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        books[index] = { ...books[index], ...updatedBook };
        // Notify about the change
        if (typeof notifyBookChange === 'function') {
            notifyBookChange();
        }
        return books[index];
    }
    return null;
}

function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    // Notify about the change
    if (typeof notifyBookChange === 'function') {
        notifyBookChange();
    }
}

function getBookById(id) {
    return books.find(book => book.id === id);
}

function getBookByTitle(title) {
    return books.find(book => book.title === title);
}

// Export functions to manage orders
function getOrders() {
    return orders;
}

function addOrder(order) {
    order.id = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1001;
    orders.push(order);
    // Notify about the change
    if (typeof notifyOrderChange === 'function') {
        notifyOrderChange();
    }
    return order;
}

function updateOrder(id, updatedOrder) {
    const index = orders.findIndex(order => order.id === id);
    if (index !== -1) {
        orders[index] = { ...orders[index], ...updatedOrder };
        // Notify about the change
        if (typeof notifyOrderChange === 'function') {
            notifyOrderChange();
        }
        return orders[index];
    }
    return null;
}

// Make functions available globally
window.sharedData = {
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getBookByTitle,
    getOrders,
    addOrder,
    updateOrder
};