import { auth, firebaseApp } from '@/plugins/fireBaseHandler/init'

export type UserInfo = {
  name: string | null
  id: string
  picture: string | null
  email: string | null
}

export type ProvidersName = 'Google' | 'Facebook' | 'Github' | 'TestUser'

const testUser = {
  email: 'testuser@test.com',
  pass: 'testuser'
}

const stateChangeListeners = {
  signIn: [] as ((arg: UserInfo) => any)[],
  signOut: [] as (() => any)[]
}

const extractUserInfo = (result: firebase.User): UserInfo => {
  const { uid, displayName, photoURL, email } = result
  return {
    name: displayName,
    id: uid,
    picture: photoURL,
    email
  }
}

const onSignInErr = (error: firebase.auth.Error): firebase.auth.Error => {
  const errorCode = error.code
  // 同じメールアドレスで別プロバイダーを利用していた場合
  if (errorCode === 'auth/account-exists-with-different-credential') {
    alert('すでに別のアカウントで同じメールアドレスを使用しているようです。　')
  } else if (
    errorCode !== 'auth/user-cancelled' &&
    errorCode !== 'auth/popup-closed-by-user'
  ) {
    // キャンセル以外のエラー
    console.error(errorCode)
  }
  return error
}

export const authStateChanged = (): Promise<UserInfo | null> => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(
      (user) => {
        resolve(user ? extractUserInfo(user) : null)
      },
      (err) => reject(err)
    )
  })
}

export const addStateChangeListener = (
  event: keyof typeof stateChangeListeners,
  handler: (userInfo?: UserInfo) => any
) => {
  if (!stateChangeListeners[event]) return
  stateChangeListeners[event].push(handler)
}

const getProvider = (name: Exclude<ProvidersName, 'TestUser'>) => {
  const { auth } = firebaseApp
  const providerData = {
    Google: {
      Constructor: auth.GoogleAuthProvider
    },
    Facebook: {
      Constructor: auth.FacebookAuthProvider
    },
    Github: {
      Constructor: auth.GithubAuthProvider
    }
  }[name]
  const provider = new providerData.Constructor()
  // if (providerData.scope) provider.addScope(providerData.scope)
  return provider
}

export const signIn = async (name: ProvidersName) => {
  if (auth.currentUser) return
  if (name === 'TestUser') {
    const { email, pass } = testUser
    return await auth.signInWithEmailAndPassword(email, pass).catch((e) => {
      throw new Error(e)
    })
  }
  const provider = getProvider(name)
  return await auth
    .signInWithPopup(provider)
    .catch((e: firebase.auth.Error) => onSignInErr(e))
}

export const signOut = async () => {
  await auth.signOut()
}
