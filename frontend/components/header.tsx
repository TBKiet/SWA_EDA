'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { registerUser, login } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Header() {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is "logged in" via localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUsername(username);
    }
  }, []);

  const handleCreateUser = async () => {
    try {
      await registerUser(newName, newEmail, newPassword);
      setIsCreateUserModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      toast({
        title: 'Đăng ký thành công',
        description: 'Người dùng đã được tạo thành công.',
      });
    } catch (error) {
      toast({
        title: 'Đăng ký thất bại',
        description: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };

  const handleLogin = async () => {
    try {
      const { user } = await login(email, password); // user có user.id và user.username
      localStorage.setItem('user', JSON.stringify({ userId: user.id, username: user.username }));
      setIsLoggedIn(true);
      setUsername(user.username);
      setIsLoginModalOpen(false);
      setEmail('');
      setPassword('');
      toast({
        title: 'Đăng nhập thành công',
        description: `Chào mừng ${user.username}!`,
      });
    } catch (error) {
      toast({
        title: 'Đăng nhập thất bại',
        description: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername(null);
    toast({
      title: 'Đăng xuất thành công',
      description: 'Bạn đã đăng xuất khỏi hệ thống.',
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">EventFlow</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Sự kiện
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            Về chúng tôi
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
            Liên hệ
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <span className="text-gray-600">Xin chào, {username}</span>
              <Button variant="outline" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsCreateUserModalOpen(true)}>
                Đăng ký
              </Button>
              <Button variant="outline" onClick={() => setIsLoginModalOpen(true)}>
                Đăng nhập
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Register User Modal */}
      <Dialog open={isCreateUserModalOpen} onOpenChange={setIsCreateUserModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng ký người dùng mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newName" className="text-right">
                Tên
              </Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newEmail" className="text-right">
                Email
              </Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                Mật khẩu
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateUser}>Đăng ký</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng nhập</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleLogin}>Đăng nhập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
