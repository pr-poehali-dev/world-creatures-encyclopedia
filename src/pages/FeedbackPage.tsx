import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function FeedbackPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.submitFeedback(email, message);
      toast.success('Ваша идея отправлена! Спасибо за обратную связь.');
      setEmail('');
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка отправки');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-primary" />
              <CardTitle className="text-3xl">Обратная связь</CardTitle>
              <CardDescription>
                Поделитесь своими идеями по улучшению энциклопедии
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Ваш Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="email@example.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Мы свяжемся с вами по этому адресу
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="message">Ваша идея или предложение</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Опишите вашу идею подробно..."
                    rows={8}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? (
                    <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                  ) : (
                    <Icon name="Send" size={20} className="mr-2" />
                  )}
                  Отправить
                </Button>
              </form>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Lightbulb" size={20} className="text-amber-500" />
                  О чем можно написать:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Предложения по новым функциям</li>
                  <li>Идеи по улучшению существующего функционала</li>
                  <li>Какие виды животных хотелось бы видеть</li>
                  <li>Сообщения об ошибках и неточностях</li>
                  <li>Любые другие идеи по развитию проекта</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
