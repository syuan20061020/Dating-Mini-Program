// EXPORTS: IAppointment, MENU_ITEMS

export interface IAppointment {
  date: string;
  time: string;
  menu: {
    id: number;
    name: string;
    desc: string;
    emoji: string;
  } | null;
}

export const MENU_ITEMS = [
  { id: 1, name: '火锅', desc: '热气腾腾共享美味', emoji: '🍲' },
  { id: 2, name: '烤肉', desc: '滋滋作响肉食自由', emoji: '🥩' },
  { id: 3, name: '日料寿司', desc: '精致新鲜仪式感', emoji: '🍣' },
  { id: 4, name: '西餐牛排', desc: '浪漫优雅氛围', emoji: '🥂' },
  { id: 5, name: '韩式料理', desc: '部队锅炸鸡啤酒', emoji: '🍗' },
  { id: 6, name: '泰餐', desc: '酸辣开胃异域风情', emoji: '🍜' },
  { id: 7, name: '烤鱼', desc: '鲜香入味下饭神器', emoji: '🐟' },
  { id: 8, name: '甜品下午茶', desc: '轻松甜蜜不尴尬', emoji: '🍰' },
  { id: 9, name: '串串香', desc: '丰富选择热辣过瘾', emoji: '🍢' },
];
