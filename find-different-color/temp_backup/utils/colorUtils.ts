function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
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

export function generateColors(total: number, difficultyFactor: number) {
  const baseColor = generateRandomColor();
  const differentIndex = Math.floor(Math.random() * total);
  
  const colors = Array(total).fill('').map((_, index) => {
    if (index === differentIndex) {
      return adjustColor(baseColor, difficultyFactor);
    }
    return baseColor;
  });

  return { colors, differentIndex };
}