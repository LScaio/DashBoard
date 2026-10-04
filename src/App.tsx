import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Intro } from './components/layout/Intro'
import { TopNav } from './components/layout/TopNav'
import { Context } from './components/sections/Context'
import { DataSection } from './components/sections/DataSection'
import { Finale } from './components/sections/Finale'
import { Hero } from './components/sections/Hero'
import { Limits } from './components/sections/Limits'
import { MapSection } from './components/sections/MapSection'
import { Science } from './components/sections/Science'
import { Sources } from './components/sections/Sources'
import { Stories } from './components/sections/Stories'
import { TimeSection } from './components/sections/TimeSection'

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])

  return (
    <>
      <AnimatePresence>{!introDone && <Intro key="intro" onDone={finishIntro} />}</AnimatePresence>
      {introDone && (
        <>
          <TopNav />
          <main>
            <Hero />
            <Context />
            <DataSection />
            <TimeSection />
            <MapSection />
            <Stories />
            <Science />
            <Sources />
            <Limits />
            <Finale />
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
