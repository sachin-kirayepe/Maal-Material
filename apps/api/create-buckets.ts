import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database to create buckets...');
  
  // 1. Create Buckets
  await prisma.$executeRawUnsafe(`
    INSERT INTO storage.buckets (id, name, public) 
    VALUES 
      ('constructos-boq', 'constructos-boq', true),
      ('constructos-assets', 'constructos-assets', true),
      ('constructos-finance', 'constructos-finance', true),
      ('constructos-site', 'constructos-site', true),
      ('constructos-compliance', 'constructos-compliance', true),
      ('constructos-kyc', 'constructos-kyc', true)
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('Buckets created successfully.');

  // 2. Create Policies for the objects table so users can upload and view
  try {
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow Public Uploads" ON storage.objects 
      FOR INSERT TO public 
      WITH CHECK ( bucket_id IN ('constructos-boq', 'constructos-assets', 'constructos-finance', 'constructos-site', 'constructos-compliance', 'constructos-kyc') );
    `);
    console.log('Upload policy created.');
  } catch (e: any) {
    if (!e.message.includes('already exists')) {
      console.log('Note on upload policy:', e.message);
    }
  }

  try {
    await prisma.$executeRawUnsafe(`
      CREATE POLICY "Allow Public Viewing" ON storage.objects 
      FOR SELECT TO public 
      USING ( bucket_id IN ('constructos-boq', 'constructos-assets', 'constructos-finance', 'constructos-site', 'constructos-compliance', 'constructos-kyc') );
    `);
    console.log('View policy created.');
  } catch (e: any) {
    if (!e.message.includes('already exists')) {
      console.log('Note on view policy:', e.message);
    }
  }

  console.log("All buckets and policies setup is complete!");
}

main()
  .catch((e) => {
    console.error("Error connecting to database. Make sure your Supabase project is active (not paused).", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
