import 'vuex'

declare module 'vuex' {
  // ______________________________________________________
  //
  type Getters<S, G> = {
    [K in keyof G]: (
      state: S,
      getters: G,
      rootState: RootState,
      rootGetters: RootGetters
    ) => G[K]
  }
  // ______________________________________________________
  //
  type Mutations<S, M> = {
    [K in keyof M]: (this: ExStore, state: S, payload: M[K]) => void
  }
  // ______________________________________________________
  //
  type ExCommit<M> = <T extends keyof M, RK extends keyof RootMutations>(
    type: T | RK,
    payload?: M[T] | RootMutations[RK],
    options?: CommitOptions
  ) => void
  type ExDispatch<A> = <T extends keyof A, RK extends keyof RootActions>(
    type: T | RK,
    payload?: A[T] | RootActions[RK],
    options?: DispatchOptions
  ) => any
  type ExActionContext<S, A, G, M> = {
    commit: ExCommit<M>
    dispatch: ExDispatch<A>
    state: S
    getters: G
    rootState: RootState
    rootGetters: RootGetters
  }
  type Actions<S, A, G = {}, M = {}> = {
    [K in keyof A]: (
      this: ExStore,
      ctx: ExActionContext<S, A, G, M>,
      payload: A[K]
    ) => any
  }
  // ______________________________________________________
  //
  interface ExStore extends Store<RootState> {
    getters: RootGetters
    commit: ExCommit<RootMutations>
    dispatch: ExDispatch<RootActions>
  }
  type StoreContext = ExActionContext<
    RootState,
    RootActions,
    RootGetters,
    RootMutations
  >
}
