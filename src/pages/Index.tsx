import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Creature {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  habitat: string;
  diet: string;
  lifespan: string;
  status: string;
  description: string;
  detailedInfo?: string;
}

const CATEGORIES = ['Все', 'Млекопитающие', 'Птицы', 'Рыбы', 'Рептилии', 'Амфибии', 'Насекомые', 'Паукообразные', 'Моллюски'];

const SHOP_ITEMS = [
  { id: 1, name: 'Золотая рамка профиля', price: 500, icon: 'Award' },
  { id: 2, name: 'Анимация бабочек', price: 300, icon: 'Sparkles' },
  { id: 3, name: 'Тёмная тема', price: 200, icon: 'Moon' },
  { id: 4, name: 'Расширенный поиск', price: 400, icon: 'Search' },
  { id: 5, name: 'Закладки', price: 150, icon: 'Bookmark' },
  { id: 6, name: 'Экспорт данных', price: 600, icon: 'Download' },
  { id: 7, name: 'Сравнение существ', price: 350, icon: 'GitCompare' },
  { id: 8, name: 'Голосовой поиск', price: 450, icon: 'Mic' },
  { id: 9, name: '3D модели', price: 800, icon: 'Box' },
  { id: 10, name: 'Карта обитания', price: 550, icon: 'Map' },
  { id: 11, name: 'Уведомления', price: 250, icon: 'Bell' },
  { id: 12, name: 'Режим чтения', price: 180, icon: 'BookOpen' },
  { id: 13, name: 'Статистика', price: 320, icon: 'BarChart' },
  { id: 14, name: 'Коллекции', price: 280, icon: 'FolderOpen' },
  { id: 15, name: 'Викторины', price: 220, icon: 'HelpCircle' },
  { id: 16, name: 'Эволюционное древо', price: 700, icon: 'GitBranch' },
  { id: 17, name: 'Звуки животных', price: 380, icon: 'Volume2' },
  { id: 18, name: 'Фотогалерея', price: 420, icon: 'Image' },
  { id: 19, name: 'Редкий значок', price: 900, icon: 'Star' },
  { id: 20, name: 'VIP статус (30 дней)', price: 1500, icon: 'Crown' },
];

