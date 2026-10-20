import { AnimatePresence, MotionConfig } from "framer-motion"
import { Route, Routes, useLocation } from "react-router"
import { MobileBar, Nav } from "./components/Nav"
import { PageShell } from "./components/PageShell"
import { setTone } from "./lib/tone"
import Home from "./pages/Home"
import Menu from "./pages/Menu"

export default function App() {
  const location = useLocation()

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          setTone("light")
          window.scrollTo({ top: 0, behavior: "instant" })
        }}
      >
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageShell title="Al Kenisa">
                <Home />
              </PageShell>
            }
          />
          <Route
            path="/menu"
            element={
              <PageShell title="La carta">
                <Menu />
              </PageShell>
            }
          />
          <Route
            path="*"
            element={
              <PageShell title="Al Kenisa">
                <Home />
              </PageShell>
            }
          />
        </Routes>
      </AnimatePresence>
      <MobileBar />
    </MotionConfig>
  )
}
