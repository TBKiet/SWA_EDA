-- Xóa bảng nếu tồn tại (chỉ dùng cho môi trường dev)
DROP TABLE IF EXISTS events;

-- Tạo bảng Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  short_description VARCHAR(255),
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  registered INT DEFAULT 0,
  image VARCHAR(255),
  status VARCHAR(20) DEFAULT 'upcoming',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);

-- Chèn dữ liệu mẫu
INSERT INTO events (
  name, description, short_description, date, location, capacity, registered, image, status, "createdAt", "updatedAt"
) VALUES
  ('Hội thảo Công nghệ AI 2025',
   'Sự kiện chia sẻ kiến thức AI với chuyên gia đầu ngành.',
   'Khám phá AI cùng chuyên gia.',
   '2025-08-15',
   'Đại học Bách Khoa',
   100, 20,
   'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Ngày hội việc làm CNTT',
   'Cơ hội gặp gỡ và phỏng vấn với các công ty công nghệ hàng đầu.',
   'Kết nối sinh viên và doanh nghiệp.',
   '2025-08-20',
   'Đại học Khoa học Tự nhiên',
   150, 150,
   'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Workshop Thiết kế UX/UI',
   'Buổi workshop dành cho người mới bắt đầu với UX/UI.',
   'Học UX/UI từ chuyên gia.',
   '2025-07-10',
   'Online',
   80, 80,
   'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61',
   'ended', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Khóa học Lập trình Web cơ bản',
   'Khóa học kéo dài 5 buổi giúp bạn nắm vững kiến thức lập trình web.',
   'Học HTML/CSS/JS cơ bản.',
   '2025-08-01',
   'Innovation Hub',
   60, 45,
   'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Seminar Blockchain & Crypto',
   'Buổi thảo luận mở về xu hướng công nghệ Blockchain và tiền mã hóa.',
   'Hiểu rõ về Blockchain.',
   '2025-09-05',
   'TP. Hồ Chí Minh',
   100, 90,
   'https://images.unsplash.com/photo-1620207418302-439b387441b0',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Chương trình thiện nguyện hè 2025',
   'Hoạt động từ thiện quy mô lớn tại vùng cao phía Bắc.',
   'Cơ hội đóng góp và trải nghiệm.',
   '2025-07-25',
   'Hà Giang',
   40, 35,
   'https://images.unsplash.com/photo-1509099836639-18ba1795216d',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Mini Hackathon: Build Your App',
   'Cuộc thi lập trình trong 24 giờ để xây dựng ứng dụng MVP.',
   'Hackathon 24h!',
   '2025-08-10',
   'FPT Software Campus',
   120, 75,
   'https://images.unsplash.com/photo-1557804506-669a67965ba0',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Offline gặp mặt CLB Công nghệ',
   'Buổi gặp mặt định kỳ giữa các thành viên trong CLB.',
   'Kết nối & chia sẻ.',
   '2025-07-18',
   'Đại học Công nghệ',
   50, 25,
   'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Buổi demo sản phẩm đồ án tốt nghiệp',
   'Sinh viên trình bày sản phẩm thực tế trước hội đồng và doanh nghiệp.',
   'Xem đồ án sáng tạo.',
   '2025-07-30',
   'ĐH Sư phạm Kỹ thuật',
   200, 180,
   'https://images.unsplash.com/photo-1573164713988-8665fc963095',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('Chương trình đào tạo AI nâng cao',
   'Dành cho người đã có nền tảng về Machine Learning, tập trung vào NLP & Vision.',
   'AI chuyên sâu cho thực chiến.',
   '2025-09-01',
   'VinUni Campus',
   30, 10,
   'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
   'upcoming', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
