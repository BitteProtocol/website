import Hero from '@/components/layout/Hero';
import { HomeComponent } from '@/components/layout/Home';
import { getAssistants } from '@/lib/api/ai-registry/registry';

export default async function Home() {
  const data = await getAssistants();
  return (
    <main className='flex flex-col items-center justify-between'>
      <Hero agentData={data} />
      <HomeComponent agentData={data} />
    </main>
  );
}
