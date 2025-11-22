import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Lấy token từ Firebase
    const token = await user.getIdToken();
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      token,
    };
  } catch (error: unknown) {
    console.error('Google Sign-In Error:', error);
    
    const errorMessage = (error as { message?: string }).message || 'Đăng nhập thất bại';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export const signOutFirebase = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error: unknown) {
    console.error('Sign Out Error:', error);
    return {
      success: false,
      error: (error as { message?: string }).message || 'Đăng xuất thất bại',
    };
  }
};
