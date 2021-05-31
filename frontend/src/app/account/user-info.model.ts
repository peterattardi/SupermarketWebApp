
export class UserInfo {

  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public locked?: boolean,
    public enabled?: boolean,
    public address?: string,
    public cap?: string,
    public city?: string,
    public supermarketId?: string,
    public supermarketName?: string) {}

}

