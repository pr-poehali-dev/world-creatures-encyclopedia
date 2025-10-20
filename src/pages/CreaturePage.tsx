import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import { api, Creature } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function CreaturePage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [creature, setCreature] = useState<Creature | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadCreature();
  }, [id, user]);

  const loadCreature = async () => {
    setLoading(true);
    try {
      const data = await api.getCreature(Number(id), user?.id);
      setCreature(data);
    } catch (error) {
      console.error('Failed to load creature:', error);
    }
    setLoading(false);
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

  if (!creature) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <Icon name="AlertCircle" size={64} className="mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-bold mb-4">Существо не найдено</h2>
          <Link to="/catalog">
            <Button>Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/catalog">
            <Button variant="ghost" size="sm">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад к каталогу
            </Button>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{creature.name}</h1>
              <p className="text-xl text-muted-foreground italic">{creature.latin_name}</p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              {creature.category}
            </Badge>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{creature.description}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {creature.habitat && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MapPin" size={20} className="text-primary" />
                    Среда обитания
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{creature.habitat}</p>
                </CardContent>
              </Card>
            )}

            {creature.diet && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Utensils" size={20} className="text-primary" />
                    Питание
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{creature.diet}</p>
                </CardContent>
              </Card>
            )}

            {creature.size_info && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Ruler" size={20} className="text-primary" />
                    Размеры
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{creature.size_info}</p>
                </CardContent>
              </Card>
            )}

            {creature.lifespan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} className="text-primary" />
                    Продолжительность жизни
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{creature.lifespan}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {creature.conservation_status && (
            <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Shield" size={20} className="text-amber-600" />
                  Природоохранный статус
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{creature.conservation_status}</p>
              </CardContent>
            </Card>
          )}

          {creature.premium_content ? (
            <Card className="bg-primary/5 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Crown" size={20} className="text-primary" />
                  Premium информация
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">{creature.premium_content}</p>
              </CardContent>
            </Card>
          ) : user && !user.is_premium && (
            <Card className="bg-muted">
              <CardContent className="p-8 text-center">
                <Icon name="Lock" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Получите в 2 раза больше информации</h3>
                <p className="text-muted-foreground mb-4">
                  Активируйте Premium на 3 дня и откройте доступ к эксклюзивным фактам и деталям
                </p>
                <Link to="/profile">
                  <Button>Активировать Premium</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
