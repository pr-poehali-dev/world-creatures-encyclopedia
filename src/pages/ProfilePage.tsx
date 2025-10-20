import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateBalance, updatePremium } = useAuth();
  const navigate = useNavigate();
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const handleActivatePremium = async () => {
    if (!user) return;
    
    setActivating(true);
    try {
      const result = await api.activatePremium(user.id);
      updatePremium(result.premium_until);
      updateBalance(user.insectomix_balance + result.bonus_insectomix);
      toast.success(`Premium активирован! Получено ${result.bonus_insectomix} Насекомикс`);
    } catch (error: any) {
      toast.error(error.message || 'Не удалось активировать Premium');
    }
    setActivating(false);
  };

  if (!user) return null;

  const premiumExpiry = user.premium_until ? new Date(user.premium_until) : null;
  const daysLeft = premiumExpiry ? Math.ceil((premiumExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Личный кабинет</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="User" size={24} className="text-primary" />
                  Профиль
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Имя пользователя</p>
                  <p className="text-lg font-semibold">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Bug" size={24} className="text-primary" />
                  Баланс Насекомикс
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-bold text-primary">
                    {user.insectomix_balance}
                  </div>
                  <Icon name="Bug" size={32} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Используйте для покупки предметов в магазине
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className={user.is_premium ? "border-primary bg-primary/5" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Crown" size={24} className="text-primary" />
                Premium статус
              </CardTitle>
              <CardDescription>
                Получите в 2 раза больше информации о существах
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.is_premium ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="default" className="text-lg px-4 py-2">
                      Активен
                    </Badge>
                    <span className="text-muted-foreground">
                      Осталось дней: {daysLeft}
                    </span>
                  </div>
                  <div className="bg-background p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold mb-2">Ваши преимущества:</h4>
                    <div className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Доступ к эксклюзивным фактам о животных</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Подробные научные данные</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Уникальные наблюдения натуралистов</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-4 text-muted-foreground">
                    Активируйте Premium на 3 дня совершенно бесплатно! 
                    В подарок вы получите 100 Насекомикс.
                  </p>
                  <Button
                    size="lg"
                    onClick={handleActivatePremium}
                    disabled={activating}
                  >
                    {activating ? (
                      <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                    ) : (
                      <Icon name="Zap" size={20} className="mr-2" />
                    )}
                    Активировать Premium (3 дня)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8 bg-muted">
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Icon name="Eye" size={32} className="mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Просмотрено видов</p>
                </div>
                <div>
                  <Icon name="Star" size={32} className="mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Избранное</p>
                </div>
                <div>
                  <Icon name="ShoppingBag" size={32} className="mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Куплено предметов</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
