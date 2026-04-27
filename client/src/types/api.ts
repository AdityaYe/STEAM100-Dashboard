export interface Game {
  appId: number;
  rank: number;
  name: string;
  publisher: string;
  avgPlaytime: number;
  medianPlaytime: number;
  ccu: number;
}

export interface GameHistoryItem {
  date: string;
  ccu: number;
  avgPlaytime: number;
  medianPlaytime: number;
}

export interface GameResponse {
  success: boolean;
  page: number;
  total: number;
  data: Game[];
}

export interface Genre {
  description: string;
}

export interface GameDetails {
  name: string;
  image: string;
  description: string;
  developers: string[];
  publishers: string[];
  genres: Genre[];
  releaseDate: string;
  requiredAge: number;
  price: string;
  steamLink: string;
}