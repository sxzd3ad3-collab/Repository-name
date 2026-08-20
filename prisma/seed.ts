import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertSetting(key: string, value: string) {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

type LessonSeed = {
  title: string;
  content?: string;
  isFree?: boolean;
  videos?: { title: string; youtubeUrl?: string; duration?: string }[];
  quiz?: {
    title: string;
    questions: { question: string; options: string[]; correctIndex: number }[];
  };
};

async function createCourse(data: {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  learningOutcomes: string[];
  image: string;
  price: number;
  duration: string;
  level: string;
  gradeId?: string;
  categoryId?: string;
  conversationLevel?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  units: { title: string; lessons: LessonSeed[] }[];
}) {
  const course = await prisma.course.upsert({
    where: { slug: data.slug },
    update: {
      title: data.title,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      targetAudience: data.targetAudience,
      learningOutcomes: JSON.stringify(data.learningOutcomes),
      image: data.image,
      price: data.price,
      duration: data.duration,
      level: data.level,
      gradeId: data.gradeId,
      categoryId: data.categoryId,
      conversationLevel: data.conversationLevel,
      isFeatured: data.isFeatured ?? false,
      sortOrder: data.sortOrder ?? 0,
      isPublished: true,
    },
    create: {
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      targetAudience: data.targetAudience,
      learningOutcomes: JSON.stringify(data.learningOutcomes),
      image: data.image,
      price: data.price,
      duration: data.duration,
      level: data.level,
      gradeId: data.gradeId,
      categoryId: data.categoryId,
      conversationLevel: data.conversationLevel,
      isFeatured: data.isFeatured ?? false,
      sortOrder: data.sortOrder ?? 0,
      isPublished: true,
    },
  });

  await prisma.unit.deleteMany({ where: { courseId: course.id } });

  for (const [ui, unit] of data.units.entries()) {
    const createdUnit = await prisma.unit.create({
      data: { courseId: course.id, title: unit.title, sortOrder: ui },
    });
    for (const [li, lesson] of unit.lessons.entries()) {
      const createdLesson = await prisma.lesson.create({
        data: {
          unitId: createdUnit.id,
          title: lesson.title,
          content: lesson.content || "",
          isFree: Boolean(lesson.isFree),
          sortOrder: li,
        },
      });
      for (const [vi, video] of (lesson.videos || []).entries()) {
        await prisma.video.create({
          data: {
            lessonId: createdLesson.id,
            title: video.title,
            youtubeUrl: video.youtubeUrl,
            duration: video.duration,
            sortOrder: vi,
          },
        });
      }
      if (lesson.quiz) {
        const quiz = await prisma.quiz.create({
          data: { lessonId: createdLesson.id, title: lesson.quiz.title },
        });
        for (const [qi, q] of lesson.quiz.questions.entries()) {
          await prisma.quizQuestion.create({
            data: {
              quizId: quiz.id,
              question: q.question,
              options: JSON.stringify(q.options),
              correctIndex: q.correctIndex,
              sortOrder: qi,
            },
          });
        }
      }
    }
  }
  return course;
}

async function main() {
  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (existingAdmin) {
    console.log("Seed skipped: database already has data.");
    return;
  }

  const adminHash = await bcrypt.hash("Admin@2026", 10);

  await prisma.user.upsert({
    where: { phone: "01552647559" },
    update: {
      name: "مستر أحمد شعبان",
      email: "admin@ahmedshaban.com",
      passwordHash: adminHash,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      name: "مستر أحمد شعبان",
      email: "admin@ahmedshaban.com",
      phone: "01552647559",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const primary = await prisma.stage.upsert({
    where: { slug: "primary" },
    update: { name: "المرحلة الابتدائية", sortOrder: 1 },
    create: { name: "المرحلة الابتدائية", slug: "primary", sortOrder: 1 },
  });
  const prep = await prisma.stage.upsert({
    where: { slug: "prep" },
    update: { name: "المرحلة الإعدادية", sortOrder: 2 },
    create: { name: "المرحلة الإعدادية", slug: "prep", sortOrder: 2 },
  });
  const secondary = await prisma.stage.upsert({
    where: { slug: "secondary" },
    update: { name: "المرحلة الثانوية", sortOrder: 3 },
    create: { name: "المرحلة الثانوية", slug: "secondary", sortOrder: 3 },
  });

  const gradeDefs = [
    [primary.id, "الصف الأول الابتدائي", "primary-1", 1],
    [primary.id, "الصف الثاني الابتدائي", "primary-2", 2],
    [primary.id, "الصف الثالث الابتدائي", "primary-3", 3],
    [primary.id, "الصف الرابع الابتدائي", "primary-4", 4],
    [primary.id, "الصف الخامس الابتدائي", "primary-5", 5],
    [primary.id, "الصف السادس الابتدائي", "primary-6", 6],
    [prep.id, "الصف الأول الإعدادي", "prep-1", 7],
    [prep.id, "الصف الثاني الإعدادي", "prep-2", 8],
    [prep.id, "الصف الثالث الإعدادي", "prep-3", 9],
    [secondary.id, "الصف الأول الثانوي", "sec-1", 10],
    [secondary.id, "الصف الثاني الثانوي", "sec-2", 11],
    [secondary.id, "الصف الثالث الثانوي", "sec-3", 12],
  ] as const;

  const grades: Record<string, string> = {};
  for (const [stageId, name, slug, sort] of gradeDefs) {
    const g = await prisma.grade.upsert({
      where: { slug },
      update: { name, stageId, sortOrder: sort },
      create: { name, slug, stageId, sortOrder: sort },
    });
    grades[slug] = g.id;
  }

  const catDefs = [
    ["conversation", "المحادثة", "English Conversation", "CONVERSATION", "كورس المحادثة الإنجليزية", 1],
    ["phonics", "BrightStart Phonics", "BrightStart Phonics", "PHONICS", "تأسيس الأطفال والفونكس", 2],
    ["grammar", "القواعد", "Grammar", "SKILL", "كورس القواعد", 3],
    ["vocabulary", "المفردات", "Vocabulary", "SKILL", "كورس الكلمات والمفردات", 4],
    ["pronunciation", "النطق", "Pronunciation", "SKILL", "كورس النطق", 5],
    ["listening", "الاستماع", "Listening", "SKILL", "كورس الاستماع", 6],
    ["speaking", "التحدث", "Speaking", "SKILL", "كورس التحدث", 7],
    ["reading", "القراءة", "Reading", "SKILL", "كورس القراءة", 8],
    ["writing", "الكتابة", "Writing", "SKILL", "كورس الكتابة", 9],
    ["grade", "مناهج المراحل", "School Grades", "GRADE", "كورسات الصفوف الدراسية", 10],
  ] as const;

  const cats: Record<string, string> = {};
  for (const [slug, name, nameEn, type, description, sort] of catDefs) {
    const c = await prisma.category.upsert({
      where: { slug },
      update: { name, nameEn, type, description, sortOrder: sort },
      create: { slug, name, nameEn, type, description, sortOrder: sort },
    });
    cats[slug] = c.id;
  }

  const settings: Record<string, string> = {
    siteName: "مستر أحمد شعبان",
    siteNameEn: "Mr Ahmed Shaban",
    siteTagline:
      "منصة تعليمية متكاملة لتعلم اللغة الإنجليزية لجميع المراحل والمستويات، من تأسيس الأطفال والفونكس إلى المحادثة والجرامر وجميع مهارات اللغة الإنجليزية.",
    instapayName: "shaban4english1",
    instapayAddress: "https://ipn.eg/S/shaban4english1/instapay/9u7jAP",
    whatsapp: "01552647559",
    facebookUrl: "",
    instagramUrl: "https://www.instagram.com/shaban4english/",
    instagramHandle: "shaban4english",
    youtubeUrl: "",
    tiktokUrl: "",
    contactEmail: "",
    contactPhone: "01552647559",
    aboutName: "مستر أحمد شعبان",
    aboutBio:
      "معلم لغة إنجليزية يقدّم كورسات ودروس أونلاين لجميع المراحل والمستويات، بطريقة سهلة وعملية تناسب الأطفال والطلاب والكبار.",
    aboutExperience:
      "خبرة في تدريس مناهج المدارس وبرامج المهارات: الفونكس، الجرامر، المحادثة، والقراءة والكتابة.",
    aboutMethod:
      "نشرحه ببساطة، نتمرن عليه، ثم نستخدمه في مواقف حقيقية. الهدف أن يفهم الطالب ويتكلم بثقة.",
    aboutVision:
      "منصة عربية واضحة تساعد كل طالب يبدأ من مستواه الحقيقي ويصل لمستوى أفضل خطوة بخطوة.",
    aboutImage: "",
    logoUrl: "/logo.svg",
  };
  for (const [k, v] of Object.entries(settings)) await upsertSetting(k, v);

  const faqs = [
    {
      q: "كيف أحجز الكورس؟",
      a: "اختر الكورس ثم اضغط «احجز الآن»، اكتب بياناتك، واتبع تعليمات الدفع عبر InstaPay ثم ارفع صورة إيصال التحويل.",
    },
    {
      q: "كيف يتم الدفع؟",
      a: "الدفع يتم بتحويل المبلغ عبر InstaPay إلى الحساب الظاهر في صفحة الدفع، ثم رفع صورة الإيصال داخل الموقع.",
    },
    {
      q: "هل الدفع عن طريق InstaPay؟",
      a: "نعم. وسيلة الدفع الأساسية حاليًا هي InstaPay فقط.",
    },
    {
      q: "متى يتم تفعيل الكورس؟",
      a: "بعد مراجعة الإدارة لإيصال التحويل والتأكد من الدفع. عادة يتم التفعيل بعد التحقق مباشرة، وستظهر حالة الطلب داخل حسابك.",
    },
    {
      q: "هل أستطيع مشاهدة الفيديوهات من الهاتف؟",
      a: "نعم. الموقع مصمم للهاتف أولًا، ويمكنك مشاهدة الدروس وحل الاختبارات وتحميل الملفات من الموبايل.",
    },
    {
      q: "هل أستطيع الوصول للكورس بعد الشراء؟",
      a: "نعم. بعد قبول الدفع وتفعيل الكورس يظهر داخل «كورساتي» في حسابك وتقدر ترجع له في أي وقت.",
    },
    {
      q: "كيف أتواصل مع مستر أحمد شعبان؟",
      a: "من صفحة تواصل معنا أو عبر واتساب على الرقم 01552647559، أو من خلال حسابات السوشيال ميديا الموجودة في أسفل الموقع.",
    },
  ];
  await prisma.faq.deleteMany();
  for (const [i, f] of faqs.entries()) {
    await prisma.faq.create({ data: { question: f.q, answer: f.a, sortOrder: i } });
  }

  const sampleVideo = (title: string, url: string, duration = "8 دقائق") => ({
    title,
    youtubeUrl: url,
    duration,
  });

  const basicQuiz = (topic: string): LessonSeed["quiz"] => ({
    title: `اختبار ${topic}`,
    questions: [
      {
        question: `What is the main focus of this ${topic} lesson?`,
        options: ["Practice and understanding", "Memorizing only", "Skipping homework", "None"],
        correctIndex: 0,
      },
      {
        question: "Choose the correct greeting:",
        options: ["Good morning", "Good niteee", "Hi you go", "Bye hello"],
        correctIndex: 0,
      },
      {
        question: "أي جملة صحيحة؟",
        options: ["She is a student.", "She are a student.", "She am a student.", "She be student."],
        correctIndex: 0,
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف الرابع الابتدائي",
    slug: "primary-4-english",
    shortDescription: "شرح مبسط للمنهج مع تدريبات على الكلمات والجرامر والقراءة.",
    fullDescription:
      "كورس منظم يغطي وحدات الصف الرابع الابتدائي: المفردات، الجرامر الأساسي، الاستماع والقراءة، مع مراجعة واختبارات قصيرة بعد كل وحدة.",
    targetAudience: "طلاب الصف الرابع الابتدائي وأولياء الأمور الذين يريدون متابعة منظمة في البيت.",
    learningOutcomes: [
      "فهم دروس المنهج الأساسية",
      "استخدام كلمات الوحدة في جمل بسيطة",
      "التمييز بين الأزمنة الأساسية",
      "حل تدريبات مشابهة للامتحان",
    ],
    image: "/covers/primary-4.svg",
    price: 500,
    duration: "10 أسابيع",
    level: "مبتدئ",
    gradeId: grades["primary-4"],
    categoryId: cats.grade,
    isFeatured: true,
    sortOrder: 1,
    units: [
      {
        title: "الوحدة الأولى",
        lessons: [
          {
            title: "Lesson 1 — Welcome",
            isFree: true,
            content: "مقدمة الوحدة الأولى: التعارف والتحية والكلمات الأساسية.",
            videos: [sampleVideo("شرح الدرس الأول", "https://www.youtube.com/watch?v=75p-N9YKqNo", "6 دقائق")],
          },
          {
            title: "Lesson 2 — Vocabulary",
            content: "كلمات الوحدة مع نطق وأمثلة.",
            videos: [sampleVideo("المفردات", "https://www.youtube.com/watch?v=PRC6nVKoqt4", "7 دقائق")],
          },
          {
            title: "Grammar",
            content: "قواعد الوحدة مع أمثلة وتمارين.",
            videos: [sampleVideo("شرح الجرامر", "https://www.youtube.com/watch?v=lJ2EDs4s8n8", "10 دقائق")],
          },
          {
            title: "Review & Quiz",
            content: "مراجعة سريعة ثم اختبار الوحدة.",
            quiz: basicQuiz("الوحدة الأولى"),
          },
        ],
      },
      {
        title: "الوحدة الثانية",
        lessons: [
          {
            title: "Lesson 1",
            content: "بداية الوحدة الثانية.",
            videos: [sampleVideo("الدرس الأول", "https://www.youtube.com/watch?v=0e00JzAMdXE", "8 دقائق")],
          },
          {
            title: "Lesson 2",
            content: "تكملة الدروس والتدريب.",
            videos: [sampleVideo("الدرس الثاني", "https://www.youtube.com/watch?v=eIho2S0ZahI", "8 دقائق")],
          },
          {
            title: "Vocabulary & Grammar",
            content: "كلمات وقواعد الوحدة.",
          },
          {
            title: "Review & Quiz",
            quiz: basicQuiz("الوحدة الثانية"),
          },
        ],
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف الخامس الابتدائي",
    slug: "primary-5-english",
    shortDescription: "منهج الصف الخامس بشرح واضح وتدريب مستمر على المهارات.",
    fullDescription:
      "كورس يغطي وحدات الصف الخامس: القراءة، المفردات، الجرامر، والكتابة البسيطة مع اختبارات مراجعة.",
    targetAudience: "طلاب الصف الخامس الابتدائي.",
    learningOutcomes: ["فهم دروس المنهج", "بناء جمل صحيحة", "تحسين القراءة", "الاستعداد للاختبارات"],
    image: "/covers/primary-5.svg",
    price: 520,
    duration: "10 أسابيع",
    level: "مبتدئ",
    gradeId: grades["primary-5"],
    categoryId: cats.grade,
    sortOrder: 2,
    units: [
      {
        title: "الوحدة الأولى",
        lessons: [
          {
            title: "Lesson 1",
            isFree: true,
            content: "مقدمة الوحدة.",
            videos: [sampleVideo("الدرس الأول", "https://www.youtube.com/watch?v=0e00JzAMdXE")],
          },
          { title: "Vocabulary", content: "كلمات الوحدة." },
          { title: "Grammar", content: "قواعد الوحدة." },
          { title: "Quiz", quiz: basicQuiz("الصف الخامس") },
        ],
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف السادس الابتدائي",
    slug: "primary-6-english",
    shortDescription: "تأسيس قوي قبل الإعدادية مع مراجعة شاملة للمنهج.",
    fullDescription: "كورس الصف السادس يربط بين المنهج المدرسي ومهارات اللغة الأساسية.",
    targetAudience: "طلاب الصف السادس الابتدائي.",
    learningOutcomes: ["مراجعة المنهج", "تقوية الجرامر", "تحسين الاستماع", "الاستعداد للإعدادية"],
    image: "/covers/primary-6.svg",
    price: 550,
    duration: "12 أسبوعًا",
    level: "مبتدئ / متوسط",
    gradeId: grades["primary-6"],
    categoryId: cats.grade,
    sortOrder: 3,
    units: [
      {
        title: "الوحدة الأولى",
        lessons: [
          {
            title: "Lesson 1",
            isFree: true,
            videos: [sampleVideo("الدرس الأول", "https://www.youtube.com/watch?v=lJ2EDs4s8n8")],
          },
          { title: "Vocabulary" },
          { title: "Grammar" },
          { title: "Review & Quiz", quiz: basicQuiz("الصف السادس") },
        ],
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف الأول الإعدادي",
    slug: "prep-1-english",
    shortDescription: "شرح المنهج الإعدادي مع تركيز على الجرامر والقراءة.",
    fullDescription: "كورس منظم للصف الأول الإعدادي يغطي الوحدات الأساسية والمهارات المطلوبة.",
    targetAudience: "طلاب الصف الأول الإعدادي.",
    learningOutcomes: ["فهم دروس المنهج", "استخدام الأزمنة بشكل صحيح", "حل تدريبات القراءة"],
    image: "/covers/prep-1.svg",
    price: 650,
    duration: "12 أسبوعًا",
    level: "متوسط",
    gradeId: grades["prep-1"],
    categoryId: cats.grade,
    isFeatured: true,
    sortOrder: 4,
    units: [
      {
        title: "الوحدة الأولى",
        lessons: [
          {
            title: "Lesson 1",
            isFree: true,
            videos: [sampleVideo("الدرس الأول", "https://www.youtube.com/watch?v=eIho2S0ZahI")],
          },
          { title: "Vocabulary" },
          { title: "Grammar" },
          { title: "Quiz", quiz: basicQuiz("إعدادي أول") },
        ],
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف الثاني الإعدادي",
    slug: "prep-2-english",
    shortDescription: "منهج الصف الثاني الإعدادي بشرح عملي وتدريبات مركزة.",
    fullDescription: "كورس يغطي وحدات الصف الثاني الإعدادي مع مراجعة دورية.",
    targetAudience: "طلاب الصف الثاني الإعدادي.",
    learningOutcomes: ["إتقان قواعد الوحدة", "توسيع المفردات", "تحسين الكتابة القصيرة"],
    image: "/covers/prep-2.svg",
    price: 680,
    duration: "12 أسبوعًا",
    level: "متوسط",
    gradeId: grades["prep-2"],
    categoryId: cats.grade,
    sortOrder: 5,
    units: [
      {
        title: "الوحدة الأولى",
        lessons: [
          { title: "Lesson 1", isFree: true, videos: [sampleVideo("الدرس", "https://www.youtube.com/watch?v=0e00JzAMdXE")] },
          { title: "Vocabulary & Grammar" },
          { title: "Quiz", quiz: basicQuiz("إعدادي ثاني") },
        ],
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف الثالث الإعدادي",
    slug: "prep-3-english",
    shortDescription: "مراجعة شاملة واستعداد للامتحانات مع تدريب مكثف.",
    fullDescription: "كورس يركز على أهم نقاط المنهج ومهارات الحل.",
    targetAudience: "طلاب الصف الثالث الإعدادي.",
    learningOutcomes: ["مراجعة المنهج", "التدريب على الأسئلة", "تقوية الجرامر"],
    image: "/covers/prep-3.svg",
    price: 750,
    duration: "14 أسبوعًا",
    level: "متوسط",
    gradeId: grades["prep-3"],
    categoryId: cats.grade,
    sortOrder: 6,
    units: [
      {
        title: "الوحدة الأولى",
        lessons: [
          { title: "Lesson 1", isFree: true },
          { title: "Revision" },
          { title: "Quiz", quiz: basicQuiz("إعدادي ثالث") },
        ],
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف الأول الثانوي",
    slug: "sec-1-english",
    shortDescription: "بداية قوية للثانوية: جرامر، قراءة، ومهارات امتحانية.",
    fullDescription: "كورس الصف الأول الثانوي يربط المنهج بمهارات الفهم والتعبير.",
    targetAudience: "طلاب الصف الأول الثانوي.",
    learningOutcomes: ["فهم النصوص", "استخدام القواعد بدقة", "كتابة فقرة صحيحة"],
    image: "/covers/sec-1.svg",
    price: 850,
    duration: "14 أسبوعًا",
    level: "متوسط / متقدم",
    gradeId: grades["sec-1"],
    categoryId: cats.grade,
    isFeatured: true,
    sortOrder: 7,
    units: [
      {
        title: "الوحدة الأولى",
        lessons: [
          { title: "Lesson 1", isFree: true, videos: [sampleVideo("مقدمة", "https://www.youtube.com/watch?v=lJ2EDs4s8n8")] },
          { title: "Reading & Vocabulary" },
          { title: "Grammar" },
          { title: "Quiz", quiz: basicQuiz("أولى ثانوي") },
        ],
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف الثاني الثانوي",
    slug: "sec-2-english",
    shortDescription: "تعميق المهارات والاستعداد لسنة ثالثة.",
    fullDescription: "كورس منظم للصف الثاني الثانوي مع تركيز على النصوص والجرامر.",
    targetAudience: "طلاب الصف الثاني الثانوي.",
    learningOutcomes: ["تحليل النصوص", "قواعد متقدمة", "تدريب كتابي"],
    image: "/covers/sec-2.svg",
    price: 900,
    duration: "14 أسبوعًا",
    level: "متقدم",
    gradeId: grades["sec-2"],
    categoryId: cats.grade,
    sortOrder: 8,
    units: [
      {
        title: "الوحدة الأولى",
        lessons: [
          { title: "Lesson 1", isFree: true },
          { title: "Practice" },
          { title: "Quiz", quiz: basicQuiz("تانية ثانوي") },
        ],
      },
    ],
  });

  await createCourse({
    title: "إنجليزي الصف الثالث الثانوي",
    slug: "sec-3-english",
    shortDescription: "مراجعة مركزة وتدريب امتحاني ليلة الثانوية.",
    fullDescription: "كورس يركز على أهم الأفكار، الترجمة، الجرامر، والقطع.",
    targetAudience: "طلاب الصف الثالث الثانوي.",
    learningOutcomes: ["مراجعة سريعة ومنظمة", "حل نماذج", "تثبيت القواعد"],
    image: "/covers/sec-3.svg",
    price: 1100,
    duration: "16 أسبوعًا",
    level: "متقدم",
    gradeId: grades["sec-3"],
    categoryId: cats.grade,
    sortOrder: 9,
    units: [
      {
        title: "المراجعة الأولى",
        lessons: [
          { title: "Grammar Review", isFree: true },
          { title: "Reading Practice" },
          { title: "Quiz", quiz: basicQuiz("ثانوية عامة") },
        ],
      },
    ],
  });

  const convLevels = [
    ["A1", "a1", 600, "مبتدئ"],
    ["A2", "a2", 650, "مبتدئ+"],
    ["B1", "b1", 750, "متوسط"],
    ["B2", "b2", 850, "متوسط+"],
    ["C1", "c1", 1000, "متقدم"],
    ["C2", "c2", 1200, "متقدم جدًا"],
  ] as const;

  for (const [level, slug, price, label] of convLevels) {
    await createCourse({
      title: `English Conversation ${level}`,
      slug: `conversation-${slug}`,
      shortDescription: `كورس محادثة مستوى ${level} لتتكلم بثقة في مواقف يومية.`,
      fullDescription: `برنامج محادثة ${level} يشمل دروسًا، قصصًا قصيرة، مفردات، وأسئلة تدريب على التحدث.`,
      targetAudience: `الطلاب والكبار في مستوى ${label}.`,
      learningOutcomes: ["التحدث في مواقف يومية", "بناء جمل جاهزة للاستخدام", "تحسين الثقة والطلاقة"],
      image: `/covers/conversation-${slug}.svg`,
      price,
      duration: "8 أسابيع",
      level: label,
      categoryId: cats.conversation,
      conversationLevel: level,
      isFeatured: level === "A1" || level === "B1",
      sortOrder: 20,
      units: [
        {
          title: "Stories & Speaking",
          lessons: [
            {
              title: "Lesson 1 — Let's Talk",
              isFree: level === "A1",
              content: `حوارات ومفردات مستوى ${level}.`,
              videos: [sampleVideo("Speaking practice", "https://www.youtube.com/watch?v=0e00JzAMdXE")],
            },
            { title: "Vocabulary" },
            { title: "Speaking Practice" },
            { title: "Questions & Quiz", quiz: basicQuiz(`Conversation ${level}`) },
          ],
        },
      ],
    });
  }

  await createCourse({
    title: "BrightStart Phonics — Alphabet",
    slug: "phonics-alphabet",
    shortDescription: "تأسيس الحروف وأصواتها للأطفال بطريقة مرحة وواضحة.",
    fullDescription:
      "كورس BrightStart يبدأ من الحروف Alphabet وأصوات Letter Sounds مع أنشطة قراءة وكتابة بسيطة.",
    targetAudience: "الأطفال في مرحلة التأسيس وأولياء الأمور.",
    learningOutcomes: ["التعرف على الحروف", "ربط الحرف بالصوت", "بداية القراءة"],
    image: "/covers/phonics-alphabet.svg",
    price: 450,
    duration: "6 أسابيع",
    level: "تأسيس",
    categoryId: cats.phonics,
    isFeatured: true,
    sortOrder: 30,
    units: [
      {
        title: "Alphabet",
        lessons: [
          {
            title: "Alphabet Song",
            isFree: true,
            content: "تعلم الحروف من A إلى Z مع أغنية وأنشطة.",
            videos: [sampleVideo("Alphabet", "https://www.youtube.com/watch?v=75p-N9YKqNo", "5 دقائق")],
          },
          {
            title: "Letter Sounds",
            content: "صوت كل حرف مع أمثلة.",
            videos: [sampleVideo("Letter Sounds", "https://www.youtube.com/watch?v=saF3-f0XWAY", "8 دقائق")],
          },
        ],
      },
      {
        title: "Reading Start",
        lessons: [
          { title: "Phonics" },
          { title: "Worksheets & Quiz", quiz: basicQuiz("Alphabet") },
        ],
      },
    ],
  });

  await createCourse({
    title: "BrightStart Phonics — CVC Words",
    slug: "phonics-cvc",
    shortDescription: "قراءة كلمات CVC والحركات القصيرة Short Vowels.",
    fullDescription: "بعد الحروف ننتقل إلى CVC Words و Short Vowels مع تدريبات قراءة وكتابة.",
    targetAudience: "الأطفال بعد تعلم الحروف.",
    learningOutcomes: ["قراءة كلمات CVC", "التمييز بين الحركات القصيرة", "كتابة كلمات بسيطة"],
    image: "/covers/phonics-cvc.svg",
    price: 500,
    duration: "6 أسابيع",
    level: "تأسيس",
    categoryId: cats.phonics,
    sortOrder: 31,
    units: [
      {
        title: "CVC & Short Vowels",
        lessons: [
          {
            title: "Short Vowels",
            isFree: true,
            videos: [sampleVideo("Short vowels", "https://www.youtube.com/watch?v=gl1aE1dBx6s")],
          },
          { title: "CVC Words" },
          { title: "Reading" },
          { title: "Writing & Quiz", quiz: basicQuiz("CVC") },
        ],
      },
    ],
  });

  const skills: Array<[string, string, string, string, number, string]> = [
    ["grammar", "Grammar Essentials", "grammar-essentials", "كورس قواعد الإنجليزية من الأساسيات حتى الاستخدام الصحيح.", 550, "أساسي / متوسط"],
    ["vocabulary", "Vocabulary Builder", "vocabulary-builder", "بناء حصيلة كلمات عملية تستخدمها في المدرسة والحياة.", 450, "جميع المستويات"],
    ["pronunciation", "Pronunciation Course", "pronunciation", "تحسين النطق ووضوح الكلام.", 500, "جميع المستويات"],
    ["listening", "Listening Skills", "listening", "تدريب الأذن على فهم الإنجليزية تدريجيًا.", 500, "مبتدئ / متوسط"],
    ["speaking", "Speaking Confidence", "speaking", "ممارسة التحدث وبناء الثقة في الكلام.", 700, "مبتدئ / متوسط"],
    ["reading", "Reading Skills", "reading", "استراتيجيات القراءة والفهم.", 500, "متوسط"],
    ["writing", "Writing Skills", "writing", "الكتابة من الجملة إلى الفقرة.", 550, "متوسط"],
  ];

  for (const [cat, title, slug, desc, price, level] of skills) {
    await createCourse({
      title,
      slug,
      shortDescription: desc,
      fullDescription: `${desc} دروس مرتبة، أمثلة واضحة، وتدريب بعد كل جزء.`,
      targetAudience: "الطلاب والكبار الراغبون في تطوير المهارة بشكل منظم.",
      learningOutcomes: ["فهم المهارة", "التدريب عليها", "استخدامها في مواقف حقيقية"],
      image: `/covers/${slug}.svg`,
      price,
      duration: "8 أسابيع",
      level,
      categoryId: cats[cat],
      isFeatured: cat === "grammar" || cat === "speaking",
      sortOrder: 40,
      units: [
        {
          title: "الوحدة الأولى",
          lessons: [
            {
              title: "Lesson 1",
              isFree: true,
              videos: [sampleVideo("مقدمة", "https://www.youtube.com/watch?v=lJ2EDs4s8n8")],
            },
            { title: "Practice" },
            { title: "Quiz", quiz: basicQuiz(title) },
          ],
        },
      ],
    });
  }

  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
