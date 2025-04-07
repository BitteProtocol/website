import { HomeComponent } from '@/components/layout/Home';
import NewHero from '@/components/layout/NewHero';

export default async function Home() {
  return (
    <main className='flex flex-col items-center justify-between'>
      <NewHero />
      <HomeComponent />
    </main>
  );
}
