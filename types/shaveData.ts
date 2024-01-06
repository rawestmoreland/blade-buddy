export type TShaveData = {
  lastShaveDate: Date | string | null;
  shaveCount: number;
  shaveLimit?: number;
  notificationsEnabled: boolean;
};
