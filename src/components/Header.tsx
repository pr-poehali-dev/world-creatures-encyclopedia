import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Icon name="BookOpen" size={32} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Энциклопедия Живых Существ</h1>
            <p className="text-xs text-muted-foreground">Бета-версия</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/catalog">
            <Button variant="ghost">Каталог</Button>
          </Link>
          <Link to="/shop">
            <Button variant="ghost">Магазин</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">О проекте</Button>
          </Link>
          <Link to="/feedback">
            <Button variant="ghost">Обратная связь</Button>
          </Link>
          
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md">
                <Icon name="Bug" size={16} className="text-primary" />
                <span className="font-semibold">{user.insectomix_balance}</span>
              </div>
              {user.is_premium && (
                <Badge variant="default">Premium</Badge>
              )}
              <Link to="/profile">
                <Button variant="outline">{user.username}</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                <Icon name="LogOut" size={18} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Вход</Button>
              </Link>
              <Link to="/register">
                <Button variant="default">Регистрация</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
