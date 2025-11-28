import updateData from "./updateData.js"
import { PREFIX } from "./cache"

export default async function updateAllCachedData () {
          try {
                    const allKeys = Object.entries(localStorage)
                    const cachedKeys = allKeys.filter(keyValue => {
                              const key = keyValue[0]
                              return key.startsWith(PREFIX)
                    })
                    if(cachedKeys.length > 0) {
                              await Promise.all(cachedKeys.map(keyValue => {
                                        const key = keyValue[0]
                                        updateData(key)
                              }))
                    }
          } catch (error) {
                    console.log(error)
          }
}