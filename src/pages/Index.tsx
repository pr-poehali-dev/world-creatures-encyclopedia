import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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
  isStudied: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: number;
  unlocked: boolean;
  icon: string;
}

interface BoostUpgrade {
  id: number;
  name: string;
  bonus: number;
  price: number;
  icon: string;
}

const CATEGORIES = ['Все', 'Млекопитающие', 'Птицы', 'Рыбы', 'Рептилии', 'Амфибии', 'Насекомые', 'Паукообразные', 'Моллюски'];

const BOOST_UPGRADES: BoostUpgrade[] = [
  { id: 1, name: 'Ускорение +20/мин (3 дня)', bonus: 20, price: 300, icon: 'Zap' },
  { id: 2, name: 'Ускорение +50/мин (3 дня)', bonus: 50, price: 600, icon: 'Bolt' },
];

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
    detailedInfo: 'Африканские слоны играют ключевую роль в экосистеме, формируя ландшафт и создавая водоёмы. Обладают высоким интеллектом и сложной социальной структурой.',
    isStudied: true
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
    detailedInfo: 'Пчёлы живут колониями до 80000 особей. Производят мёд, воск, прополис. Являются важнейшими опылителями сельскохозяйственных культур.',
    isStudied: true
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
    detailedInfo: 'Единственная змея, строящая гнездо для яиц. Яд содержит нейротоксины. Несмотря на название, не относится к настоящим кобрам.',
    isStudied: true
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
    detailedInfo: 'Способны выдерживать температуры до -40°C. Самцы высиживают яйцо в течение 64 дней без пищи. Ныряют на глубину до 500 метров.',
    isStudied: true
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
    detailedInfo: 'Может достигать 30 метров в длину и весить до 200 тонн. Сердце размером с автомобиль. Издает громкие звуки до 188 децибел.',
    isStudied: true
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
    detailedInfo: 'Образуют суперколонии с миллионами особей. Могут создавать живые плоты при наводнениях. Наносят серьёзный экономический ущерб.',
    isStudied: true
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
    detailedInfo: 'Активна днём и ночью. Играет роль биоиндикатора чистоты водоёмов. Кожа выделяет антибактериальные вещества.',
    isStudied: true
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
    detailedInfo: 'Обладает крупнейшими глазами в животном мире (до 27 см). Редко встречается. Является добычей кашалотов.',
    isStudied: true
  },
  {
    id: '9',
    name: 'Колибри-пчёлка',
    scientificName: 'Mellisuga helenae',
    category: 'Птицы',
    habitat: 'Куба',
    diet: 'Нектар',
    lifespan: '7-10 лет',
    status: 'Близок к уязвимому',
    description: 'Самая маленькая птица в мире, весом всего 2 грамма.',
    detailedInfo: 'Делает до 80 взмахов крыльями в секунду. Сердце бьётся с частотой 1200 ударов в минуту. Способна летать задом наперёд.',
    isStudied: true
  },
  {
    id: '10',
    name: 'Комодский варан',
    scientificName: 'Varanus komodoensis',
    category: 'Рептилии',
    habitat: 'Индонезия (острова)',
    diet: 'Хищник',
    lifespan: '30 лет',
    status: 'Вымирающий',
    description: 'Крупнейшая современная ящерица, достигающая 3 метров в длину.',
    detailedInfo: 'Обладает ядовитыми железами и острыми зубами. Может развивать скорость до 20 км/ч. Способен охотиться на добычу весом до 80 кг.',
    isStudied: true
  },
  {
    id: '11',
    name: 'Axolotl',
    scientificName: 'Ambystoma mexicanum',
    category: 'Амфибии',
    habitat: 'Озёра Мексики',
    diet: 'Насекомые, мелкие рыбы',
    lifespan: '10-15 лет',
    status: 'Критически вымирающий',
    description: 'Уникальная саламандра, способная к регенерации конечностей.',
    detailedInfo: 'Сохраняет личиночные черты во взрослом состоянии. Может регенерировать не только конечности, но и органы, включая части мозга и сердца.',
    isStudied: true
  },
  {
    id: '12',
    name: 'Богомол орхидейный',
    scientificName: 'Hymenopus coronatus',
    category: 'Насекомые',
    habitat: 'Тропические леса Азии',
    diet: 'Хищник (насекомые)',
    lifespan: '5-8 месяцев',
    status: 'Стабильная популяция',
    description: 'Удивительный богомол, имитирующий цветок орхидеи.',
    detailedInfo: 'Самки крупнее самцов в 2-3 раза. Способен менять окраску от белого до розового. Привлекает добычу, имитируя цветок.',
    isStudied: true
  },
  {
    id: '13',
    name: 'Белая акула',
    scientificName: 'Carcharodon carcharias',
    category: 'Рыбы',
    habitat: 'Прибрежные воды океанов',
    diet: 'Хищник (млекопитающие, рыбы)',
    lifespan: '70+ лет',
    status: 'Уязвимый',
    description: 'Один из крупнейших хищников океана, достигающий 6 метров.',
    detailedInfo: 'Обладает 300 зубами в несколько рядов. Может развивать скорость до 56 км/ч. Чувствует каплю крови в 100 литрах воды.',
    isStudied: true
  },
  {
    id: '14',
    name: 'Тарантул голиаф',
    scientificName: 'Theraphosa blondi',
    category: 'Паукообразные',
    habitat: 'Тропические леса Южной Америки',
    diet: 'Хищник (насекомые, грызуны)',
    lifespan: '15-25 лет (самки)',
    status: 'Стабильная популяция',
    description: 'Крупнейший паук в мире с размахом лап до 30 см.',
    detailedInfo: 'Издаёт шипящие звуки при угрозе. Питается не только насекомыми, но и мелкими позвоночными. Живёт в норах.',
    isStudied: true
  },
  {
    id: '15',
    name: 'Морская выдра',
    scientificName: 'Enhydra lutris',
    category: 'Млекопитающие',
    habitat: 'Прибрежные воды Тихого океана',
    diet: 'Моллюски, морские ежи',
    lifespan: '15-20 лет',
    status: 'Вымирающий',
    description: 'Морское млекопитающее, использующее орудия труда.',
    detailedInfo: 'Использует камни для разбивания раковин моллюсков. Обладает самой плотной шерстью среди животных (до 1 млн волос на см²).',
    isStudied: true
  },
  {
    id: '16',
    name: 'Синекольчатый осьминог',
    scientificName: 'Hapalochlaena lunulata',
    category: 'Моллюски',
    habitat: 'Коралловые рифы Тихого океана',
    diet: 'Хищник (крабы, креветки)',
    lifespan: '1-2 года',
    status: 'Недостаточно данных',
    description: 'Один из самых ядовитых морских животных в мире.',
    detailedInfo: 'Яд содержит тетродотоксин, смертельный для человека. При угрозе демонстрирует яркие синие кольца. Противоядия не существует.',
    isStudied: true
  },
  {
    id: '17',
    name: 'Красноглазая квакша',
    scientificName: 'Agalychnis callidryas',
    category: 'Амфибии',
    habitat: 'Тропические леса Центральной Америки',
    diet: 'Насекомые',
    lifespan: '5 лет',
    status: 'Вызывает наименьшие опасения',
    description: 'Яркая древесная лягушка с характерными красными глазами.',
    detailedInfo: 'Красные глаза используются для отпугивания хищников. Активна ночью. Может менять окраску в зависимости от настроения.',
    isStudied: false
  },
  {
    id: '18',
    name: 'Полярный волк',
    scientificName: 'Canis lupus arctos',
    category: 'Млекопитающие',
    habitat: 'Арктические регионы',
    diet: 'Хищник (олени, зайцы)',
    lifespan: '7-10 лет',
    status: 'Вызывает наименьшие опасения',
    description: 'Подвид волка, приспособленный к жизни в Арктике.',
    detailedInfo: 'Выдерживает температуры до -70°C. Может обходиться без пищи несколько недель. Живёт стаями до 20 особей.',
    isStudied: false
  },
  {
    id: '19',
    name: 'Японский краб-паук',
    scientificName: 'Macrocheira kaempferi',
    category: 'Паукообразные',
    habitat: 'Тихий океан (Япония)',
    diet: 'Падальщик, моллюски',
    lifespan: '100+ лет',
    status: 'Недостаточно данных',
    description: 'Крупнейший краб в мире с размахом клешней до 4 метров.',
    detailedInfo: 'Обитает на глубине до 600 метров. Весит до 20 кг. Медленно растёт, достигая максимального размера через 40 лет.',
    isStudied: false
  },
  {
    id: '20',
    name: 'Мадагаскарский шипящий таракан',
    scientificName: 'Gromphadorhina portentosa',
    category: 'Насекомые',
    habitat: 'Мадагаскар',
    diet: 'Растительность',
    lifespan: '2-5 лет',
    status: 'Стабильная популяция',
    description: 'Крупный таракан, издающий шипящие звуки.',
    detailedInfo: 'Единственный вид тараканов, использующий звуки для общения. Не имеет крыльев. Может достигать 9 см в длину.',
    isStudied: false
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_login', title: 'Добро пожаловать!', description: 'Первый вход в систему', reward: 200, unlocked: false, icon: 'LogIn' },
  { id: 'first_idea', title: 'Первая идея', description: 'Отправьте первую идею автору', reward: 40, unlocked: false, icon: 'Lightbulb' },
  { id: 'collector_10', title: 'Коллекционер', description: 'Изучите 10 существ', reward: 100, unlocked: false, icon: 'BookOpen' },
  { id: 'rich', title: 'Богач', description: 'Накопите 1000 Насекомикс', reward: 150, unlocked: false, icon: 'TrendingUp' },
  { id: 'shopper', title: 'Покупатель', description: 'Купите первый предмет в магазине', reward: 50, unlocked: false, icon: 'ShoppingCart' },
  { id: 'speedster', title: 'Ускоритель', description: 'Купите улучшение добычи', reward: 75, unlocked: false, icon: 'Zap' },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ideaText, setIdeaText] = useState('');
  const [timeToNextClaim, setTimeToNextClaim] = useState(30);
  const [canClaim, setCanClaim] = useState(true);
  const [miningRate, setMiningRate] = useState(10);
  const [activeBoosts, setActiveBoosts] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [viewedCreatures, setViewedCreatures] = useState<Set<string>>(new Set());
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !canClaim) {
      const timer = setInterval(() => {
        setTimeToNextClaim((prev) => {
          if (prev <= 1) {
            setCanClaim(true);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLoggedIn, canClaim]);

  useEffect(() => {
    if (userBalance >= 1000) {
      unlockAchievement('rich');
    }
  }, [userBalance]);

  useEffect(() => {
    if (viewedCreatures.size >= 10) {
      unlockAchievement('collector_10');
    }
  }, [viewedCreatures]);

  const unlockAchievement = (achievementId: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === achievementId && !ach.unlocked) {
          setUserBalance((b) => b + ach.reward);
          toast.success(`🏆 Достижение разблокировано: ${ach.title}! +${ach.reward} Насекомикс`, {
            duration: 5000,
          });
          return { ...ach, unlocked: true };
        }
        return ach;
      })
    );
  };

  const filteredCreatures = SAMPLE_CREATURES.filter((creature) => {
    const matchesSearch =
      creature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creature.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || creature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
      unlockAchievement('first_login');
      toast.success('Добро пожаловать! Вы получили бонус 2x информации на 3 дня');
    }
  };

  const handleRegister = () => {
    if (email && password) {
      setIsLoggedIn(true);
      unlockAchievement('first_login');
      toast.success('Регистрация успешна! Бонус 2x информации активирован на 3 дня');
    }
  };

  const handleClaimCoins = () => {
    if (canClaim && isLoggedIn) {
      setUserBalance(userBalance + miningRate);
      setCanClaim(false);
      setTimeToNextClaim(30);
      toast.success(`+${miningRate} Насекомикс!`);
    }
  };

  const handleBuyItem = (price: number, itemName: string) => {
    if (userBalance >= price) {
      setUserBalance(userBalance - price);
      toast.success(`Куплено: ${itemName}`);
      unlockAchievement('shopper');
    } else {
      toast.error('Недостаточно Насекомикс');
    }
  };

  const handleBuyBoost = (boost: BoostUpgrade) => {
    if (userBalance >= boost.price) {
      setUserBalance(userBalance - boost.price);
      setMiningRate(miningRate + boost.bonus);
      setActiveBoosts([...activeBoosts, boost.id]);
      toast.success(`Куплено: ${boost.name}! Добыча теперь ${miningRate + boost.bonus}/мин`);
      unlockAchievement('speedster');
    } else {
      toast.error('Недостаточно Насекомикс');
    }
  };

  const handleSubmitIdea = () => {
    if (ideaText.trim()) {
      setUserBalance(userBalance + 40);
      toast.success('Ваша идея отправлена автору! +40 Насекомикс');
      unlockAchievement('first_idea');
      setIdeaText('');
    }
  };

  const handleCreatureClick = (creature: Creature) => {
    setSelectedCreature(creature);
    setViewedCreatures((prev) => new Set([...prev, creature.id]));
  };

  const studiedCreatures = SAMPLE_CREATURES.filter((c) => c.isStudied);
  const unstudiedCreatures = SAMPLE_CREATURES.filter((c) => !c.isStudied);

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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Icon name="Bug" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Энциклопедия Живых Существ</h1>
                <p className="text-sm text-muted-foreground">Научный справочник биоразнообразия</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {isLoggedIn ? (
                <>
                  <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => setShowAchievements(true)}>
                    <Icon name="Trophy" className="h-3 w-3" />
                    Достижения ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
                  </Badge>
                  <Badge variant="secondary" className="gap-1 text-base px-3 py-1">
                    <Icon name="Coins" className="h-4 w-4" />
                    {userBalance} Насекомикс
                  </Badge>
                  <Badge variant="default" className="gap-1">
                    <Icon name="Zap" className="h-3 w-3" />
                    {miningRate}/мин
                  </Badge>
                  <Button size="sm" onClick={handleClaimCoins} disabled={!canClaim}>
                    {canClaim ? (
                      <>
                        <Icon name="Gift" className="h-4 w-4 mr-1" />
                        Забрать
                      </>
                    ) : (
                      `${timeToNextClaim}с`
                    )}
                  </Button>
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
                        Зарегистрируйтесь и получите 200 Насекомикс + бонус 2x информации на 3 дня!
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
                        <Button onClick={handleLogin} className="flex-1">
                          Войти
                        </Button>
                        <Button onClick={handleRegister} variant="outline" className="flex-1">
                          Регистрация
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {isLoggedIn && (
        <div className="bg-muted/30 border-b py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Добыча Насекомикс</span>
                  <span className="font-medium">{canClaim ? 'Готово!' : `Следующая через ${timeToNextClaim}с`}</span>
                </div>
                <Progress value={canClaim ? 100 : ((30 - timeToNextClaim) / 30) * 100} className="h-2" />
              </div>
              <div className="text-sm text-muted-foreground">
                <Icon name="TrendingUp" className="h-4 w-4 inline mr-1" />
                {miningRate} Насекомикс/мин
              </div>
            </div>
          </div>
        </div>
      )}

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
            {CATEGORIES.map((category) => (
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="catalog">
              <Icon name="Database" className="h-4 w-4 mr-2" />
              Каталог
            </TabsTrigger>
            <TabsTrigger value="mining">
              <Icon name="Pickaxe" className="h-4 w-4 mr-2" />
              Добыча
            </TabsTrigger>
            <TabsTrigger value="shop">
              <Icon name="ShoppingBag" className="h-4 w-4 mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <Icon name="MessageSquare" className="h-4 w-4 mr-2" />
              Идеи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Check" className="h-5 w-5 text-green-600" />
                Изученные существа ({studiedCreatures.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreatures.filter((c) => c.isStudied).map((creature) => (
                  <Card
                    key={creature.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleCreatureClick(creature)}
                  >
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
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon name="Search" className="h-5 w-5 text-orange-600" />
                В изучении ({unstudiedCreatures.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCreatures.filter((c) => !c.isStudied).map((creature) => (
                  <Card
                    key={creature.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer opacity-75"
                    onClick={() => handleCreatureClick(creature)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{creature.name}</span>
                        <Badge variant="secondary">В изучении</Badge>
                      </CardTitle>
                      <CardDescription className="italic">{creature.scientificName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{creature.description}</p>
                      <Alert className="mt-2">
                        <Icon name="Microscope" className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Данные обновляются по мере изучения
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Dialog open={!!selectedCreature} onOpenChange={() => setSelectedCreature(null)}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                {selectedCreature && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-3xl flex items-center gap-3">
                        {selectedCreature.name}
                        <Badge>{selectedCreature.category}</Badge>
                        {!selectedCreature.isStudied && <Badge variant="secondary">В изучении</Badge>}
                      </DialogTitle>
                      <DialogDescription className="text-lg italic">{selectedCreature.scientificName}</DialogDescription>
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

          <TabsContent value="mining" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Добыча Насекомикс</CardTitle>
                <CardDescription>Забирайте монеты каждые 30 секунд и улучшайте добычу</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isLoggedIn ? (
                  <Alert>
                    <Icon name="Lock" className="h-4 w-4" />
                    <AlertDescription>Войдите в систему, чтобы начать добычу Насекомикс</AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="text-center p-8 bg-muted/30 rounded-lg">
                      <div className="text-6xl font-bold text-primary mb-4">{miningRate}</div>
                      <div className="text-muted-foreground mb-6">Насекомикс в минуту</div>
                      <Button size="lg" onClick={handleClaimCoins} disabled={!canClaim} className="text-lg px-8">
                        {canClaim ? (
                          <>
                            <Icon name="Gift" className="h-5 w-5 mr-2" />
                            Забрать {miningRate} Насекомикс
                          </>
                        ) : (
                          <>Следующая добыча через {timeToNextClaim}с</>
                        )}
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">Улучшения добычи</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {BOOST_UPGRADES.map((boost) => (
                          <Card key={boost.id} className={activeBoosts.includes(boost.id) ? 'border-primary' : ''}>
                            <CardHeader>
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                                  <Icon name={boost.icon as any} className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-base">{boost.name}</CardTitle>
                                  <CardDescription className="text-sm">+{boost.bonus} Насекомикс/мин</CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="gap-1">
                                  <Icon name="Coins" className="h-3 w-3" />
                                  {boost.price}
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => handleBuyBoost(boost)}
                                  disabled={userBalance < boost.price || activeBoosts.includes(boost.id)}
                                >
                                  {activeBoosts.includes(boost.id) ? 'Куплено' : 'Купить'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shop" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Магазин Насекомикс</CardTitle>
                <CardDescription>Используйте виртуальную валюту для покупки улучшений и кастомизации сайта</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {SHOP_ITEMS.map((item) => (
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
                    <AlertDescription>Войдите в систему, чтобы покупать предметы</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Предложить идею автору</CardTitle>
                <CardDescription>Ваши предложения помогут улучшить энциклопедию. За каждую идею: +40 Насекомикс!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="idea">Ваша идея</Label>
                  <Textarea
                    id="idea"
                    placeholder="Опишите вашу идею или предложение... Например, добавьте новое существо с описанием!"
                    rows={6}
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Подсказка: Предложите новое существо для добавления в энциклопедию с полным описанием
                  </p>
                </div>
                <Button onClick={handleSubmitIdea} disabled={!ideaText.trim() || !isLoggedIn}>
                  <Icon name="Send" className="h-4 w-4 mr-2" />
                  Отправить идею (+40 Насекомикс)
                </Button>
                {!isLoggedIn && (
                  <Alert>
                    <Icon name="Lock" className="h-4 w-4" />
                    <AlertDescription>Войдите в систему, чтобы отправлять идеи</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Поддержка автора</CardTitle>
                <CardDescription>Финансовая поддержка проекта</CardDescription>
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

      <Dialog open={showAchievements} onOpenChange={setShowAchievements}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Icon name="Trophy" className="h-6 w-6 text-primary" />
              Достижения
            </DialogTitle>
            <DialogDescription>Разблокируйте достижения и получайте награды</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <Card key={ach.id} className={ach.unlocked ? 'border-primary bg-primary/5' : 'opacity-60'}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        ach.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <Icon name={ach.icon as any} className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm">{ach.title}</CardTitle>
                      <CardDescription className="text-xs">{ach.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant={ach.unlocked ? 'default' : 'secondary'} className="gap-1">
                    {ach.unlocked ? <Icon name="Check" className="h-3 w-3" /> : <Icon name="Lock" className="h-3 w-3" />}
                    {ach.reward} Насекомикс
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
                <li>• Каталог существ ({SAMPLE_CREATURES.length})</li>
                <li>• Система добычи</li>
                <li>• Магазин улучшений</li>
                <li>• Достижения ({achievements.length})</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Контакты</h3>
              <p className="text-sm text-muted-foreground">Предложения и вопросы отправляйте через форму обратной связи</p>
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
