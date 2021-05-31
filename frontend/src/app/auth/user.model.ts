
export class User {

  constructor(
    public email: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    private _role: string) {}

  get token(): string {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get role(): string {
    return this._role;
  }
}

