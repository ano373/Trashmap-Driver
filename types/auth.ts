export interface AuthRequest {
    email: string;
    password: string;
}
  
export interface AuthSuccessResponse {
    message: string;
    data: {
        jwt: string;
    };
}
  