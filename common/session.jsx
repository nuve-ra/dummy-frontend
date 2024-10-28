// Store a value in session storage
const storeInSession = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value)); // Store value as a string
};

// Retrieve a value from session storage
const lookInSession = (key) => {
    const value = sessionStorage.getItem(key); // Get value as a string
    return value ? JSON.parse(value) : null; // Parse the string back to an object or return null
};

// Remove a value from session storage
const removeFromSession = (key) => {
    sessionStorage.removeItem(key); // Remove item by key
};

// Export the functions
export { storeInSession, lookInSession, removeFromSession };
