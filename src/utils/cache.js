import moment from "moment";

export const PREFIX = "cache_"

const store = (key, value) =>  {
          try  {
                    const data = JSON.stringify({
                              value,
                              timestamp: Date.now()
                    })
                    localStorage.setItem(`${PREFIX}${key}`, data)
          } catch (error) {
                    throw error
          }
}

const get = (key, cacheExpiresHours = 5) => {
          try  {
                    const value = localStorage.getItem(`${PREFIX}${key}`)
                    const item = JSON.parse(value)
                    if(!item) return null
                    // if(isExpires(item, cacheExpiresHours)) {
                    //           await AsyncStorage.removeItem(`${PREFIX}${key}`)
                    //           return null
                    // }
                    return item.value
          } catch (error) {
                    throw error
          }
}

const isExpires = (item, cacheExpiresHours) => {
          const now = moment(Date.now())
          const storedTime = moment(item.timestamp)
          return now.diff(storedTime, 'hours') > cacheExpiresHours
}

export default  {
          store,
          get
}