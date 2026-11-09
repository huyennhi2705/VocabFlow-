import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: databaseUrl }) });

const vocabularyBank = [
  ["abandon", "bỏ rơi", "The company had to abandon the project after the budget cut."],
  ["ability", "khả năng", "Her ability to solve problems impressed the whole team."],
  ["absence", "sự vắng mặt", "The manager noted his repeated absence from meetings."],
  ["accommodate", "ưu tiên, đáp ứng", "The hotel can accommodate up to 200 guests."],
  ["acquire", "thu được", "Students need to acquire new skills for the future."],
  ["adapt", "thích nghi", "Employees must adapt to new software quickly."],
  ["address", "giải quyết, nói đến", "We need to address the issue before Friday."],
  ["advanced", "nâng cao, tiên tiến", "The course offers advanced writing practice."],
  ["affect", "ảnh hưởng", "Weather can affect production schedules."],
  ["agency", "đại lý, cơ quan", "The travel agency reorganized the itinerary."],
  ["alternative", "phương án thay thế", "We discussed an alternative plan for the launch."],
  ["analyze", "phân tích", "The team will analyze the customer feedback."],
  ["annual", "hàng năm", "The company holds its annual review in December."],
  ["approach", "cách tiếp cận", "Our approach focuses on practical learning."],
  ["appropriate", "phù hợp", "Please select the appropriate answer."],
  ["arrange", "sắp xếp", "She arranged a meeting with the supplier."],
  ["assess", "đánh giá", "The teacher will assess the writing samples."],
  ["assignment", "bài tập được giao", "The assignment is due next Monday."],
  ["attend", "tham dự", "All staff are required to attend the workshop."],
  ["aware", "nhận thức, biết", "Employees should be aware of the safety rules."],
  ["balance", "cân bằng", "A healthy lifestyle requires balance between work and rest."],
  ["benefit", "lợi ích", "The scheme brings clear benefits to students."],
  ["brief", "ngắn gọn, mô tả ngắn", "The brief summary highlights the key findings."],
  ["budget", "ngân sách", "The department needs a larger budget this year."],
  ["capacity", "sức chứa, năng lực", "The new hall has a capacity of 500 people."],
  ["capture", "ghi lại, bắt giữ", "The camera can capture images in low light."],
  ["category", "hạng mục", "Please sort the documents by category."],
  ["challenge", "thử thách", "The new project is a serious challenge for the team."],
  ["channel", "kênh", "Customers can contact support through multiple channels."],
  ["circular", "tròn, vòng quanh", "The report includes a circular chart of results."],
  ["clarify", "làm rõ", "Could you clarify the final requirement?"],
  ["colleague", "đồng nghiệp", "My colleague helped me prepare the presentation."],
  ["commit", "cam kết", "The company will commit more resources to training."],
  ["communication", "giao tiếp", "Strong communication is essential in any team."],
  ["compete", "cạnh tranh", "Small businesses compete for online customers."],
  ["complex", "phức tạp", "The system has a complex data structure."],
  ["concentrate", "tập trung", "Please concentrate on the main issue."],
  ["consequence", "hậu quả", "The consequence of the delay was lost sales."],
  ["consider", "xem xét", "We should consider all possible solutions."],
  ["consist", "gồm có", "The syllabus consists of lectures and seminars."],
  ["constant", "liên tục", "He faced constant pressure to finish the task."],
  ["construct", "xây dựng", "The bridge was built to construct a safer route."],
  ["consult", "tham khảo, tư vấn", "Consult the manual before installing the device."],
  ["consumer", "người tiêu dùng", "The consumer market is recovering steadily."],
  ["context", "bối cảnh", "This policy is explained in the context of globalization."],
  ["contract", "hợp đồng", "The contract was signed this morning."],
  ["contribute", "góp phần", "Everyone can contribute useful ideas."],
  ["coordinate", "phối hợp", "The office manager will coordinate the move."],
  ["core", "trung tâm, cốt lõi", "Research is the core of this department."],
  ["crucial", "rất quan trọng", "Safety checks are crucial before launch."],
  ["current", "hiện tại", "The current policy is under review."],
  ["data", "dữ liệu", "The data shows a clear trend over time."],
  ["debate", "tranh luận", "The board will debate the proposal tomorrow."],
  ["decade", "thập kỷ", "The company has expanded over the past decade."],
  ["decline", "suy giảm", "Sales declined after the price increase."],
  ["decrease", "giảm", "The team observed a decrease in demand."],
  ["define", "định nghĩa", "The teacher asked students to define the term."],
  ["delicate", "nhạy cảm, mong manh", "The issue requires a delicate approach."],
  ["deliver", "phân phối, giao hàng", "The courier will deliver the package today."],
  ["demand", "nhu cầu, yêu cầu", "Demand for online courses keeps growing."],
  ["demonstrate", "minh họa", "The presenter will demonstrate the software."],
  ["design", "thiết kế", "The new design is more user-friendly."],
  ["detect", "phát hiện", "Sensors can detect even small changes."],
  ["device", "thiết bị", "The device needs a software update."],
  ["dimension", "kích thước, chiều", "The report includes the dimensions of the room."],
  ["distribute", "phân phối", "The company will distribute materials to all branches."],
  ["diverse", "đa dạng", "The class is made up of diverse backgrounds."],
  ["document", "tài liệu", "Please attach the latest document."],
  ["domain", "lĩnh vực", "This is an important domain in technology."],
  ["duration", "thời lượng", "The training duration is three weeks."],
  ["economic", "kinh tế", "The report covers economic growth and inflation."],
  ["effective", "hiệu quả", "The new process is more effective than before."],
  ["efficient", "hiệu quả", "The team developed a more efficient workflow."],
  ["element", "yếu tố", "Each element of the plan must be checked."],
  ["emphasize", "nhấn mạnh", "The speaker emphasized the need for safety."],
  ["enable", "cho phép", "The update enables faster access to data."],
  ["encourage", "khuyến khích", "The mentor encourages students to ask questions."],
  ["energy", "năng lượng", "Solar panels generate clean energy."],
  ["enhance", "nâng cao", "The software enhances user experience."],
  ["ensure", "đảm bảo", "We must ensure all steps are completed."],
  ["equivalent", "tương đương", "The certificate is equivalent to a university diploma."],
  ["establish", "thành lập, thiết lập", "The company plans to establish a new branch."],
  ["estimate", "ước tính", "The team estimates costs for the next quarter."],
  ["ethical", "đạo đức", "Ethical standards must be respected."],
  ["evaluate", "đánh giá", "The professor will evaluate your presentation."],
  ["evidence", "bằng chứng", "The court reviewed the evidence carefully."],
  ["exhibit", "triển lãm, thể hiện", "The museum will exhibit local artwork."],
  ["expand", "mở rộng", "The business plans to expand into new markets."],
  ["expert", "chuyên gia", "The consultant is an expert in data analysis."],
  ["exposure", "sự tiếp xúc", "Exposure to English media helps improve listening."],
  ["external", "bên ngoài", "The issue requires an external review."],
  ["facilitate", "tạo điều kiện", "The app will facilitate online booking."],
  ["factor", "yếu tố", "Price is a key factor in customer choice."],
  ["feature", "tính năng", "The new feature is available in the latest version."],
  ["finance", "tài chính", "Finance students learn about investment and loans."],
  ["flexible", "linh hoạt", "The schedule is flexible and easy to adjust."],
  ["focus", "tập trung", "The meeting will focus on customer retention."],
  ["framework", "khung làm việc", "The company uses a clear project framework."],
  ["function", "chức năng", "This button has an important function."],
  ["generate", "tạo ra", "The campaign can generate more sales leads."],
  ["global", "toàn cầu", "The company has a global customer base."],
  ["goal", "mục tiêu", "Our goal is to increase productivity."],
  ["grant", "trợ cấp, cấp phép", "The university received a research grant."],
  ["harmony", "sự hòa hợp", "The group worked with a sense of harmony."],
  ["highlight", "nổi bật", "The report highlights the latest trends."],
  ["identify", "xác định", "The system helps identify the root cause."],
  ["ignore", "bỏ qua", "Do not ignore the warning sign."],
  ["illustrate", "minh họa", "Examples illustrate the concept clearly."],
  ["impact", "tác động", "The policy has a major impact on consumers."],
  ["implement", "thực hiện", "We need to implement the new process next week."],
  ["improve", "cải thiện", "The course aims to improve speaking skills."],
  ["incentive", "kích thích, ưu đãi", "The company offers incentives for performance."],
  ["income", "thu nhập", "Household income increased this year."],
  ["indicate", "chỉ ra", "The graph indicates a rapid rise in demand."],
  ["individual", "cá nhân", "Each individual must complete the form."],
  ["industry", "ngành công nghiệp", "The industry is investing in automation."],
  ["inform", "thông báo", "The email will inform employees about the change."],
  ["initial", "ban đầu", "The initial interview was very positive."],
  ["innovate", "đổi mới", "Startups innovate quickly in digital markets."],
  ["insight", "ánh nhìn, hiểu biết", "The report provides useful market insight."],
  ["instance", "ví dụ", "This is a good instance of the issue."],
  ["integrate", "tích hợp", "The app can integrate with social media."],
  ["intense", "mạnh, dữ dội", "The team experienced intense competition."],
  ["internal", "nội bộ", "The audit focused on internal controls."],
  ["invest", "đầu tư", "The government plans to invest in public transport."],
  ["issue", "vấn đề", "The issue was resolved in one meeting."],
  ["label", "nhãn", "Please add a clear label to each box."],
  ["labor", "lao động", "The factory relies on skilled labor."],
  ["launch", "ra mắt", "The company will launch a new product next month."],
  ["legal", "pháp lý", "The document must follow legal requirements."],
  ["levy", "thuế, khoản thu", "The city may levy a new tax on services."],
  ["location", "vị trí", "The office location is near the station."],
  ["maintain", "duy trì", "The school tries to maintain high standards."],
  ["major", "quan trọng, lớn", "Health is a major concern for students."],
  ["manage", "quản lý", "He learned how to manage a small team."],
  ["manual", "sổ tay, hướng dẫn", "Read the manual before using the equipment."],
  ["margin", "lợi nhuận biên, lề", "The company improved its profit margin."],
  ["market", "thị trường", "The market is very competitive this year."],
  ["method", "phương pháp", "The method is based on trial and error."],
  ["motive", "động cơ", "The motive behind the change is unclear."],
  ["network", "mạng lưới", "The network connects all office branches."],
  ["notice", "thông báo, chú ý", "Please notice the warning on the screen."],
  ["obtain", "thu được", "Students must obtain permission before entering."],
  ["occur", "xảy ra", "The problem may occur again during busy hours."],
  ["operate", "hoạt động", "The machine operates automatically."],
  ["opportunity", "cơ hội", "This internship offers a great opportunity."],
  ["option", "lựa chọn", "There are three options available."],
  ["organize", "tổ chức", "She organized the event successfully."],
  ["outcome", "kết quả", "The outcome depends on the final decision."],
  ["overall", "tổng thể", "The overall performance was excellent."],
  ["participate", "tham gia", "Students are encouraged to participate actively."],
  ["pattern", "mẫu, mô hình", "The pattern repeats every few months."],
  ["perceive", "nhận thức", "Customers perceive the product as durable."],
  ["period", "giai đoạn", "This period is known for rapid changes."],
  ["perspective", "góc nhìn", "The case should be reviewed from a different perspective."],
  ["policy", "chính sách", "The new policy affects all departments."],
  ["portion", "phần, lượng", "A large portion of the budget was spent."],
  ["potential", "tiềm năng", "The project has strong potential for growth."],
  ["predict", "dự đoán", "Experts predict slower growth next year."],
  ["prepare", "chuẩn bị", "They need time to prepare the report."],
  ["primary", "chính, ưu tiên", "Safety is the primary concern."],
  ["priority", "mức ưu tiên", "Customer service is our top priority."],
  ["process", "quá trình", "The process requires several approval steps."],
  ["product", "sản phẩm", "The product is sold in more than twenty countries."],
  ["promote", "quảng bá, thúc đẩy", "The campaign will promote the new service."],
  ["proposal", "đề nghị", "The board accepted the proposal after discussion."],
  ["purchase", "mua", "The company plans to purchase new equipment."],
  ["range", "phạm vi", "The product range is suitable for beginners."],
  ["recruit", "tuyển dụng", "The firm will recruit two new engineers."],
  ["reduce", "giảm", "The team wants to reduce expenses."],
  ["reference", "tham khảo, tài liệu tham chiếu", "Please include the reference in the footnote."],
  ["regulate", "điều chỉnh", "The government regulates prices in the sector."],
  ["relevant", "liên quan", "Only relevant information should be included."],
  ["require", "yêu cầu", "The course requires basic computer skills."],
  ["research", "nghiên cứu", "The research identifies key trends in education."],
  ["respond", "phản hồi", "We must respond to the customer by noon."],
  ["responsible", "chịu trách nhiệm", "Each team member is responsible for one task."],
  ["retain", "giữ lại", "The company wants to retain talented staff."],
  ["revenue", "doanh thu", "Revenue increased in the last quarter."],
  ["review", "xem xét, đánh giá", "The board will review the budget next week."],
  ["schedule", "lịch trình", "The schedule has been updated for next month."],
  ["secure", "an toàn, đảm bảo", "The data is stored in a secure location."],
  ["seek", "tìm kiếm", "The project team seeks qualified candidates."],
  ["select", "lựa chọn", "Students can select their preferred topic."],
  ["sequence", "trình tự", "The sequence of events is important in the story."],
  ["session", "buổi học, phiên", "The training session starts at nine oclock."],
  ["significant", "đáng kể, quan trọng", "The rise in demand was significant."],
  ["source", "nguồn", "The article lists its sources at the end."],
  ["specific", "cụ thể", "The teacher gave some specific examples."],
  ["strategy", "chiến lược", "The company adopted a new sales strategy."],
  ["stress", "căng thẳng", "Work stress can reduce productivity."],
  ["submit", "nộp", "Please submit the form before the deadline."],
  ["substitute", "thay thế", "Milk can be substituted with oat milk."],
  ["succeed", "thành công", "With effort, students can succeed in the exam."],
  ["sufficient", "đủ", "The evidence is sufficient for the decision."],
  ["summary", "tóm tắt", "The summary at the end explains the key points."],
  ["support", "hỗ trợ", "The university provides support for international students."],
  ["survey", "khảo sát", "The company conducted a customer survey."],
  ["system", "hệ thống", "The system updates automatically every night."],
  ["target", "mục tiêu", "Our target is to improve satisfaction by 20 percent."],
  ["technique", "kỹ thuật", "The technique is widely used in language learning."],
  ["technology", "công nghệ", "Technology continues to reshape education."],
  ["temporary", "tạm thời", "The office uses a temporary solution."],
  ["threat", "mối đe dọa", "Cybersecurity threats are increasing."],
  ["transfer", "chuyển giao", "The company will transfer the database to a new server."],
  ["trend", "xu hướng", "The trend toward remote work continues."],
  ["trigger", "kích hoạt", "A small mistake can trigger a major delay."],
  ["ultimate", "cuối cùng, tối hậu", "The ultimate objective is to improve quality."],
  ["undergo", " trải qua", "Students undergo a final assessment at the end."],
  ["undertake", "thực hiện", "The team will undertake a new project."],
  ["update", "cập nhật", "Please update the software before use."],
  ["valid", "hợp lệ", "The document is valid for one year."],
  ["value", "giá trị", "The product offers good value for money."],
  ["varied", "đa dạng", "The class uses a varied set of exercises."],
  ["vehicle", "phương tiện", "The company has a fleet of delivery vehicles."],
  ["version", "phiên bản", "The latest version includes several features."],
  ["viable", "khả thi", "The plan looks viable under current conditions."],
  ["vital", "cần thiết", "Good sleep is vital for concentration."],
  ["volume", "khối lượng, âm lượng", "The report includes a large volume of data."],
  ["wage", "tiền lương", "The wage increase was agreed by management."],
  ["widespread", "lan rộng", "The issue is widespread across the network."],
  ["workforce", "lực lượng lao động", "The workforce is trained in multiple skills."],
  ["yield", "mang lại", "The investment should yield good returns."],
  ["zone", "khu vực", "The loading zone is at the back of the building."]
];

