export class Score {
  constructor(
    public id: string,
    public userId: string,
    public gameId: string,
    public points: number,
    public nationality: string
  ) {}
}
