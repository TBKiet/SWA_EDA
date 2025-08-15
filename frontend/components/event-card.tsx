'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Event } from '@/app/page';

interface EventCardProps {
  event: Event;
  onViewDetails: () => void;
  onRegister: () => void;
}

export function EventCard({ event, onViewDetails, onRegister }: EventCardProps) {
  const isFullyBooked = event.registered >= event.capacity;
  const isEnded = event.status === 'ended';
  const eventDate = new Date(event.date);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={event.image || '/placeholder.svg'}
          alt={event.name}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
            {event.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{event.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{event.shortDescription}</p>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {eventDate.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          {event.location}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          {event.registered}/{event.capacity} người đã đăng ký
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onViewDetails} className="flex-1 bg-transparent">
          Xem chi tiết
        </Button>
        <Button
          onClick={onRegister}
          disabled={isFullyBooked || isEnded}
          className="flex-1"
        >
          {isEnded ? 'Đã kết thúc' : isFullyBooked ? 'Hết chỗ' : 'Đăng ký'}
        </Button>
      </CardFooter>
    </Card>
  );
}
