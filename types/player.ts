// types/player.ts
export type PlayerProfile = {
  id: string; // UUID v4
  name: string; // Tên hiển thị
  avatarColor: string;
  createdAt: string; // ISO Date
  totalGames: number;
};
