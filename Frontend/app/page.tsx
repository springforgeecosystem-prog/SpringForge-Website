import AnimatedNav      from '@/components/sections/AnimatedNav'
import AnimatedHero     from '@/components/sections/AnimatedHero'
import AnimatedStats    from '@/components/sections/AnimatedStats'
import AnimatedFeatures from '@/components/sections/AnimatedFeatures'
import AnimatedDownload from '@/components/sections/AnimatedDownload'
import AnimatedFooter   from '@/components/sections/AnimatedFooter'

export const dynamic = 'force-dynamic'

interface PluginInfo {
  name: string
  version: string
  uploadDate: string
  description: string
  hasFile: boolean
}

async function getPluginInfo(): Promise<PluginInfo> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/plugin/info`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error('fetch failed')
    return res.json()
  } catch {
    return {
      name: 'SpringForge',
      version: 'N/A',
      uploadDate: 'N/A',
      description: '',
      hasFile: false,
    }
  }
}

export default async function Home() {
  const plugin = await getPluginInfo()

  return (
    <main className="min-h-screen bg-dark-base">
      <AnimatedNav />
      <AnimatedHero />
      <AnimatedStats />
      <AnimatedFeatures version={plugin.version} />
      <AnimatedDownload plugin={plugin} />
      <AnimatedFooter />
    </main>
  )
}
