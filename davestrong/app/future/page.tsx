import { futureFeatures } from "@/lib/data/dave";

export default function FuturePage() {
  return (
    <div className="space-y-6">
      <section className="surface p-5">
        <p className="label">TODO</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Next things to build</h1>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {futureFeatures.map((feature) => (
          <div key={feature} className="surface p-4">
            <p className="font-bold text-ink">{feature}</p>
            <p className="mt-2 text-sm text-stone-600">Placeholder for a future Dave Strong upgrade.</p>
          </div>
        ))}
      </section>
    </div>
  );
}
