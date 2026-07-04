import Nav from './components/nav'
import Hero from './components/hero'
import FeatureGrid from './components/feature-grid'
import ProductShowcase from './components/product-showcase'
import Footer from './components/footer'

export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <FeatureGrid />
      <ProductShowcase />
      <Footer/>
    </>
  )
}