export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    dateOfBirth: string;
    gender: string;
    phone?: string;
    createdAt: Date;
    loginMethod: 'email' | 'google' | 'facebook';
    isActive: boolean;
    role: 'user' | 'admin';
}