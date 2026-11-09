PRAGMA foreign_keys = OFF;

-- =========================================
-- 1) CREATE TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Deck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Deck_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deckId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "normalizedTerm" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "example" TEXT NOT NULL DEFAULT '',
    "isRemembered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Word_deckId_fkey"
        FOREIGN KEY ("deckId") REFERENCES "Deck" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "QuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "deckId" TEXT,
    "questionsJson" TEXT NOT NULL,
    "answersJson" TEXT NOT NULL DEFAULT '[]',
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "QuizAttempt_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User" ("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizAttempt_deckId_fkey"
        FOREIGN KEY ("deckId") REFERENCES "Deck" ("id")
        ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE INDEX IF NOT EXISTS "Deck_userId_idx" ON "Deck"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "Deck_userId_name_key" ON "Deck"("userId", "name");
CREATE INDEX IF NOT EXISTS "Word_deckId_idx" ON "Word"("deckId");
CREATE INDEX IF NOT EXISTS "Word_createdAt_idx" ON "Word"("createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "Word_deckId_normalizedTerm_key" ON "Word"("deckId", "normalizedTerm");
CREATE INDEX IF NOT EXISTS "QuizAttempt_userId_createdAt_idx" ON "QuizAttempt"("userId", "createdAt");

-- =========================================
-- 2) INSERT USER DEMO
-- =========================================
INSERT INTO "User" ("id", "email", "passwordHash", "createdAt")
VALUES (
  'user_demo_1',
  'demo@worddrill.local',
  '$2b$12$demoHashForLocalDB',
  datetime('now')
)
ON CONFLICT("email") DO UPDATE SET
  "passwordHash" = excluded."passwordHash";

-- =========================================
-- 3) INSERT 10 DECKS
-- =========================================
INSERT INTO "Deck" ("id", "userId", "name", "description", "createdAt", "updatedAt")
VALUES
  ('deck_001', 'user_demo_1', 'VocabFlow - Bộ từ 1', 'Bộ từ vựng số 1 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_002', 'user_demo_1', 'VocabFlow - Bộ từ 2', 'Bộ từ vựng số 2 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_003', 'user_demo_1', 'VocabFlow - Bộ từ 3', 'Bộ từ vựng số 3 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_004', 'user_demo_1', 'VocabFlow - Bộ từ 4', 'Bộ từ vựng số 4 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_005', 'user_demo_1', 'VocabFlow - Bộ từ 5', 'Bộ từ vựng số 5 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_006', 'user_demo_1', 'VocabFlow - Bộ từ 6', 'Bộ từ vựng số 6 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_007', 'user_demo_1', 'VocabFlow - Bộ từ 7', 'Bộ từ vựng số 7 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_008', 'user_demo_1', 'VocabFlow - Bộ từ 8', 'Bộ từ vựng số 8 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_009', 'user_demo_1', 'VocabFlow - Bộ từ 9', 'Bộ từ vựng số 9 để luyện từ mỗi ngày.', datetime('now'), datetime('now')),
  ('deck_010', 'user_demo_1', 'VocabFlow - Bộ từ 10', 'Bộ từ vựng số 10 để luyện từ mỗi ngày.', datetime('now'), datetime('now'))
ON CONFLICT("userId","name") DO UPDATE SET
  "description" = excluded."description",
  "updatedAt" = excluded."updatedAt";

-- =========================================
-- 4) INSERT 100 WORDS FOR EACH DECK
-- =========================================
INSERT INTO "Word" ("id", "deckId", "term", "normalizedTerm", "meaning", "example", "isRemembered", "createdAt", "updatedAt")
SELECT
    d."id" || '_' || CAST(ROW_NUMBER() OVER (PARTITION BY d."id" ORDER BY p."term") AS TEXT) AS "id",
    d."id" AS "deckId",
    p."term" AS "term",
    lower(p."term") AS "normalizedTerm",
    p."meaning" AS "meaning",
    p."example" AS "example",
    0 AS "isRemembered",
    datetime('now') AS "createdAt",
    datetime('now') AS "updatedAt"
