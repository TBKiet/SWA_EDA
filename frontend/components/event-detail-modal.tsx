'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import type { Event } from '@/app/page';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (eventId: string, userId: string) => void;
}

export function EventDetailModal({ event, isOpen, onClose, onRegister }: EventDetailModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Lấy userId đúng từ localStorage
  const userId =
    typeof window !== 'undefined'
      ? (() => {
          try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored).userId : null;
          } catch {
            return null;
          }
        })()
      : null;

  if (!event) return null;

  const isFullyBooked = event.registered >= event.capacity;
  const isEnded = event.status === 'ended';
  const isDisabled = isFullyBooked || isEnded || !userId;
  const availableSpots = event.capacity - event.registered;
  const eventDate = new Date(event.date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusLabel = event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc';
  const badgeVariant = event.status === 'upcoming' ? 'default' : 'secondary';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đăng nhập để đăng ký sự kiện.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister(event.id, userId);
      toast({
        title: 'Thành công',
        description: 'Đăng ký sự kiện thành công!',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Đăng ký sự kiện thất bại. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{event.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <Image
              src={event.image || '/placeholder.svg'}
              alt={event.name}
              width={600}
              height={300}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={badgeVariant}>{statusLabel}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem icon={Calendar} label="Ngày tổ chức" value={eventDate} />
            <InfoItem icon={Clock} label="Thời gian" value="9:00 AM - 5:00 PM" />
            <InfoItem icon={MapPin} label="Địa điểm" value={event.location} />
            <InfoItem
              icon={Users}
              label="Sức chứa"
              value={
                <>
                  {event.registered}/{event.capacity} người đã đăng ký
                  {!isEnded && !isFullyBooked && (
                    <span className="text-green-600 ml-1">({availableSpots} chỗ còn lại)</span>
                  )}
                </>
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Mô tả sự kiện</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Đóng
              </Button>
              <Button type="submit" disabled={isDisabled || isSubmitting} className="flex-1">
                {isEnded
                  ? 'Sự kiện đã kết thúc'
                  : isFullyBooked
                  ? 'Hết chỗ trống'
                  : isSubmitting
                  ? 'Đang đăng ký...'
                  : 'Đăng ký tham gia'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center text-gray-600">
      <Icon className="h-5 w-5 mr-3" />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
