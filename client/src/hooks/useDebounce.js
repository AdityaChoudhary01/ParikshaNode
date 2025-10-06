import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value.
 * @param {any} value - The value to debounce (e.g., the searchTerm).
 * @param {1000} delay - The delay in milliseconds (e.g., 500).
 * @returns {any} The debounced value.
 */
const useDebounce = (value, delay) => {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function to cancel the timeout if value changes again
        // or if the component unmounts. This is crucial for debouncing.
        return () => {
            clearTimeout(handler);
        };
    }, 
    // Effect runs only when value or delay changes
    [value, delay] 
    );

    return debouncedValue;
};

// Export if in a separate file, but for this solution, we'll keep it locally.
// export { useDebounce };
