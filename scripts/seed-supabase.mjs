const SUPABASE_URL = 'https://pzrhpdtzrrcjdzikaepo.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cmhwZHR6cnJjamR6aWthZXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDY0OTUyMiwiZXhwIjoyMTEwMjI1NTIyfQ.Q_O7yJH32gbeAbsEh5YrE1LaV8EEtUZ5zo4B7rgLASk';

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function post(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Error inserting into ${table}:`, text);
    throw new Error(text);
  }
  return res.json();
}

async function get(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function seed() {
  console.log('Seeding Dar Al-Rehab database...');

  // 1. Worlds
  const worldsData = [
    {
      name_ar: 'عالم ظلال الأبدية',
      name_en: 'The Eternity Shadows Universe',
      description_ar: 'كون موازٍ تسكنه قوى لا يدركها البشر إلا حين تمسّهم. عالم تتصادم فيه الحضارات الكونية ويرسم فيه المصير خطوطاً لا يستطيع أحد تجاوزها.',
      description_en: 'A parallel cosmos inhabited by forces humans only perceive when touched. An epic literary universe.',
      banner_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&h=600&fit=crop&q=80',
      color_primary: '#23432E',
      is_featured: true,
    },
    {
      name_ar: 'عالم مدينة الأحلام',
      name_en: 'City of Dreams Universe',
      description_ar: 'ديستوبيا عربية مستقبلية تدور أحداثها في مدينة تطفو فوق السحاب، حيث الأحلام هي العملة الوحيدة والذاكرة تُباع في المزادات.',
      description_en: 'A futuristic dystopian universe where dreams are currency and memories are traded.',
      banner_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop&q=80',
      color_primary: '#B49A63',
      is_featured: true,
    },
    {
      name_ar: 'سلسلة المخطوطات الأندلسية',
      name_en: 'Andalusian Manuscripts Series',
      description_ar: 'سلسلة تاريخية أدبية تأخذ القارئ إلى أزقة قرطبة وغرناطة في عصورهما الذهبية، مستعرضة صراعات الفكر والترجمة وأسرار المكتبات القديمة.',
      description_en: 'A historical literary saga set in Cordoba and Granada during their golden age.',
      banner_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=600&fit=crop&q=80',
      color_primary: '#23432E',
      is_featured: true,
    }
  ];

  const existingWorlds = await get('worlds');
  let insertedWorlds = existingWorlds;
  if (existingWorlds.length === 0) {
    insertedWorlds = await post('worlds', worldsData);
    console.log(`✓ Inserted ${insertedWorlds.length} worlds`);
  } else {
    console.log(`Worlds already exist (${existingWorlds.length})`);
  }

  // 2. Authors
  const authorsData = [
    {
      name_ar: 'أحمد الرشيد',
      name_en: 'Ahmad Al-Rashid',
      bio_ar: 'روائي ومفكر عربي يُعرف بأسلوبه الملحمي الفلسفي الذي يمزج بين التراث الفكري والأسلوب الروائي المعاصر. حائز على عدة جوائز أدبية مرموقة.',
      bio_en: 'An accomplished Arabic novelist known for philosophical epics blending heritage with modern narrative craft.',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
      nationality: 'Saudi Arabia',
    },
    {
      name_ar: 'سارة النعيمي',
      name_en: 'Sara Al-Nuaimi',
      bio_ar: 'أديبة وباحثة متخصصة في الأدب المقارن والدراسات الإنسانية. صدرت لها عدة دراسات وروايات استشرافية تركت بصمة واضحة في المشهد الأدبي.',
      bio_en: 'An acclaimed author and researcher in comparative literature with groundbreaking speculative works.',
      photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&q=80',
      nationality: 'UAE',
    },
    {
      name_ar: 'د. طارق السعدون',
      name_en: 'Dr. Tariq Al-Saadoun',
      bio_ar: 'أستاذ التاريخ والفلسفة الإسلامية، وباحث في تراث المخطوطات. تُعد كتاباته مرجعاً في التوثيق التاريخي بأسلوب سردي ممتع.',
      bio_en: 'Professor of Islamic History and Philosophy, recognized authority on classical manuscripts.',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
      nationality: 'Kuwait',
    },
    {
      name_ar: 'مريم الصباح',
      name_en: 'Maryam Al-Sabah',
      bio_ar: 'كاتبة وناقدة أدبية تركز على تحولات السرد العربي ومسارات النشر الثقافي المعاصر، ومؤلفة العديد من الأعمال الروائية ذات البعد الإنساني.',
      bio_en: 'Literary critic and novelist exploring human condition and modern Arabic storytelling.',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&q=80',
      nationality: 'Bahrain',
    }
  ];

  const existingAuthors = await get('authors');
  let insertedAuthors = existingAuthors;
  if (existingAuthors.length <= 1) { // We inserted 1 test earlier
    const remainingAuthors = authorsData.filter(a => !existingAuthors.some(ea => ea.name_ar === a.name_ar));
    if (remainingAuthors.length > 0) {
      const added = await post('authors', remainingAuthors);
      insertedAuthors = [...existingAuthors, ...added];
      console.log(`✓ Added ${added.length} authors (total: ${insertedAuthors.length})`);
    }
  }

  // 3. Books
  const w1 = insertedWorlds[0]?.id;
  const w2 = insertedWorlds[1]?.id;
  const w3 = insertedWorlds[2]?.id;

  const a1 = insertedAuthors[0]?.id;
  const a2 = insertedAuthors[1]?.id;
  const a3 = insertedAuthors[2]?.id;
  const a4 = insertedAuthors[3]?.id || a1;

  const booksData = [
    {
      title_ar: 'مملكة الصدى والرماد',
      title_en: 'Kingdom of Echoes and Ash',
      author_id: a1,
      world_id: w1,
      cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop&q=80',
      description_ar: 'رواية ملحمية تمضي في استكشاف كوامن الذاكرة والتاريخ المنسي، حيث تتحول الكلمات إلى ملاذٍ تتلاقى فيه أسرار الأجيال وصراعات الفكر.',
      description_en: 'An epic novel exploring the depths of forgotten memory and intellectual struggles.',
      price: 55,
      original_price: 75,
      genre: 'Historical',
      format: 'both',
      pages: 420,
      is_featured: true,
      is_new: true,
      status: 'published',
    },
    {
      title_ar: 'مدينة الأحلام المعلقة',
      title_en: 'City of Suspended Dreams',
      author_id: a2,
      world_id: w2,
      cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&q=80',
      description_ar: 'استشراف فلسفي وأدبي لعالم يواجه مصيره التكنولوجي والإنساني في آن واحد، وصراع الروح في زمن الذكاء الاصطناعي.',
      description_en: 'A philosophical and literary exploration of humanity facing technological destiny.',
      price: 48,
      original_price: 65,
      genre: 'Sci-Fi',
      format: 'both',
      pages: 360,
      is_featured: true,
      is_new: true,
      status: 'published',
    },
    {
      title_ar: 'أوراق قرطبة المفقودة',
      title_en: 'The Lost Papers of Cordoba',
      author_id: a3,
      world_id: w3,
      cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop&q=80',
      description_ar: 'رحلة تحقيق أدبية وتاريخية تأخذ القارئ إلى قلب المكتبات الأندلسية، كاشفة عن مخطوط نادر غيّر مجرى حركة الترجمة في العالم القديم.',
      description_en: 'An intellectual quest through Andalusian libraries following a rare historical manuscript.',
      price: 60,
      original_price: 80,
      genre: 'Historical',
      format: 'both',
      pages: 510,
      is_featured: true,
      is_new: false,
      status: 'published',
    },
    {
      title_ar: 'ترانيم الصمت والضوء',
      title_en: 'Hymns of Silence and Light',
      author_id: a4,
      world_id: w1,
      cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e35b34?w=400&h=600&fit=crop&q=80',
      description_ar: 'مجموعة نصوص أدبية وتأملات فلسفية حول جماليات العزلة وقوة القراءة وصناعة الأفكار الخالدة في عصر السرعة.',
      description_en: 'A collection of literary essays and philosophical reflections on quiet thought.',
      price: 42,
      original_price: 55,
      genre: 'Literary',
      format: 'both',
      pages: 280,
      is_featured: true,
      is_new: true,
      status: 'published',
    },
    {
      title_ar: 'أسرار الورّاقين',
      title_en: 'Secrets of the Calligraphers',
      author_id: a3,
      world_id: w3,
      cover_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop&q=80',
      description_ar: 'رواية تسبر أغوار حوانيت الورّاقين في بغداد العباسية، وحكاية ناسخ يُدعى لنسخ كتاب سري يحتوي على أسرار خيمياء الكلمات.',
      description_en: 'A mesmerizing tale of manuscript copyists and forbidden knowledge in ancient Baghdad.',
      price: 52,
      original_price: 70,
      genre: 'Mystery',
      format: 'both',
      pages: 390,
      is_featured: false,
      is_new: false,
      status: 'published',
    },
    {
      title_ar: 'أطياف النهر البعيد',
      title_en: 'Specters of the Distant River',
      author_id: a1,
      world_id: w1,
      cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop&q=80',
      description_ar: 'رواية نفسية وإنسانية راقية تتبع رحلة عائلة عبر ثلاثة أجيال، وكيف تشكلت مصائرهم مع تحولات الوطن والنهر.',
      description_en: 'A multi-generational novel of family, rivers, and changing homelands.',
      price: 45,
      original_price: 60,
      genre: 'Literary',
      format: 'both',
      pages: 340,
      is_featured: false,
      is_new: true,
      status: 'published',
    }
  ];

  const existingBooks = await get('books');
  const remainingBooks = booksData.filter(b => !existingBooks.some(eb => eb.title_ar === b.title_ar));
  if (remainingBooks.length > 0) {
    const addedBooks = await post('books', remainingBooks);
    console.log(`✓ Added ${addedBooks.length} books (total: ${existingBooks.length + addedBooks.length})`);
  } else {
    console.log(`Books already populated (${existingBooks.length})`);
  }

  // 4. Blog Posts
  const blogPostsData = [
    {
      title_ar: 'فن السرد وصناعة الكلمة في الأدب العربي المعاصر',
      title_en: 'The Art of Narrative Craft in Contemporary Arabic Literature',
      excerpt_ar: 'رحلة في أعماق التقنيات السردية التي يستخدمها الروائيون العرب اليوم لتشكيل هويتهم الأدبية وفتح آفاق جديدة للرواية العربية.',
      excerpt_en: 'A journey into narrative techniques used by Arab novelists today to shape literary identity.',
      content_ar: '<p>في عالم يتسارع كل يوم، تبقى الكلمة المكتوبة هي الملاذ الأصيل للفكر والتأمل. في دار الرحاب، نؤمن بأن كل كتاب هو جسر بين عقل الكاتب وروح القارئ.</p><p>يمر الأدب العربي اليوم بمرحلة تحول غنية تلتقي فيها الأصالة السردية الكلاسيكية مع أحدث تقنيات الكتابة الروائية الحديثة، لتقدم للقارئ العربي تجارب تتجاوز الحدود الجغرافية والزمنية.</p>',
      content_en: '<p>In an accelerating world, the written word remains the enduring sanctuary of human thought.</p>',
      author_id: a1,
      image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      category: 'فكر وأدب',
      read_time: '٥ دقائق',
      status: 'published',
    },
    {
      title_ar: 'رحلة المخطوطة: من الفكرة الأولى إلى رفوف المكتبة',
      title_en: 'The Journey of a Manuscript: From First Draft to the Bookshelf',
      excerpt_ar: 'كيف تصنع دار الرحاب كتاباً فاخراً؟ نظرة حصرية خلف كواليس التحرير الأدبي، واختيار الخطوط والأوراق، وطباعة الأغلفة المتقنة.',
      excerpt_en: 'How Dar Al-Rehab crafts fine books: behind the scenes of editorial review and typography.',
      content_ar: '<p>صناعة الكتاب ليست مجرد طباعة أحرف على ورق، بل هي طقس إبداعي كامل يبدأ من اللحظة التي تصلنا فيها المخطوطة كفكرة خام.</p><p>يتعاون فريقنا من المحررين والمصممين والخطاطين لإخراج العمل في أبهى حلة تليق بقدسية الكلمة ومتعة القراءة.</p>',
      content_en: '<p>Bookmaking is not merely printing letters on paper; it is a holistic creative craft.</p>',
      author_id: a2,
      image_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
      category: 'صناعة النشر',
      read_time: '٦ دقائق',
      status: 'published',
    }
  ];

  const existingPosts = await get('blog_posts');
  if (existingPosts.length === 0) {
    const addedPosts = await post('blog_posts', blogPostsData);
    console.log(`✓ Added ${addedPosts.length} blog posts`);
  } else {
    console.log(`Blog posts already exist (${existingPosts.length})`);
  }

  console.log('Database seeding completed successfully!');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

