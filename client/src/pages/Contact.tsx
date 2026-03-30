import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Contact() {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        language === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully',
        { description: language === 'ar' ? 'سنتواصل معك قريباً' : 'We will get back to you shortly' }
      );
    }, 1500);
  };

  return (
    <Layout>
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {t('contact')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            {language === 'ar' ? 'نحن هنا لمساعدتك والإجابة على جميع استفساراتك' : 'We are here to help and answer all your inquiries'}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6">
              {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
            </h2>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-full text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{language === 'ar' ? 'العنوان' : 'Address'}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {language === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-secondary/10 p-4 rounded-full text-secondary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
                <p className="text-muted-foreground">info@uniguide.edu.sa</p>
                <p className="text-muted-foreground">support@uniguide.edu.sa</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-accent p-4 rounded-full text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</h3>
                <p className="text-muted-foreground" dir="ltr">+966 11 123 4567</p>
                <p className="text-muted-foreground" dir="ltr">+966 50 123 4567</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{language === 'ar' ? 'أرسل لنا رسالة' : 'Send us a message'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
                  <Input id="name" placeholder={language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed'} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</Label>
                  <Input id="email" type="email" placeholder="example@email.com" required dir="ltr" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">{language === 'ar' ? 'الموضوع' : 'Subject'}</Label>
                  <Input id="subject" placeholder={language === 'ar' ? 'استفسار عن القبول' : 'Inquiry about admission'} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{language === 'ar' ? 'الرسالة' : 'Message'}</Label>
                  <Textarea 
                    id="message" 
                    placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'} 
                    className="min-h-[150px]"
                    required 
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    language === 'ar' ? 'جاري الإرسال...' : 'Sending...'
                  ) : (
                    <>
                      <Send className={`h-5 w-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
}