'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { EventCard } from '@/components/event-card';
import { EventDetailModal } from '@/components/event-detail-modal';
import { FilterTabs } from '@/components/filter-tabs';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { fetchAllEvents, createRegistration } from '@/lib/api';

export interface Event {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  image: string;
  status: 'upcoming' | 'ended';
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ended'>('all');
  const { toast } = useToast();

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        const fetchedEvents = await fetchAllEvents();
        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách sự kiện. Vui lòng thử lại sau.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.status === filter));
    }
  }, [events, filter]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleRegistration = async (eventId: string, userId: string) => {
    try {
      await createRegistration(Number(userId), (eventId));
      toast({
        title: 'Đăng ký thành công!',
        description: 'Bạn đã đăng ký tham gia sự kiện thành công. Chúng tôi sẽ gửi email xác nhận sớm nhất.',
      });
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, registered: event.registered + 1 } : event,
        ),
      );
    } catch (error) {
      toast({
        title: 'Đăng ký thất bại',
        description: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Khám phá các sự kiện tuyệt vời</h1>
          <p className="text-xl text-gray-600 mb-6">
            Tham gia các sự kiện công nghệ, networking và học tập hàng đầu
          </p>
          <FilterTabs currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={() => handleEventClick(event)}
                onRegister={() => handleEventClick(event)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Không có sự kiện nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        )}
      </main>

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegister={handleRegistration}
      />
      <Toaster />
    </div>
  );
}