FROM "Deck" d
CROSS JOIN (
    VALUES
        ('ability', 'khả năng', 'Her ability to solve problems is impressive.'),
        ('absence', 'sự vắng mặt', 'His absence from class was noticed by the teacher.'),
        ('accommodate', 'đáp ứng, chứa được', 'The venue can accommodate up to 500 people.'),
        ('acquire', 'thu được', 'Students need to acquire new skills for work.'),
        ('adapt', 'thích nghi', 'We must adapt quickly to the new system.'),
        ('address', 'giải quyết, nhắc đến', 'The team will address the issue tomorrow.'),
        ('agenda', 'chương trình nghị sự', 'Please review the agenda before the meeting.'),
        ('allocate', 'phân bổ', 'The manager will allocate budget to each department.'),
        ('analyze', 'phân tích', 'The researchers analyze the results carefully.'),
        ('annual', 'hàng năm', 'The company holds an annual review each December.'),
        ('approach', 'cách tiếp cận', 'This approach is more effective than before.'),
        ('assess', 'đánh giá', 'The teacher will assess your final project.'),
        ('assign', 'giao việc', 'He will assign tasks to each member.'),
        ('attend', 'tham dự', 'All staff need to attend the training session.'),
        ('aware', 'nhận thức', 'They are aware of the risks involved.'),
        ('benefit', 'lợi ích', 'The program brings real benefits for students.'),
        ('brief', 'ngắn gọn', 'Please give me a brief summary of the report.'),
        ('budget', 'ngân sách', 'The budget for this project is limited.'),
        ('capacity', 'sức chứa', 'The conference room has a capacity of 200 seats.'),
        ('capture', 'ghi lại', 'The camera can capture images in low light.'),
        ('challenge', 'thử thách', 'The new project is a major challenge.'),
        ('channel', 'kênh', 'Customers can contact support through different channels.'),
        ('clarify', 'làm rõ', 'Can you clarify the final requirement?'),
        ('colleague', 'đồng nghiệp', 'My colleague helped me with the presentation.'),
        ('commit', 'cam kết', 'The company will commit more resources to training.'),
        ('communication', 'giao tiếp', 'Good communication is essential in a team.'),
        ('compete', 'cạnh tranh', 'Businesses compete for customers online.'),
        ('complex', 'phức tạp', 'The system has a complex structure.'),
        ('concentrate', 'tập trung', 'Please concentrate on the main issue.'),
        ('concept', 'khái niệm', 'The concept is explained clearly in the lesson.'),
        ('concern', 'mối quan tâm', 'Safety is the main concern for everyone.'),
        ('conclude', 'kết luận', 'The report concludes that sales improved.'),
        ('conduct', 'tiến hành', 'The company will conduct a survey next week.'),
        ('confirm', 'xác nhận', 'Please confirm the meeting time.'),
        ('consent', 'sự đồng ý', 'Written consent is required before processing data.'),
        ('consequence', 'hậu quả', 'The consequence of the delay was lost revenue.'),
        ('consider', 'xem xét', 'We should consider all possible options.'),
        ('constant', 'liên tục', 'He was under constant pressure to finish quickly.'),
        ('consume', 'tiêu thụ', 'Households consume more energy in winter.'),
        ('context', 'bối cảnh', 'This policy is explained in context.'),
        ('contract', 'hợp đồng', 'The contract was signed last Friday.'),
        ('contribute', 'góp phần', 'Everyone can contribute useful ideas.'),
        ('coordinate', 'phối hợp', 'She coordinates the work of all teams.'),
        ('core', 'cốt lõi', 'Research is the core of the department.'),
        ('create', 'tạo ra', 'The app can create reports automatically.'),
        ('crucial', 'rất quan trọng', 'Safety checks are crucial before launch.'),
        ('current', 'hiện tại', 'The current policy is under review.'),
        ('data', 'dữ liệu', 'The data shows a steady increase.'),
        ('debate', 'tranh luận', 'The board will debate the proposal tomorrow.'),
        ('decline', 'suy giảm', 'Sales declined after the price increase.'),
        ('decrease', 'giảm', 'The company expects a decrease in costs.'),
        ('define', 'định nghĩa', 'The teacher asked students to define the word.'),
        ('deliver', 'giao hàng', 'The courier will deliver the package today.'),
        ('demand', 'nhu cầu', 'Demand for online services is increasing.'),
        ('demonstrate', 'minh họa', 'The instructor will demonstrate the software.'),
        ('design', 'thiết kế', 'The new design is more user-friendly.'),
        ('detect', 'phát hiện', 'The alarm can detect unusual activity.'),
        ('determine', 'xác định', 'The team must determine the root cause.'),
        ('develop', 'phát triển', 'They want to develop a stronger strategy.'),
        ('device', 'thiết bị', 'The device needs a software update.'),
        ('differ', 'khác nhau', 'The two reports differ in several details.'),
        ('discuss', 'thảo luận', 'Let us discuss the budget in the meeting.'),
        ('document', 'tài liệu', 'Please attach the latest document.'),
        ('economy', 'nền kinh tế', 'The economy is recovering steadily.'),
        ('efficient', 'hiệu quả', 'The new process is more efficient.'),
        ('element', 'yếu tố', 'Each element of the plan must be checked.'),
        ('emphasize', 'nhấn mạnh', 'The teacher emphasized key ideas.'),
        ('enable', 'cho phép', 'The update enables faster access to data.'),
        ('encourage', 'khuyến khích', 'The manager encourages teamwork.'),
        ('energy', 'năng lượng', 'Solar energy is becoming more popular.'),
        ('enhance', 'nâng cao', 'The software enhances the user experience.'),
        ('ensure', 'đảm bảo', 'We must ensure all steps are completed.'),
        ('evaluate', 'đánh giá', 'The professor will evaluate the assignment.'),
        ('evidence', 'bằng chứng', 'The evidence clearly supports the claim.'),
        ('evolve', 'phát triển', 'Technology continues to evolve quickly.'),
        ('expand', 'mở rộng', 'The company plans to expand overseas.'),
        ('expert', 'chuyên gia', 'The consultant is an expert in finance.'),
        ('facility', 'cơ sở vật chất', 'The facility includes meeting rooms and labs.'),
        ('factor', 'yếu tố', 'Price is a key factor in buying decisions.'),
        ('feature', 'tính năng', 'The new feature is available in the app.'),
        ('finance', 'tài chính', 'Finance students learn about investment.'),
        ('flexible', 'linh hoạt', 'The schedule is flexible and easy to adjust.'),
        ('focus', 'tập trung', 'The meeting will focus on sales targets.'),
        ('function', 'chức năng', 'This button has an important function.'),
        ('generate', 'tạo ra', 'The campaign will generate more leads.'),
        ('global', 'toàn cầu', 'The company has a global customer base.'),
        ('goal', 'mục tiêu', 'Our goal is to increase productivity.'),
        ('guideline', 'hướng dẫn', 'The guideline explains how to complete the task.'),
        ('highlight', 'nổi bật', 'The report highlights the main trends.'),
        ('identify', 'xác định', 'The system helps identify the cause.'),
        ('impact', 'tác động', 'The new policy has a major impact.'),
        ('implement', 'thực hiện', 'We need to implement the new policy soon.'),
        ('improve', 'cải thiện', 'The workshop aims to improve speaking skills.'),
        ('incentive', 'khuyến khích', 'The firm offers incentives for good performance.'),
        ('income', 'thu nhập', 'Household income increased this year.'),
        ('indicate', 'chỉ ra', 'The graph indicates a rise in demand.'),
        ('individual', 'cá nhân', 'Each individual must complete the form.'),
        ('industry', 'ngành công nghiệp', 'The industry is adopting more automation.'),
        ('inform', 'thông báo', 'The email will inform staff about the change.'),
        ('initial', 'ban đầu', 'The initial plan was approved quickly.')
) AS p("term","meaning","example")
WHERE d."name" IN (
  'VocabFlow - Bộ từ 1',
  'VocabFlow - Bộ từ 2',
  'VocabFlow - Bộ từ 3',
  'VocabFlow - Bộ từ 4',
  'VocabFlow - Bộ từ 5',
  'VocabFlow - Bộ từ 6',
  'VocabFlow - Bộ từ 7',
  'VocabFlow - Bộ từ 8',
  'VocabFlow - Bộ từ 9',
  'VocabFlow - Bộ từ 10'
);

-- Nếu muốn chạy lại nhiều lần mà không trùng dữ liệu:
-- DELETE FROM "Word" WHERE "deckId" IN ('deck_001','deck_002',...,'deck_010');
-- rồi chạy lại INSERT ở trên.