const deckConfigs = Array.from({ length: 10 }, (_, index) => ({
  name: `VocabFlow – Bộ từ ${index + 1}`,
  description: `Bộ từ vựng tự động số ${index + 1} với 100 từ tiếng Anh để luyện tập hàng ngày.`
}));

function buildDeckWords(deckIndex: number): Array<[string, string, string]> {
  return Array.from({ length: 100 }, (_, i) => {
    const wordEntry = vocabularyBank[(deckIndex * 17 + i * 7) % vocabularyBank.length];
    const [term, meaning, example] = wordEntry;
    return [term, meaning, example.replace(/\bthe\b/gi, "the").replace(/\bThe\b/g, "The")];
  });
}

const sampleDecks = deckConfigs.map((deckConfig, index) => ({
  ...deckConfig,
  words: buildDeckWords(index)
}));

async function main() {
  const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_USER_PASSWORD;
  if (!email || !password || password.length < 8) {
    throw new Error("Set SEED_USER_EMAIL and SEED_USER_PASSWORD (at least 8 characters) in .env before seeding.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash }
  });
  const userId = user.id;

  for (const deckData of sampleDecks) {
    const deck = await prisma.deck.upsert({
      where: { userId_name: { userId, name: deckData.name } },
      update: { description: deckData.description },
      create: { userId, name: deckData.name, description: deckData.description }
    });

    for (const [term, meaning, example] of deckData.words) {
      await prisma.word.upsert({
        where: { deckId_normalizedTerm: { deckId: deck.id, normalizedTerm: term.toLowerCase() } },
        update: { meaning, example },
        create: {
          deckId: deck.id,
          term,
          normalizedTerm: term.toLowerCase(),
          meaning,
          example
        }
      });
    }
  }

  console.info("10 auto-generated vocabulary decks with 100 words each are ready.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
