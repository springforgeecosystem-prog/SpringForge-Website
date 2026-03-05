import AnimatedNav    from '@/components/sections/AnimatedNav'
import AnimatedDocs   from '@/components/sections/AnimatedDocs'
import AnimatedFooter from '@/components/sections/AnimatedFooter'

export const metadata = {
  title: 'Documentation — SpringForge',
  description: 'Learn how to install and use the SpringForge IntelliJ plugin.',
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-dark-base">
      <AnimatedNav />
      <AnimatedDocs />
      <AnimatedFooter />
    </main>
  )
}
