import { sendPasswordResetEmail as firebaseSendPasswordResetEmail } from "firebase/auth";
import { auth } from "./config";

export const resetPassword = async (email: string) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return { success: true, message: "Link de recuperação enviado. Verifique sua caixa de entrada, lixo eletrônico ou pasta de SPAM." };
  } catch (error: any) {
    console.error("Error sending reset email", error);
    return { success: false, message: error.message || "Erro ao enviar email." };
  }
};
