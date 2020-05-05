import { firestore } from 'firebase'
import { toNonReactive } from '@/plugins/utils'
import { db } from '@/plugins/fireBaseHandler/init'

// types
import { ScheduleObj } from '@/plugins/schedule'

type Action = 'read' | 'write' | 'both'

const storeIncrement = firestore.FieldValue.increment
let unsubscribe!: () => void
let currentYear: number | null = null

type IncReadWrite = {
  (userId: string, action: Action, useBatch: boolean): firestore.WriteBatch
  (userId: string, action: Action): Promise<void>
}

const incReadWrite: IncReadWrite = (
  userId: string,
  action: Action,
  useBatch?: boolean
): any => {
  const ref = db.doc(`users/${userId}`)
  const data = getReadWriteObj(action)

  if (useBatch) {
    const batch = db.batch()
    batch.update(ref, data)
    return batch
  }
  return ref.update(data)
}

const getReadWriteObj = (action: Action) => {
  const res: {
    read?: firestore.FieldValue
    write?: firestore.FieldValue
  } = {}
  if (action === 'both') {
    res.read = storeIncrement(1)
    res.write = storeIncrement(1)
  } else {
    res[action] = storeIncrement(1)
  }
  return res
}

export const addSchedule = (userId: string, schedule: ScheduleObj) => {
  incReadWrite(userId, 'both').catch((e) => {
    throw new Error(e)
  })
  return db.collection(`users/${userId}/schedule`).add(schedule)
}

export const deleteSchedule = (userId: string, id: string): Promise<void> => {
  const batch = incReadWrite(userId, 'both', true)
  batch.delete(db.doc(`users/${userId}/schedule/${id}`))
  return batch.commit()
}

export const updateSchedule = (
  userId: string,
  id: string,
  schedule: ScheduleObj
) => {
  const batch = incReadWrite(userId, 'both', true)
  batch.update(db.doc(`users/${userId}/schedule/${id}`), schedule)
  return batch.commit()
}

export const setReadWriteCounter = async (userId?: string) => {
  if (!userId) return
  const data = await db
    .doc(`users/${userId}`)
    .get()
    .catch((e: firestore.FirestoreError) => {
      // この関数の呼び出し元でエラーハンドリングする
      throw new Error(e.code)
    })
  if (!data || data.exists) return
  await db.doc(`users/${userId}`).set({ read: 0, write: 0 })
}

export const subscribeSchedule = (
  { userId, years }: { userId: string; years: number },
  callback: (schedules: ScheduleObj[]) => any,
  onErr: (err: Error) => void
): void => {
  if (years === currentYear) return
  currentYear = years
  incReadWrite(userId, 'read')
  unsubscribe && unsubscribe()

  unsubscribe = db
    .collection(`users/${userId}/schedule`)
    .where(`range.years`, 'array-contains', currentYear)
    .onSnapshot((querySnapshot) => {
      const schedules: ScheduleObj[] = []
      querySnapshot.forEach((doc) => {
        const { id } = doc
        const data = toNonReactive(doc.data() as ScheduleObj)
        data.info.id = id
        schedules.push(data)
      })
      callback(schedules)
    }, onErr)
}

export const unsubscribeSchedule = (): void => {
  currentYear = null
  unsubscribe && unsubscribe()
}

export const storeHandler = {
  addSchedule,
  deleteSchedule,
  subscribeSchedule,
  updateSchedule,
  unsubscribeSchedule,
  setReadWriteCounter
}
