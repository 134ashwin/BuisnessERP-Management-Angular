/**
 * User Model/Interface
 */
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  avatar?: string;
  createdAt!: Date;
  updatedAt!: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}
