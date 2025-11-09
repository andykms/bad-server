export const isValidFilename = (filename: string): boolean => {
    if (!filename || filename.length === 0 || filename.length > 2048) {
        return false
    }
    /*
    // eslint-disable-next-line no-control-regex
    const forbiddenChars = /[<>:"|?*\\/\x00-\x1f]/
    if (forbiddenChars.test(filename)) {
        return false
    }

    const windowsReservedNames = [
        'CON',
        'PRN',
        'AUX',
        'NUL',
        'COM1',
        'COM2',
        'COM3',
        'COM4',
        'COM5',
        'COM6',
        'COM7',
        'COM8',
        'COM9',
        'LPT1',
        'LPT2',
        'LPT3',
        'LPT4',
        'LPT5',
        'LPT6',
        'LPT7',
        'LPT8',
        'LPT9',
    ]

    const nameWithoutExt = filename.split('.')[0].toUpperCase()
    if (windowsReservedNames.includes(nameWithoutExt)) {
        return false
    }

    const pathTraversalPatterns = ['..', './', '~/', '/./', '/../']

    const normalized = filename.replace(/\\/g, '/')
    if (pathTraversalPatterns.some((pattern) => normalized.includes(pattern))) {
        return false
    }

    // eslint-disable-next-line no-useless-escape
    if (/[\. ]$/.test(filename)) {
        return false
    }
*/
    return true
}
