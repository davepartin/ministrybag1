export function calculateHealthScore(weight: number, height: number): number {
  if (!weight || !height) return 50;
  
  // Calculate BMI
  const bmi = (weight / (height * height)) * 703;
  
  // For a 49-year-old man:
  // Average US BMI is around 28-29 (50th percentile)
  // Optimal/Healthy BMI is 22-23 (90th+ percentile)
  // High risk BMI is 35+ (10th- percentile)
  
  if (bmi <= 22) return 99;
  if (bmi >= 35) return 10;
  
  // Linear mapping: 22 BMI -> 99th percentile, 35 BMI -> 10th percentile
  // Difference of 13 BMI points covers 89 percentile points
  const score = 99 - ((bmi - 22) * (89 / 13));
  
  return Math.max(1, Math.min(99, Math.round(score)));
}

export function calculateStrengthScore(latestTests: Record<string, any>): number {
  // Normative data for 49-year-old men
  const norms: Record<string, { p50: number; p90: number }> = {
    "30-Second Chair Stand": { p50: 20, p90: 25 }, // reps
    "Max Strict Push-Ups": { p50: 18, p90: 30 }, // reps
    "Max Strict Pull-Ups": { p50: 4, p90: 8 }, // reps
    "Front Plank": { p50: 60, p90: 120 } // seconds
  };
  
  let totalScore = 0;
  let count = 0;
  
  for (const [name, norm] of Object.entries(norms)) {
    const val = latestTests[name]?.value;
    if (val !== undefined && val !== null && !isNaN(Number(val))) {
      let p = 0;
      const numVal = Number(val);
      
      if (numVal >= norm.p90) {
        // Above 90th percentile
        p = 90 + ((numVal - norm.p90) * 0.5); // Diminishing returns over 90
      } else if (numVal >= norm.p50) {
        // Between 50th and 90th
        p = 50 + ((numVal - norm.p50) / (norm.p90 - norm.p50)) * 40;
      } else {
        // Below 50th
        p = 10 + (numVal / norm.p50) * 40;
      }
      
      totalScore += Math.max(1, Math.min(99, p));
      count++;
    }
  }
  
  if (count === 0) return 0;
  return Math.round(totalScore / count);
}
