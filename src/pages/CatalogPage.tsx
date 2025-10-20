import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Header from '@/components/Header';
import { api, Creature } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const CATEGORIES = ['Все', 'Млекопитающие', 'Птицы', 'Рептилии', 'Насекомые', 'Паукообразные'];

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'Все');

  useEffect(() => {
    loadCreatures();
  }, [category, user]);

  const loadCreatures = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category !== 'Все') params.category = category;
      if (user) params.userId = user.id;
      
      const data = await api.getCreatures(params);
      setCreatures(data.creatures);
    } catch (error) {
      console.error('Failed to load creatures:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCreatures();
      return;
    }
    
    setLoading(true);
    try {
      const params: any = { search: searchQuery };
      if (user) params.userId = user.id;
      
      const data = await api.getCreatures(params);
      setCreatures(data.creatures);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Каталог существ</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-2">
            <Input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Icon name="Search" size={18} />
            </Button>
          </div>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Категория" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin mx-auto text-primary" />
          </div>
        ) : creatures.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Icon name="SearchX" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatures.map((creature) => (
              <Link key={creature.id} to={`/creature/${creature.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{creature.name}</CardTitle>
                        <CardDescription className="italic">{creature.latin_name}</CardDescription>
                      </div>
                      <Badge variant="secondary">{creature.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{creature.description}</p>
                    {creature.conservation_status && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon name="Shield" size={16} className="text-amber-600" />
                        <span>{creature.conservation_status}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
