/**
 * Utility Functions - Common helper functions across the application
 */

export class StringUtils {
  static capitalize(str: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  }

  static truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export class DateUtils {
  static formatDate(date: Date, format: string = 'MM/DD/YYYY'): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString());
  }

  static isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  static getDaysDifference(date1: Date, date2: Date): number {
    const time = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(time / (1000 * 60 * 60 * 24));
  }
}

export class ArrayUtils {
  static unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  static groupBy<T>(array: T[], key: keyof T): Map<T[keyof T], T[]> {
    const map = new Map();
    array.forEach(item => {
      const value = item[key];
      if (!map.has(value)) {
        map.set(value, []);
      }
      map.get(value).push(item);
    });
    return map;
  }

  static chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
