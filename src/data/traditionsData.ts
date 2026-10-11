export interface TraditionPerson {
  number: number;
  name: string;
}

export type TraditionKey =
  | 'roses'
  | 'wishes'
  | 'makeups'
  | 'chocolates'
  | 'blueBills'
  | 'candles'
  | 'gifts'
  | 'miniCakes';

export interface TraditionCategory {
  id: TraditionKey;
  label: string;
  symbol: string;
  itemType: string;
  list: TraditionPerson[];
}

export const TRADITIONS_DATA: Record<TraditionKey, TraditionCategory> = {
  roses: {
    id: 'roses',
    label: '7 ROSES',
    symbol: '🌹',
    itemType: 'Rose',
    list: [
      { number: 1, name: 'Lolo Melencio' },
      { number: 2, name: 'Papa Nog' },
      { number: 3, name: 'Tito Emmel' },
      { number: 4, name: 'Tito Bernard' },
      { number: 5, name: 'Kuya MC' },
      { number: 6, name: 'Kuya Sky' },
      { number: 7, name: 'Daddy Jun' },
    ],
  },
  wishes: {
    id: 'wishes',
    label: '7 WISHES',
    symbol: '🪄',
    itemType: 'Wish',
    list: [
      { number: 1, name: 'Mama Endang' },
      { number: 2, name: 'Tita Liit' },
      { number: 3, name: 'Tita Melody' },
      { number: 4, name: 'Tita Sarah' },
      { number: 5, name: 'Lola Lengget' },
      { number: 6, name: 'Lola Lolita' },
      { number: 7, name: 'Nanay Santa' },
    ],
  },
  makeups: {
    id: 'makeups',
    label: '7 MAKE UP',
    symbol: '💄',
    itemType: 'Make Up',
    list: [
      { number: 1, name: 'Ate Princess' },
      { number: 2, name: 'Ate Chloe' },
      { number: 3, name: 'Yannah' },
      { number: 4, name: 'Ate Kia' },
      { number: 5, name: 'Ate Che' },
      { number: 6, name: 'Ate Chiel' },
      { number: 7, name: 'Ate Jannah' },
    ],
  },
  chocolates: {
    id: 'chocolates',
    label: '7 CHOCOLATES',
    symbol: '🍫',
    itemType: 'Chocolate',
    list: [
      { number: 1, name: 'Kuya Abiezer' },
      { number: 2, name: 'Kuya Craig' },
      { number: 3, name: 'Hezekiah' },
      { number: 4, name: 'Ate Kaykay' },
      { number: 5, name: 'Kuya Jayrell' },
      { number: 6, name: 'Ate Zhayrish' },
      { number: 7, name: 'Ate Tirzah' },
    ],
  },
  blueBills: {
    id: 'blueBills',
    label: '7 BLUE BILLS',
    symbol: '💵',
    itemType: 'Blue Bill',
    list: [
      { number: 1, name: 'Ninong Jed' },
      { number: 2, name: 'Ninong Mher' },
      { number: 3, name: 'Ninong Sherman' },
      { number: 4, name: 'Ninong Aike' },
      { number: 5, name: 'Ninong Uya' },
      { number: 6, name: 'Ninong Paul' },
      { number: 7, name: 'Ninong Richard' },
    ],
  },
  candles: {
    id: 'candles',
    label: '7 CANDLES',
    symbol: '🕯️',
    itemType: 'Candle',
    list: [
      { number: 1, name: 'Ninang Melannie' },
      { number: 2, name: 'Ninang Regine' },
      { number: 3, name: 'Ninang Camille' },
      { number: 4, name: 'Ninang Sabel' },
      { number: 5, name: 'Ninang Marlyn' },
      { number: 6, name: 'Ninang Rona' },
      { number: 7, name: 'Tita Ninang Mae' },
    ],
  },
  gifts: {
    id: 'gifts',
    label: '7 GIFTS',
    symbol: '🎁',
    itemType: 'Gift',
    list: [
      { number: 1, name: 'Ninang Jacqueline Oraya' },
      { number: 2, name: 'Ninang Mhira' },
      { number: 3, name: 'Ninong Angelo' },
      { number: 4, name: 'Ninang Janette' },
      { number: 5, name: 'Tita Ganda' },
      { number: 6, name: 'Tito Harley' },
      { number: 7, name: 'Tito Kenneth' },
    ],
  },
  miniCakes: {
    id: 'miniCakes',
    label: '7 MINI CAKES',
    symbol: '🧁',
    itemType: 'Mini Cake',
    list: [
      { number: 1, name: 'Ninong Dongke' },
      { number: 2, name: 'Ninong Tinoy' },
      { number: 3, name: 'Ninang Jacky Rodriguez' },
      { number: 4, name: 'Ninang Sha' },
      { number: 5, name: 'Ninong Peter' },
      { number: 6, name: 'Ninong Reschian' },
      { number: 7, name: 'Ninong Lee' },
    ],
  },
};
