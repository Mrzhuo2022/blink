// 色彩主题配置
export interface ThemeColors {
  shortBreak: {
    from: string;
    via: string;
    to: string;
    name: string;
  };
  longBreak: {
    from: string;
    via: string;
    to: string;
    name: string;
  };
}

export const colorThemes: Record<string, ThemeColors> = {
  // 默认主题（当前的亮色主题）
  default: {
    shortBreak: {
      from: 'from-green-400',
      via: 'via-teal-500',
      to: 'to-cyan-600',
      name: '清新绿色',
    },
    longBreak: {
      from: 'from-purple-500',
      via: 'via-indigo-600',
      to: 'to-blue-700',
      name: '深邃紫蓝',
    },
  },

  // 护眼暖色主题
  warm: {
    shortBreak: {
      from: 'from-orange-300',
      via: 'via-amber-400',
      to: 'to-yellow-500',
      name: '温暖橙黄',
    },
    longBreak: {
      from: 'from-red-400',
      via: 'via-pink-500',
      to: 'to-rose-600',
      name: '温馨粉红',
    },
  },

  // 护眼冷色主题
  cool: {
    shortBreak: {
      from: 'from-slate-400',
      via: 'via-slate-500',
      to: 'to-slate-600',
      name: '宁静灰蓝',
    },
    longBreak: {
      from: 'from-slate-600',
      via: 'via-slate-700',
      to: 'to-slate-800',
      name: '深邃灰色',
    },
  },

  // 自然主题（护眼绿色系）
  nature: {
    shortBreak: {
      from: 'from-emerald-300',
      via: 'via-green-400',
      to: 'to-teal-500',
      name: '自然绿意',
    },
    longBreak: {
      from: 'from-emerald-500',
      via: 'via-teal-600',
      to: 'to-cyan-700',
      name: '森林深绿',
    },
  },

  // 日落主题（护眼橙红色系）
  sunset: {
    shortBreak: {
      from: 'from-amber-300',
      via: 'via-orange-400',
      to: 'to-red-400',
      name: '日落余晖',
    },
    longBreak: {
      from: 'from-orange-400',
      via: 'via-red-500',
      to: 'to-pink-600',
      name: '夕阳西下',
    },
  },

  // 海洋主题（护眼蓝色系）
  ocean: {
    shortBreak: {
      from: 'from-cyan-300',
      via: 'via-blue-400',
      to: 'to-indigo-500',
      name: '海洋微波',
    },
    longBreak: {
      from: 'from-blue-500',
      via: 'via-indigo-600',
      to: 'to-purple-700',
      name: '深海宁静',
    },
  },
};

// 获取主题色彩
export const getThemeColors = (theme: string): ThemeColors => {
  return colorThemes[theme] || colorThemes.default;
};

// 生成渐变背景类名
export const getGradientClass = (theme: string, breakType: 'short' | 'long'): string => {
  const colors = getThemeColors(theme);
  const breakColors = breakType === 'short' ? colors.shortBreak : colors.longBreak;
  return `bg-gradient-to-br ${breakColors.from} ${breakColors.via} ${breakColors.to}`;
};

// 主题信息
export interface ThemeInfo {
  id: string;
  name: string;
  description: string;
  preview: {
    shortBreak: string;
    longBreak: string;
  };
}

export const themeInfos: ThemeInfo[] = [
  {
    id: 'default',
    name: '默认主题',
    description: '清新活力，适合日常使用',
    preview: {
      shortBreak: '清新绿色',
      longBreak: '深邃紫蓝',
    },
  },
  {
    id: 'warm',
    name: '温暖主题',
    description: '暖色调，营造温馨氛围',
    preview: {
      shortBreak: '温暖橙黄',
      longBreak: '温馨粉红',
    },
  },
  {
    id: 'cool',
    name: '冷静主题',
    description: '低饱和度，护眼舒适',
    preview: {
      shortBreak: '宁静灰蓝',
      longBreak: '深邃灰色',
    },
  },
  {
    id: 'nature',
    name: '自然主题',
    description: '绿色系，缓解眼部疲劳',
    preview: {
      shortBreak: '自然绿意',
      longBreak: '森林深绿',
    },
  },
  {
    id: 'sunset',
    name: '日落主题',
    description: '暖橙色调，舒缓放松',
    preview: {
      shortBreak: '日落余晖',
      longBreak: '夕阳西下',
    },
  },
  {
    id: 'ocean',
    name: '海洋主题',
    description: '蓝色系，宁静深邃',
    preview: {
      shortBreak: '海洋微波',
      longBreak: '深海宁静',
    },
  },
];
