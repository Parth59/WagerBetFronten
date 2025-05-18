import { Award, Lock, Zap } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform makes peer-to-peer betting simple, transparent, and secure
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Create a Bet</h3>
            <p className="text-muted-foreground">
              Specify your prediction, stake amount, and expiration date. Your funds are locked in a smart contract.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Find Takers</h3>
            <p className="text-muted-foreground">
              Other users can accept your bet by staking the same amount. All funds are securely held in escrow.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Resolution & Payout</h3>
            <p className="text-muted-foreground">
              When the bet resolves, our oracle verifies the outcome and the smart contract automatically distributes
              winnings.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
