import dotenv from 'dotenv'
dotenv.config()

export const delay = (ms: number) => new Promise<void>(
  (res) => setTimeout(() => res(), ms)
)

export const getCreds = () => {
  return {
    url: process.env.URL,
    name: process.env.NAME,
    n: process.env.N
  }
}