export function getNameInitials(name: string) {
    return name.split('').filter(x => /[А-ЯA-Z]/.test(x)).filter((_, i, a) => i == 0 || i == a.length - 1).join('')
} 