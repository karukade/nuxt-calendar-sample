import { UserInfo } from '~/plugins/fireBaseHandler'

export interface S {
  user: UserInfo | null
}

export interface G {
  isAuthenticated: boolean
  userId: string | null
}

export interface RG {
  'user/isAuthenticated': G['isAuthenticated']
  'user/userId': G['userId']
}

export interface M {
  setUser: UserInfo | null
  clearUser: null
}

export interface RM {
  'user/setUser': M['setUser']
  'user/clearUser': M['clearUser']
}

export interface A {
  signOut: null
}

export interface RA {
  'user/signOut': A['signOut']
}
