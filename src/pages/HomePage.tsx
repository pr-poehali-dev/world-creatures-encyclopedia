import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';

const CATEGORIES = [
  { name: 'Млекопитающие', icon: 'Rabbit', count: 1 },
  { name: 'Птицы', icon: 'Bird', count: 2 },
  { name: 'Рептилии', icon: 'Turtle', count: 1 },
  { name: 'Насекомые', icon: 'Bug', count: 4 },
  { name: 'Паукообразные', icon: 'Bug', count: 1 }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Исследуйте мир живых существ
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Полная энциклопедия животных, насекомых и других организмов планеты Земля
          </p>
          
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Найти существо..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="text-lg py-6"
            />
            <Button onClick={handleSearch} size="lg">
              <Icon name="Search" size={20} />
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Категории</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((category) => (
              <Link key={category.name} to={`/catalog?category=${encodeURIComponent(category.name)}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-2">
                      <Icon name={category.icon as any} size={48} className="text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.count} видов</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="mb-2">
                <Icon name="BookOpen" size={32} className="text-primary" />
              </div>
              <CardTitle>Детальная информация</CardTitle>
              <CardDescription>
                Подробные описания, научные данные, среда обитания и особенности каждого вида
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <Icon name="Award" size={32} className="text-primary" />
              </div>
              <CardTitle>Premium доступ</CardTitle>
              <CardDescription>
                Получите в 2 раза больше информации с premium подпиской на 3 дня
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <Icon name="ShoppingBag" size={32} className="text-primary" />
              </div>
              <CardTitle>Магазин предметов</CardTitle>
              <CardDescription>
                Покупайте уникальные предметы за валюту Насекомикс для улучшения опыта
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Icon name="AlertTriangle" size={32} className="text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-lg mb-2">Проект в бета-версии</h4>
                <p className="text-muted-foreground">
                  Энциклопедия находится в активной разработке. Возможны ошибки и неточности. 
                  Мы постоянно работаем над улучшением контента и добавлением новых видов.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
