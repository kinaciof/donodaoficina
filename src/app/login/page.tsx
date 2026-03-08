"use client";

import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Car, Lock, Mail, AlertCircle, FileText, Phone, Wrench } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type AuthMode = "login" | "register" | "forgot_password";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [isInformal, setIsInformal] = useState(false);

  const resetMessages = () => {
    setError("");
    setSuccessMsg("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError("Credenciais inválidas. Verifique seu e-mail e senha.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    if (!isInformal && !cnpj) {
      setError("Por favor, preencha o CNPJ ou marque 'Oficina Informal'.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Trial calculation
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 15);

      // Create user profile
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: email,
          firstName,
          lastName,
          cpf,
          phone,
          role: "owner",
          tenant_id: user.uid, // Owner is their own tenant initially
          createdAt: new Date(),
          status: "active"
        });
        
        // Initialize tenant document
        await setDoc(doc(db, "tenants", user.uid), {
          tenant_id: user.uid,
          owner_uid: user.uid,
          company_name: company,
          cnpj: isInformal ? "Informal" : cnpj,
          isInformal,
          createdAt: new Date(),
          trialEndsAt: trialEndsAt,
          status: "active"
        });
      } catch (firestoreError: any) {
        console.error("Firestore Error:", firestoreError);
        setError(`Conta criada, mas houve um erro ao salvar o perfil no banco de dados (Verifique as regras do Firestore). Detalhe: ${firestoreError.message}`);
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este e-mail já está cadastrado.");
      } else if (err.code === 'auth/weak-password') {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError(`Erro ao criar conta: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    if (!email) {
      setError("Por favor, preencha seu e-mail para recuperar a senha.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("Link de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      setError("Erro ao enviar e-mail de recuperação. Verifique se o e-mail está correto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 ${inter.className}`}>
      
      {/* Left Column: Forms */}
      <div className="w-full md:w-1/2 lg:w-5/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-slate-50 dark:bg-slate-900 z-10 shadow-[10px_0_20px_rgba(0,0,0,0.05)] overflow-y-auto">
        
        <div className="max-w-md w-full mx-auto">
          {/* Header Mobile / Brand */}
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner">
              DO
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-slate-800 dark:text-white">Dono da Oficina</h1>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
            {mode === "login" && "Entrar"}
            {mode === "register" && "Cadastro"}
            {mode === "forgot_password" && "Recuperar Senha"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            {mode === "login" && "Bem-vindo de volta! Faça login na sua conta."}
            {mode === "register" && "Preencha seus dados para iniciar seu teste gratuito de 15 dias."}
            {mode === "forgot_password" && "Enviaremos um link para você redefinir sua senha."}
          </p>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-600 dark:text-red-400 p-4 flex items-start gap-3 text-sm rounded-r-lg">
              <AlertCircle size={20} className="shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-400 p-4 flex items-start gap-3 text-sm rounded-r-lg">
              <AlertCircle size={20} className="shrink-0" />
              <p className="font-medium">{successMsg}</p>
            </div>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="João" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Sobrenome</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="Silva" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="joao@email.com" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="••••••••" minLength={6} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirmar Senha</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 my-4 pt-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">Dados da Oficina</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome da Oficina</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="Oficina do João" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CPF (Proprietário)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><FileText size={18} /></div>
                    <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="000.000.000-00" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Phone size={18} /></div>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="(00) 00000-0000" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CNPJ da Empresa</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><FileText size={18} /></div>
                  <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} disabled={isInformal} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm disabled:bg-slate-100 disabled:text-slate-400" placeholder="00.000.000/0000-00" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input type="checkbox" id="informal" checked={isInformal} onChange={(e) => { setIsInformal(e.target.checked); if (e.target.checked) setCnpj(""); }} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="informal" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">Oficina Informal (Não possuo CNPJ)</label>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Criar Conta e Iniciar Teste"}
              </button>
            </form>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="seu@email.com" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                  <button type="button" onClick={() => setMode("forgot_password")} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">Esqueceu a senha?</button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Entrar"}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === "forgot_password" && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail cadastrado</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm" placeholder="seu@email.com" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Enviar Link de Recuperação"}
              </button>
            </form>
          )}

          {/* TOGGLE LINKS */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            {mode === "login" ? (
              <p className="text-slate-600 dark:text-slate-400">
                Ainda não tem uma conta?{" "}
                <button onClick={() => { setMode("register"); resetMessages(); }} className="text-blue-600 font-bold hover:underline">
                  Cadastre-se gratuitamente
                </button>
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                Já possui uma conta?{" "}
                <button onClick={() => { setMode("login"); resetMessages(); }} className="text-blue-600 font-bold hover:underline">
                  Voltar para o Login
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Right Column: Illustration (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 lg:w-7/12 bg-blue-500 relative flex-col items-center justify-center p-12 overflow-hidden">
        
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-0 right-0 w-full h-full text-blue-600/30 transform translate-x-1/3 -translate-y-1/4" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon fill="currentColor" points="50,0 100,0 100,100 0,100" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-lg text-center">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl">
            <Wrench size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Acelere a gestão da sua oficina.
          </h2>
          <p className="text-blue-100 text-lg lg:text-xl font-medium mb-12">
            Controle de Ordens de Serviço, estoque, notas fiscais e comunicação com clientes. Tudo em um único lugar.
          </p>
          
          <div className="flex gap-4 items-center justify-center w-full">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2">
              <Car size={20} />
              <span>Multi-dispositivo</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2">
              <FileText size={20} />
              <span>Nota Fiscal Fácil</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
