import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import { api, ShopItem } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function ShopPage() {
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();
  
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadItems();
  }, [user]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await api.getShopItems(user?.id);
      setItems(data);
    } catch (error) {
      console.error('Failed to load shop items:', error);
    }
    setLoading(false);
  };

  const handlePurchase = async (item: ShopItem) => {
    if (!user) return;
    
    if (user.insectomix_balance < item.price) {
      toast.error('Недостаточно Насекомикс для покупки');
      return;
    }

    setPurchasing(item.id);
    try {
      const result = await api.purchaseItem(user.id, item.id);
      updateBalance(result.new_balance);
      toast.success(`Куплено: ${item.name}`);
      await loadItems();
    } catch (error: any) {
      toast.error(error.message || 'Ошибка покупки');
    }
    setPurchasing(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <Icon name="Loader2" size={64} className="animate-spin mx-auto text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Магазин предметов</h1>
            <p className="text-xl text-muted-foreground">
              Покупайте предметы за валюту Насекомикс для улучшения опыта работы с энциклопедией
            </p>
            {user && (
              <div className="mt-4 flex items-center gap-3 bg-primary/10 p-4 rounded-lg">
                <Icon name="Bug" size={32} className="text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Ваш баланс:</p>
                  <p className="text-2xl font-bold">{user.insectomix_balance} Насекомикс</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Icon name={item.icon_name as any} size={40} className="text-primary" />
                    <Badge variant={item.owned > 0 ? "default" : "secondary"}>
                      {item.owned > 0 ? `Куплено: ${item.owned}` : 'Новинка'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Sparkles" size={16} />
                      <span>Эффект: {item.effect}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Bug" size={20} className="text-primary" />
                      <span className="text-2xl font-bold">{item.price}</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={purchasing === item.id || (user && user.insectomix_balance < item.price)}
                    >
                      {purchasing === item.id ? (
                        <Icon name="Loader2" size={16} className="animate-spin" />
                      ) : (
                        'Купить'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-muted">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Icon name="Info" size={32} className="text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Как получить Насекомикс?</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Активируйте Premium подписку и получите 100 Насекомикс в подарок</li>
                    <li>Следите за обновлениями - скоро появятся новые способы заработка</li>
                    <li>Участвуйте в акциях и конкурсах</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
