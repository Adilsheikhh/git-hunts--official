
// Handle Firebase auth errors
export const handleFirebaseError = (error: any) => {
  let message = "An error occurred. Please try again.";
  
  if (error.code) {
    switch (error.code) {
      case 'auth/invalid-api-key':
        message = "Firebase API key is missing or invalid. Please check your environment variables.";
        break;
      case 'auth/unauthorized-domain':
        message = "This domain is not authorized for authentication. Add it to Firebase authorized domains.";
        break;
      case 'auth/user-not-found':
        message = "No account found with this email.";
        break;
      case 'auth/wrong-password':
        message = "Incorrect password.";
        break;
      case 'auth/email-already-in-use':
        message = "Email already in use.";
        break;
      case 'auth/weak-password':
        message = "Password is too weak.";
        break;
      case 'auth/popup-closed-by-user':
        message = "Authentication popup was closed before completing the sign in process.";
        break;
      default:
        message = error.message || "Authentication error. Please try again.";
    }
  }
  
  return message;
};
