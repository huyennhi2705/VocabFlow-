# VocabFlow

VocabFlow là ứng dụng học từ vựng tiếng Anh dành cho sinh viên và người tự học. Ứng dụng giúp lưu từ theo bộ, ôn bằng flashcard/quiz và theo dõi tiến độ học.

## Chức năng

- Đăng ký, đăng nhập, đăng xuất bằng email và mật khẩu (hash bcrypt, session cookie `httpOnly`).
- Dữ liệu bộ từ và từ vựng được cô lập theo tài khoản.
- CRUD bộ từ và từ (từ tiếng Anh, nghĩa tiếng Việt, ví dụ, trạng thái nhớ).
- Tìm kiếm theo từ/nghĩa và lọc theo trạng thái.
- Flashcard lật mặt, cập nhật trạng thái nhớ.
- Quiz nhiều lựa chọn, đáp án nhiễu ngẫu nhiên, chấm điểm phía server và lưu lượt quiz.
- Dashboard tổng hợp tiến độ và biểu đồ số từ mới trong 7 ngày gần nhất.
- Seed bộ từ mẫu TOEIC và IELTS.

## Yêu cầu

- Node.js 24 trở lên (hoặc Node.js 22.12 trở lên để tương thích bộ test Vitest).
- npm.

## Chạy local

1. Cài dependency:

   ```bash
   npm install
   ```

2. Tạo `.env` từ `.env.example`, sau đó thay `AUTH_SECRET` bằng chuỗi ngẫu nhiên riêng (ít nhất 32 ký tự). Ví dụ tạo secret an toàn:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```

3. Tạo database và Prisma client:

   ```bash
   npm run db:migrate -- --name init
   npm run db:generate
   ```

4. Seed bộ TOEIC/IELTS. Đặt `SEED_USER_EMAIL` và `SEED_USER_PASSWORD` trong `.env` (mật khẩu ít nhất 8 ký tự, chỉ dùng cho môi trường demo local), sau đó chạy:

   ```bash
   npm run db:seed
   ```

   Seed tạo/cập nhật user theo hai biến này và thêm các bộ từ mẫu vào tài khoản đó. Không dùng mật khẩu thật hoặc thông tin cá nhân trong video/bài nộp. Có thể bỏ hai biến seed và đăng ký tài khoản trong ứng dụng để bắt đầu với dữ liệu trống.

5. Chạy ứng dụng:

   ```bash
   npm run dev
   ```

   Mở [http://localhost:3000](http://localhost:3000).

## Kiểm tra

```bash
npm test
npm run typecheck
npm run build
```

`npm run db:studio` mở Prisma Studio để kiểm tra dữ liệu local.

## Công nghệ chính

- Next.js 16.4.5, React 19.1.1, TypeScript 5.9.3
- Tailwind CSS 3.4.19
- Prisma / `@prisma/client` 7.10.1, SQLite (`better-sqlite3` adapter)
- bcryptjs 3.0.2, Zod 4.6.7, Recharts 3.8.0

## Ghi chú bảo mật

- Không commit `.env`; `.gitignore` loại `.env` khỏi Git. `.env.example` chỉ chứa tên biến và placeholder.
- Không có API key/dịch vụ bên thứ ba trong ứng dụng.
- Mật khẩu được hash với bcrypt; cookie session có `httpOnly`, `SameSite=Lax` và `Secure` khi chạy production.
- Server actions xác thực tài khoản và giới hạn truy vấn theo user hiện tại. Điểm quiz được tính từ snapshot phía server.
- Bản demo dùng SQLite local; trước khi triển khai public cần cấu hình HTTPS, backup, chính sách rate limiting và rà soát bảo mật phù hợp với môi trường vận hành.

## Giới hạn hiện tại

- Không có OAuth, xác minh email hoặc quy trình quên/đổi mật khẩu.
- Quiz cần tối thiểu bốn nghĩa khác nhau trong phạm vi đã chọn; nếu chưa đủ, ứng dụng báo rõ và không lặp đáp án để tạo lựa chọn giả.
- Thống kê tuần dùng 7 ngày gần nhất theo UTC.
