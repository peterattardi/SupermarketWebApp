
export class AccountInfo {

  constructor(
    public email: string,
    private _appUserRole: string,
    public firstName?: string,
    public lastName?: string,
    public locked?: boolean,
    public enabled?: boolean,
    public address?: string,
    public cap?: string,
    public city?: string,
    public supermarketName?: string) {}

  get appUserRole(): string {
    return this._appUserRole;
  }

}

