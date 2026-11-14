const SUPABASE_URL = 'https://pzrhpdtzrrcjdzikaepo.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cmhwZHR6cnJjamR6aWthZXBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDY0OTUyMiwiZXhwIjoyMTEwMjI1NTIyfQ.Q_O7yJH32gbeAbsEh5YrE1LaV8EEtUZ5zo4B7rgLASk';

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

async function req(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Error: ${method} ${path} →`, text);
    return null;
  }
  return text ? JSON.parse(text) : [];
}

// Exact names/titles that were seeded
const SEEDED_BOOK_TITLES = [
  'مملكة الصدى والرماد',
  'مدينة الأحلام المعلقة',
  'أوراق قرطبة المفقودة',
  'ترانيم الصمت والضوء',
  'أسرار الورّاقين',
  'أطياف النهر البعيد',
];

const SEEDED_AUTHOR_NAMES = [
  'أحمد الرشيد',
  'سارة النعيمي',
  'د. طارق السعدون',
  'مريم الصباح',
];

const SEEDED_WORLD_NAMES = [
  'عالم ظلال الأبدية',
  'عالم مدينة الأحلام',
  'سلسلة المخطوطات الأندلسية',
];

const SEEDED_BLOG_TITLES = [
  'فن السرد وصناعة الكلمة في الأدب العربي المعاصر',
  'رحلة المخطوطة: من الفكرة الأولى إلى رفوف المكتبة',
];

async function clearSeedData() {
  console.log('🗑️  Clearing seed data from Dar Al-Rehab database...\n');

  // 1. Delete seeded blog posts
  const posts = await req('GET', 'blog_posts?select=id,title_ar');
  if (posts) {
    for (const post of posts) {
      if (SEEDED_BLOG_TITLES.includes(post.title_ar)) {
        await req('DELETE', `blog_posts?id=eq.${post.id}`);
        console.log(`✓ Deleted blog post: ${post.title_ar}`);
      }
    }
  }

  // 2. Delete seeded books (also nulls their author/world FKs first to avoid issues)
  const books = await req('GET', 'books?select=id,title_ar');
  if (books) {
    for (const book of books) {
      if (SEEDED_BOOK_TITLES.includes(book.title_ar)) {
        await req('DELETE', `books?id=eq.${book.id}`);
        console.log(`✓ Deleted book: ${book.title_ar}`);
      }
    }
  }

  // 3. Delete seeded authors
  const authors = await req('GET', 'authors?select=id,name_ar');
  if (authors) {
    for (const author of authors) {
      if (SEEDED_AUTHOR_NAMES.includes(author.name_ar)) {
        await req('DELETE', `authors?id=eq.${author.id}`);
        console.log(`✓ Deleted author: ${author.name_ar}`);
      }
    }
  }

  // 4. Delete seeded worlds
  const worlds = await req('GET', 'worlds?select=id,name_ar');
  if (worlds) {
    for (const world of worlds) {
      if (SEEDED_WORLD_NAMES.includes(world.name_ar)) {
        await req('DELETE', `worlds?id=eq.${world.id}`);
        console.log(`✓ Deleted world: ${world.name_ar}`);
      }
    }
  }

  // 5. Report remaining real data
  const remainingBooks = await req('GET', 'books?select=id,title_ar&order=created_at.asc');
  const remainingAuthors = await req('GET', 'authors?select=id,name_ar');
  const remainingWorlds = await req('GET', 'worlds?select=id,name_ar');
  const remainingPosts = await req('GET', 'blog_posts?select=id,title_ar');

  console.log('\n📊 Remaining real data in database:');
  console.log(`   Books:   ${remainingBooks?.length ?? 0}`);
  if (remainingBooks?.length) remainingBooks.forEach(b => console.log(`     - ${b.title_ar}`));
  console.log(`   Authors: ${remainingAuthors?.length ?? 0}`);
  if (remainingAuthors?.length) remainingAuthors.forEach(a => console.log(`     - ${a.name_ar}`));
  console.log(`   Worlds:  ${remainingWorlds?.length ?? 0}`);
  if (remainingWorlds?.length) remainingWorlds.forEach(w => console.log(`     - ${w.name_ar}`));
  console.log(`   Blog:    ${remainingPosts?.length ?? 0}`);
  if (remainingPosts?.length) remainingPosts.forEach(p => console.log(`     - ${p.title_ar}`));

  console.log('\n✅ Done! Website now shows only real database content.');
}

clearSeedData().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});

