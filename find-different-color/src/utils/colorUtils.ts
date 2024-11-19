// RGB转HSL颜色空间
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// HSL转RGB颜色空间
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function adjustColor(color: string, difficultyFactor: number): string {
  const rgb = color.match(/\d+/g)!.map(Number);
  
  // 根据难度计算颜色调整范围
  // difficultyFactor从50开始递减（由page.tsx中的getDifficultyFactor控制）
  // 设置基础调整范围，让色差更加平滑
  const baseAdjustment = Math.max(8, Math.min(20, difficultyFactor / 2));
  // 添加小范围随机波动，避免过于固定
  const randomVariation = Math.random() * 5;
  const adjustment = baseAdjustment + randomVariation;
  
  // 随机选择一个RGB通道进行调整
  const channelToAdjust = Math.floor(Math.random() * 3);
  
  const adjustedRgb = [...rgb];
  // 50%概率增加或减少
  adjustedRgb[channelToAdjust] = Math.min(255, Math.max(0, 
    adjustedRgb[channelToAdjust] + (Math.random() > 0.5 ? adjustment : -adjustment)
  ));
  
  return `rgb(${adjustedRgb.join(', ')})`;
}

export function generateColors(total: number, difficultyFactor: number, lastBaseColor: string | null = null) {
  const baseColor = generateRandomColor();
  const differentIndex = Math.floor(Math.random() * total);
  
  const colors = Array(total).fill('').map((_, index) => {
    if (index === differentIndex) {
      return adjustColor(baseColor, difficultyFactor);
    }
    return baseColor;
  });

  return { colors, differentIndex, baseColor };
}
