import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Бета-версия</Badge>
            <h1 className="text-4xl font-bold mb-4">О проекте</h1>
            <p className="text-xl text-muted-foreground">
              Энциклопедия Живых Существ - образовательная платформа о мире природы
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Target" size={24} className="text-primary" />
                Наша миссия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">
                Мы создаем современную цифровую энциклопедию, которая делает знания о живых 
                существах доступными для всех. Наша цель - объединить научную точность с 
                удобным интерфейсом и интерактивными функциями для лучшего образовательного опыта.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={24} className="text-amber-600" />
                Бета-версия
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Проект находится в стадии активной разработки. Это означает:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Контент постоянно пополняется новыми видами животных</li>
                <li>Возможны временные технические проблемы</li>
                <li>Некоторые функции могут работать нестабильно</li>
                <li>Мы благодарны за любую обратную связь</li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Book" size={24} className="text-primary" />
                  Контент
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3">В энциклопедии собрана информация о:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                    <span>Млекопитающих всех континентов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                    <span>Птицах от колибри до страусов</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                    <span>Насекомых и паукообразных</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                    <span>Рептилиях и амфибиях</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  Особенности
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="Crown" size={18} className="text-primary mt-0.5" />
                    <span>Premium контент с эксклюзивными фактами</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="ShoppingBag" size={18} className="text-primary mt-0.5" />
                    <span>Магазин с полезными предметами</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Search" size={18} className="text-primary mt-0.5" />
                    <span>Умный поиск и фильтры</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="FileText" size={18} className="text-primary mt-0.5" />
                    <span>Научная классификация</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Rocket" size={24} className="text-primary" />
                Планы развития
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">В ближайших обновлениях:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Добавление фотографий и иллюстраций</li>
                    <li>Аудиозаписи голосов животных</li>
                    <li>Интерактивные карты ареалов обитания</li>
                    <li>Система избранного и заметок</li>
                    <li>Сравнение видов между собой</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Система поддержки автора:</h4>
                  <p className="text-muted-foreground">
                    Сейчас функция поддержки заблокирована. В следующем обновлении вы 
                    сможете поддержать развитие проекта и получить дополнительные бонусы.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
