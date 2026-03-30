import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/inertia-mock";
import { GraduationCap, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock login mechanism - just setting localstorage for UI purposes
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsSubmitting(false);
      window.location.href = '/'; // Simple redirect for mock
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 bg-muted/20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold">{t('login')}</h1>
            <p className="text-muted-foreground mt-2">
              {language === 'ar' ? 'مرحباً بك مجدداً في منصة التوجيه الجامعي' : 'Welcome back to UniGuide'}
            </p>
          </div>

          <Card className="border-border/50 shadow-xl">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="student@example.com" 
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">{language === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
                    <a href="#" className="text-sm text-primary hover:underline font-medium">
                      {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    language === 'ar' ? 'جاري تسجيل الدخول...' : 'Logging in...'
                  ) : (
                    <>
                      <LogIn className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {t('login')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <div className="p-6 bg-muted/30 border-t text-center rounded-b-xl">
              <p className="text-sm text-muted-foreground">
                {language === 'ar' ? 'ليس لديك حساب؟ ' : 'Don\'t have an account? '}
                <a href="#" className="font-bold text-primary hover:underline">
                  {language === 'ar' ? 'سجل الآن' : 'Sign up now'}
                </a>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}