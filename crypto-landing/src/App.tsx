import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { PriceTicker } from './components/PriceTicker'
import { MarketsSection } from './components/MarketsSection'
import { SecuritySection } from './components/SecuritySection'
import { WalletsSection } from './components/WalletsSection'
import { TrustSection } from './components/TrustSection'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="relative min-h-screen bg-ink-950 text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <PriceTicker />
        <MarketsSection />
        <SecuritySection />
        <WalletsSection />
        <TrustSection />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default App
