import { promises as fs } from 'fs'
import path from 'path'
import { join } from 'path'
import { getDirectoryFiles } from './get-directory-files'

export async function cleanTemp(): Promise<void> {
    const temp = join(
        __dirname,
        process.env.UPLOAD_PATH_TEMP
            ? `../public/${process.env.UPLOAD_PATH_TEMP}`
            : '../public/temp'
    )
    try {
        const files = await getDirectoryFiles(temp);
        await Promise.allSettled(files.map((file) => fs.unlink(file)));
        return Promise.resolve()
    } catch (err) {
        return Promise.reject(err)
    }
}
