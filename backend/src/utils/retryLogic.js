// Retry logic utility with exponential backoff
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Execute an operation with retry logic
 * @param {Function} operation - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} options.baseDelay - Base delay in ms (default: 1000)
 * @param {Function} options.onRetry - Callback function on each retry
 */
const withRetry = async (operation, options = {}) => {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        onRetry = null
    } = options;

    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries) {
                throw error;
            }

            // Exponential backoff: 1s, 2s, 4s...
            const delayTime = baseDelay * Math.pow(2, attempt - 1);

            if (onRetry) {
                onRetry(attempt, delayTime, error);
            }

            await delay(delayTime);
        }
    }

    throw lastError;
};

module.exports = {
    delay,
    withRetry
};
