export const formatError = (error: Error) => {
  return `Stack: ${error.stack} ;; Message: ${error.message} ;; Cause: ${error.cause}`;
};
