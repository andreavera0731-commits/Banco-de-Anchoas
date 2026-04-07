export interface UserInfo {
  id: string
  email: string
  name: string
  role: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}
