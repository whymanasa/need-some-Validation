
import { redis } from './redis';

type Fetcher<T> = () => Promise<T>;

export async function getOrSetCache<T>(key: string, fetcher: Fetcher<T>, ttl: number = 3600): Promise<T> {
    try {
        const cachedData = await redis.get<T>(key);

        if (cachedData) {
            console.log(`Cache Hit for key: ${key}`);
            return cachedData;
        }
    } catch (error) {
        console.error(`Error fetching from cache for key ${key}:`, error);
    }

    console.log(`Cache Miss for key: ${key}`);
    const data = await fetcher();

    try {
        if (data) {
            await redis.set(key, data, { ex: ttl });
        }
    } catch (error) {
        console.error(`Error setting cache for key ${key}:`, error);
    }

    return data;
}
