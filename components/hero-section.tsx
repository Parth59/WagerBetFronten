import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Bet on Anything, Anytime, with Anyone
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Create and accept bets on our decentralized platform. Secured by blockchain, powered by smart contracts.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="/create-bet">
                  Create a Bet <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/explore">Explore Bets</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[350px] lg:h-[450px] bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg max-w-[80%]">
                  <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold">Featured Bet</h3>
                    <p className="text-sm text-muted-foreground">"Bitcoin will reach $100,000 by December 2025"</p>
                    <div className="flex justify-between text-sm">
                      <span>0.5 ETH</span>
                      <span>3 Takers</span>
                    </div>
                    <Button size="sm" className="w-full">
                      Take This Bet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
