import Link from "next/link"
import { ArrowRight, Clock, DollarSign, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function FeaturedBets() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Bets</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse through the most popular bets on our platform
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {featuredBets.map((bet, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{bet.title}</CardTitle>
                  <Badge
                    variant={
                      bet.category === "Sports" ? "default" : bet.category === "Crypto" ? "secondary" : "outline"
                    }
                  >
                    {bet.category}
                  </Badge>
                </div>
                <CardDescription>{bet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {bet.amount} {bet.token}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Expires: {bet.expiresAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{bet.takers} takers</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Take This Bet</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/explore">
              View All Bets <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

const featuredBets = [
  {
    title: "Bitcoin to $100K",
    description: "Bitcoin will reach $100,000 before December 31, 2025",
    category: "Crypto",
    amount: "0.5",
    token: "ETH",
    expiresAt: "Dec 31, 2025",
    takers: 3,
  },
  {
    title: "Lakers Championship",
    description: "Lakers will win the NBA Championship in the 2025-2026 season",
    category: "Sports",
    amount: "0.25",
    token: "ETH",
    expiresAt: "Jun 30, 2026",
    takers: 5,
  },
  {
    title: "Tesla Stock Price",
    description: "Tesla stock will exceed $500 by the end of 2025",
    category: "Finance",
    amount: "0.3",
    token: "ETH",
    expiresAt: "Dec 31, 2025",
    takers: 2,
  },
  {
    title: "Presidential Election",
    description: "Democratic candidate will win the 2028 US Presidential Election",
    category: "Politics",
    amount: "1.0",
    token: "ETH",
    expiresAt: "Nov 10, 2028",
    takers: 7,
  },
  {
    title: "Ethereum Flippening",
    description: "Ethereum market cap will exceed Bitcoin's before 2027",
    category: "Crypto",
    amount: "2.0",
    token: "ETH",
    expiresAt: "Dec 31, 2026",
    takers: 4,
  },
  {
    title: "World Cup Winner",
    description: "Brazil will win the 2026 FIFA World Cup",
    category: "Sports",
    amount: "0.4",
    token: "ETH",
    expiresAt: "Jul 30, 2026",
    takers: 6,
  },
]
