function generateRandomColor(lastColor: string | null = null): string {
  let r: number, g: number, b: number;
  
  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
    
    // 如果有上一个颜色，检查新颜色是否与之相似
    if (lastColor) {
      const lastRgb = lastColor.match(/\d+/g)!.map(Number);
      const colorDiff = Math.abs(r - lastRgb[0]) + Math.abs(g - lastRgb[1]) + Math.abs(b - lastRgb[2]);
      // 如果颜色差异太小，继续生成新颜色
      if (colorDiff < 150) continue;
    }
    break;
  } while (true);

  return `rgb(${r}, ${g}, ${b})`;
}

function adjustColor(color: string, difference: number): string {
  const rgb = color.match(/\d+/g)!.map(Number);
  const adjustedRgb = rgb.map(value => {
    const adjustment = Math.floor(Math.random() * difference);
    return Math.min(255, Math.max(0, value + (Math.random() > 0.5 ? adjustment : -adjustment)));
  });
  return `rgb(${adjustedRgb.join(', ')})`;
}

export function generateColors(total: number, difficultyFactor: number, lastBaseColor: string | null = null) {
  const baseColor = generateRandomColor(lastBaseColor);
  const differentIndex = Math.floor(Math.random() * total);
  
  const colors = Array(total).fill('').map((_, index) => {
    if (index === differentIndex) {
      return adjustColor(baseColor, difficultyFactor);
    }
    return baseColor;
  });

  return { colors, differentIndex, baseColor };
}