const SAMPLE_CREATURES: Creature[] = [
  {
    id: '1',
    name: 'Африканский слон',
    scientificName: 'Loxodonta africana',
    category: 'Млекопитающие',
    habitat: 'Саванны и леса Африки',
    diet: 'Травоядное',
    lifespan: '60-70 лет',
    status: 'Уязвимый',
    description: 'Крупнейшее наземное млекопитающее с характерными большими ушами и бивнями.',
    detailedInfo: 'Африканские слоны играют ключевую роль в экосистеме, формируя ландшафт и создавая водоёмы. Обладают высоким интеллектом и сложной социальной структурой.'
  },
  {
    id: '2',
    name: 'Медоносная пчела',
    scientificName: 'Apis mellifera',
    category: 'Насекомые',
    habitat: 'Повсеместно (кроме полярных зон)',
    diet: 'Нектар и пыльца',
    lifespan: '5-7 недель (рабочие)',
    status: 'Стабильная популяция',
    description: 'Социальное насекомое, играющее критическую роль в опылении растений.',
    detailedInfo: 'Пчёлы живут колониями до 80000 особей. Производят мёд, воск, прополис. Являются важнейшими опылителями сельскохозяйственных культур.'
  },
  {
    id: '3',
    name: 'Королевская кобра',
    scientificName: 'Ophiophagus hannah',
    category: 'Рептилии',
    habitat: 'Леса Южной и Юго-Восточной Азии',
    diet: 'Хищник (другие змеи)',
    lifespan: '20 лет',
    status: 'Уязвимый',
    description: 'Самая длинная ядовитая змея в мире, достигающая 5,5 метров.',
    detailedInfo: 'Единственная змея, строящая гнездо для яиц. Яд содержит нейротоксины. Несмотря на название, не относится к настоящим кобрам.'
  },
  {
    id: '4',
    name: 'Императорский пингвин',
    scientificName: 'Aptenodytes forsteri',
    category: 'Птицы',
    habitat: 'Антарктида',
    diet: 'Рыба, кальмары, криль',
    lifespan: '15-20 лет',
    status: 'Близок к уязвимому',
    description: 'Самый крупный вид пингвинов, приспособленный к экстремальным условиям.',
    detailedInfo: 'Способны выдерживать температуры до -40°C. Самцы высиживают яйцо в течение 64 дней без пищи. Ныряют на глубину до 500 метров.'
  },
  {
    id: '5',
    name: 'Голубой кит',
    scientificName: 'Balaenoptera musculus',
    category: 'Млекопитающие',
    habitat: 'Все океаны мира',
    diet: 'Криль',
    lifespan: '80-90 лет',
    status: 'Вымирающий',
    description: 'Крупнейшее животное на планете, когда-либо существовавшее на Земле.',
    detailedInfo: 'Может достигать 30 метров в длину и весить до 200 тонн. Сердце размером с автомобиль. Издает громкие звуки до 188 децибел.'
  },
  {
    id: '6',
    name: 'Огненный муравей',
    scientificName: 'Solenopsis invicta',
    category: 'Насекомые',
    habitat: 'Южная Америка (инвазивен)',
    diet: 'Всеядное',
    lifespan: '5-7 лет (матка)',
    status: 'Инвазивный вид',
    description: 'Агрессивный вид муравьёв с болезненным жалящим укусом.',
    detailedInfo: 'Образуют суперколонии с миллионами особей. Могут создавать живые плоты при наводнениях. Наносят серьёзный экономический ущерб.'
  },
  {
    id: '7',
    name: 'Озёрная лягушка',
    scientificName: 'Pelophylax ridibundus',
    category: 'Амфибии',
    habitat: 'Водоёмы Европы и Азии',
    diet: 'Насекомые, беспозвоночные',
    lifespan: '6-12 лет',
    status: 'Стабильная популяция',
    description: 'Крупная зелёная лягушка, обитающая в пресных водоёмах.',
    detailedInfo: 'Активна днём и ночью. Играет роль биоиндикатора чистоты водоёмов. Кожа выделяет антибактериальные вещества.'
  },
  {
    id: '8',
    name: 'Гигантский кальмар',
    scientificName: 'Architeuthis dux',
    category: 'Моллюски',
    habitat: 'Глубины океанов',
    diet: 'Рыба, другие кальмары',
    lifespan: '5 лет',
    status: 'Недостаточно данных',
    description: 'Один из крупнейших беспозвоночных, достигающий 13 метров в длину.',
    detailedInfo: 'Обладает крупнейшими глазами в животном мире (до 27 см). Редко встречается. Является добычей кашалотов.'
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState(750);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ideaText, setIdeaText] = useState('');

  const filteredCreatures = SAMPLE_CREATURES.filter(creature => {
    const matchesSearch = creature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creature.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || creature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
      toast.success('Добро пожаловать! Вы получили бонус 2x информации на 3 дня');
    }
  };

  const handleRegister = () => {
    if (email && password) {
      setIsLoggedIn(true);
      toast.success('Регистрация успешна! Бонус 2x информации активирован на 3 дня');
    }
  };

  const handleBuyItem = (price: number, itemName: string) => {
    if (userBalance >= price) {
      setUserBalance(userBalance - price);
      toast.success(`Куплено: ${itemName}`);
    } else {
      toast.error('Недостаточно Насекомикс');
    }
  };

  const handleSubmitIdea = () => {
    if (ideaText.trim()) {
      toast.success('Ваша идея отправлена автору!');
      setIdeaText('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Alert className="rounded-none border-x-0 border-t-0 bg-primary text-primary-foreground">
        <Icon name="Info" className="h-4 w-4" />
        <AlertDescription>
          <strong>БЕТА-ВЕРСИЯ</strong> • Возможны ошибки и неточности в данных • Следующее обновление: Система поддержки автора
        </AlertDescription>
      </Alert>

      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Icon name="Bug" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Энциклопедия Живых Существ</h1>
                <p className="text-sm text-muted-foreground">Научный справочник биоразнообразия</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Badge variant="secondary" className="gap-1">
                    <Icon name="Coins" className="h-3 w-3" />
                    {userBalance} Насекомикс
                  </Badge>
                  <Badge variant="default" className="gap-1">
                    <Icon name="Zap" className="h-3 w-3" />
                    2x инфо (3 дня)
                  </Badge>
                </>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default">
                      <Icon name="LogIn" className="h-4 w-4 mr-2" />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход / Регистрация</DialogTitle>
                      <DialogDescription>
                        Зарегистрируйтесь и получите бонус 2x информации на 3 дня!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleLogin} className="flex-1">Войти</Button>
                        <Button onClick={handleRegister} variant="outline" className="flex-1">Регистрация</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative mb-6">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 h-12 text-lg"
              placeholder="Поиск существ по названию или научному имени..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/90 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="catalog">
              <Icon name="Database" className="h-4 w-4 mr-2" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="shop">
              <Icon name="ShoppingBag" className="h-4 w-4 mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <Icon name="MessageSquare" className="h-4 w-4 mr-2" />
              Идеи автору
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCreatures.map(creature => (
                <Card key={creature.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedCreature(creature)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{creature.name}</span>
                      <Badge variant="outline">{creature.category}</Badge>
                    </CardTitle>
                    <CardDescription className="italic">{creature.scientificName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{creature.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Среда обитания:</span>
                        <span className="font-medium">{creature.habitat.substring(0, 30)}...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Статус:</span>
                        <span className="font-medium">{creature.status}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Dialog open={!!selectedCreature} onOpenChange={() => setSelectedCreature(null)}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                {selectedCreature && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-3xl flex items-center gap-3">
                        {selectedCreature.name}
                        <Badge>{selectedCreature.category}</Badge>
                      </DialogTitle>
                      <DialogDescription className="text-lg italic">
                        {selectedCreature.scientificName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-base">{selectedCreature.description}</p>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <tbody className="divide-y">
                            <tr className="hover:bg-muted/50">
                              <td className="p-3 font-semibold bg-muted/30">Научное название</td>
                              <td className="p-3 italic">{selectedCreature.scientificName}</td>
                            </tr>
                            <tr className="hover:bg-muted/50">
                              <td className="p-3 font-semibold bg-muted/30">Категория</td>
                              <td className="p-3">{selectedCreature.category}</td>
                            </tr>
                            <tr className="hover:bg-muted/50">
                              <td className="p-3 font-semibold bg-muted/30">Среда обитания</td>
                              <td className="p-3">{selectedCreature.habitat}</td>
                            </tr>
                            <tr className="hover:bg-muted/50">
                              <td className="p-3 font-semibold bg-muted/30">Тип питания</td>
                              <td className="p-3">{selectedCreature.diet}</td>
                            </tr>
                            <tr className="hover:bg-muted/50">
                              <td className="p-3 font-semibold bg-muted/30">Продолжительность жизни</td>
                              <td className="p-3">{selectedCreature.lifespan}</td>
                            </tr>
                            <tr className="hover:bg-muted/50">
                              <td className="p-3 font-semibold bg-muted/30">Охранный статус</td>
                              <td className="p-3">{selectedCreature.status}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {isLoggedIn && selectedCreature.detailedInfo && (
                        <div className="border-l-4 border-primary pl-4 bg-muted/30 p-4 rounded">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Lock" className="h-4 w-4 text-primary" />
                            <span className="font-semibold">Расширенная информация (2x)</span>
                          </div>
                          <p className="text-sm">{selectedCreature.detailedInfo}</p>
                        </div>
                      )}

                      {!isLoggedIn && (
                        <Alert>
                          <Icon name="Lock" className="h-4 w-4" />
                          <AlertDescription>
                            Зарегистрируйтесь, чтобы получить доступ к расширенной информации (2x детализация) на 3 дня бесплатно!
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="shop" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Магазин Насекомикс</CardTitle>
                <CardDescription>
                  Используйте виртуальную валюту для покупки улучшений и кастомизации сайта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SHOP_ITEMS.map(item => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                          <Icon name={item.icon as any} className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-sm">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="gap-1">
                            <Icon name="Coins" className="h-3 w-3" />
                            {item.price}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleBuyItem(item.price, item.name)}
                            disabled={!isLoggedIn || userBalance < item.price}
                          >
                            Купить
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {!isLoggedIn && (
                  <Alert className="mt-4">
                    <Icon name="Lock" className="h-4 w-4" />
                    <AlertDescription>
                      Войдите в систему, чтобы покупать предметы
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Предложить идею автору</CardTitle>
                <CardDescription>
                  Ваши предложения помогут улучшить энциклопедию
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="idea">Ваша идея</Label>
                  <Textarea
                    id="idea"
                    placeholder="Опишите вашу идею или предложение..."
                    rows={6}
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                  />
                </div>
                <Button onClick={handleSubmitIdea} disabled={!ideaText.trim()}>
                  <Icon name="Send" className="h-4 w-4 mr-2" />
                  Отправить идею
                </Button>
                <Alert>
                  <Icon name="Info" className="h-4 w-4" />
                  <AlertDescription>
                    Отправленные идеи будут направлены автору на email (требуется настройка секрета EMAIL в backend)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Поддержка автора</CardTitle>
                <CardDescription>
                  Финансовая поддержка проекта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Icon name="Lock" className="h-4 w-4" />
                  <AlertDescription>
                    <strong>В разработке</strong> • Функция поддержки автора будет доступна в следующем обновлении
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-16 bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3">О проекте</h3>
              <p className="text-sm text-muted-foreground">
                Энциклопедия живых существ — научно-образовательный проект, посвящённый изучению биоразнообразия нашей планеты.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-3">Разделы</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Каталог существ</li>
                <li>• Магазин улучшений</li>
                <li>• Обратная связь</li>
                <li>• Личный кабинет</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Контакты</h3>
              <p className="text-sm text-muted-foreground">
                Предложения и вопросы отправляйте через форму обратной связи
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            © 2025 Энциклопедия Живых Существ • БЕТА-ВЕРСИЯ • Все права защищены
          </div>
        </div>
      </footer>
    </div>
  );
}
