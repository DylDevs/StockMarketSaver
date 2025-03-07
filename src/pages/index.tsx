import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription} from "@/components/ui/dialog";

const programs = [
  { name: "CCC", cost: 40, benefit: 800, description: "- Created jobs for young men in conservation projects\n- Boosted employment and spending" },
  { name: "WPA", cost: 90, benefit: 1500, description: "- Funded public works projects\n- Provided jobs and stimulated local economies" },
  { name: "SSA", cost: 65, benefit: 1200, description: "- Established Social Security\n- Improved financial security for the elderly and boosted confidence." },
  { name: "FDIC", cost: 50, benefit: 1000, description: "- Insured bank deposits\n- Restoring trust in banks and stabilizing the financial system." },
  { name: "TVA", cost: 70, benefit: 1300, description: "- Built electrical infrastructure\n- Provided electricity to rural America." },
  { name: "Trade Restoration", cost: 80, benefit: 1300, description: "- Reopened international trade\n- Allowed businesses to grow and boosted exports." },
  { name: "Banking Act", cost: 60, benefit: 1100, description: "- Reformed banking regulations\n- Prevented future collapses and ensured financial stability." },
  { name: "AAA", cost: 50, benefit: 900, description: "- Reduced agricultural production\n- Boosted crop prices and helped farmers recover." },
  { name: "FSA", cost: 75, benefit: 1300, description: "- Provided loans to struggling farmers\n- Helped stabilize rural economies and prevent foreclosures." },
  { name: "NRA", cost: 100, benefit: 1600, description: "- Set codes for fair competition\n- Improved wages and working conditions while stimulating industry." },
  { name: "SEC", cost: 40, benefit: 800, description: "- Regulated the stock market\n- Prevented stock market manipulation and restored investor confidence." },
  { name: "NLRB", cost: 45, benefit: 900, description: "- Protected workers' rights\n- Encouraged unionization and improved working conditions." }
];

 export default function Home() {
  const [government_budget, SetGovernmentBudget] = useState(350);
  const [stock_data, SetStockData] = useState([6984, 1095]);
  const [programs_bought, SetProgramsBought] = useState([false, false, false, false, false, false, false, false, false, false, false, false])

  const purchaseProgram = (program : { name: string, cost: number, benefit: number, description: string }) => {
    if (government_budget >= program.cost) {
      SetGovernmentBudget(government_budget - program.cost);
      SetStockData((prev) => [...prev, prev[prev.length - 1] + program.benefit]);
      let new_programs_bought = programs_bought
      new_programs_bought[programs.indexOf(program)] = true
      SetProgramsBought(new_programs_bought)
    }
  };

  const ChartComponent = () => {
    let color = stock_data[0] > stock_data[stock_data.length - 1] ? "#ff0000" : "#00ff00";
    const chartConfig = {
      x: { label: "DJIA Stock Index", color: color }
    } satisfies ChartConfig;

    const chartData = stock_data.map((value, index) => ({
      Year: 1929 + index,
      "DJIA Stock Index": value,
    }));

    return (
      <Card className="w-[calc(100vw-34px)]">
        <ChartContainer config={chartConfig} className="h-[490px] w-[calc(100vw-60px)] mt-2">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={true} />
            <XAxis dataKey="Year" tickCount={5} label={{ value: "Year", position: "bottom", offset: -5 }} />
            <YAxis tickCount={5} label={{ value: "DJIA Stock Index", angle: -90, position: "insideLeft", offset: 10 }} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Legend layout="horizontal" verticalAlign="bottom" align="left" wrapperStyle={{ marginLeft: "60px", marginBottom: "5px" }} />
            <defs>
              <linearGradient id="fill0" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.x.color} stopOpacity={0.8} />
                <stop offset="60%" stopColor={chartConfig.x.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chartConfig.x.color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area dataKey="DJIA Stock Index" type="natural" fill="url(#fill0)" stroke={chartConfig.x.color} stackId="a" isAnimationActive={false} />
          </AreaChart>
        </ChartContainer>
      </Card>
    );
  };

  const FinishedDialog = () => {
    return (
      <Dialog open={true}>
        <DialogTrigger/>
        <DialogContent>
          <DialogTitle>Congratulations!</DialogTitle>
          <DialogDescription>You saved the stock market by using New Deal policies!</DialogDescription>
          <DialogDescription>FDR created these programs to aid Americans during the Great Depression, this along with America's entrance in WW1 helped raise the stock market.</DialogDescription>
          <Button onClick={() => window.location.reload()}>Play Again</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="flex flex-col h-auto w-screen p-4 overflow-hidden">
      <div className="flex h-full w-full justify-between mb-4">
        <h1 className="font-bold text-2xl mt-1">Stock Market Saver</h1>
        <Card className="h-12 w-52 p-3">${government_budget} billion</Card>
      </div>
      <ChartComponent />
      {stock_data[0] < stock_data[stock_data.length - 1] ? <FinishedDialog/> : null}
      <Card className="mt-4 h-full flex flex-row gap-2 p-2">
        {programs.map((program, index) => (
          <Card key={program.name} className="flex flex-col w-48 h-80 p-2">
            <h1 className="text-xl font-bold">{program.name}</h1>
            <p className="text-md font-medium mt-1">Cost: ${program.cost}B</p>
            <p className="text-md font-medium">Benefit: +{program.benefit}</p>
            <div className="text-sm text-zinc-200 my-3 space-y-1 flex-grow">
              {program.description.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <Button onClick={() => purchaseProgram(program)} disabled={government_budget < program.cost || programs_bought[index]} className="mt-auto">
              Purchase
            </Button>
        </Card>
        ))}
      </Card>
    </div>
  );
}
