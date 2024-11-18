import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  /**
   * Generates a filter predicate function for filtering an array of objects based on specified properties.
   * @param properties - An array of object keys to compare against the filter string.
   * @returns A predicate function that takes an object and a filter string and returns a boolean.
   */
  generateFilterPredicate<T>(properties: (keyof T)[]): (data: T, filter: string) => boolean {
    return (data: T, filter: string): boolean => {
      // Normalize the filter string for case-insensitive comparison.
      const normalizedFilter = filter.toLowerCase();

      // Check if any of the specified properties contain the filter string.
      return properties.some(prop => {
        const value = data[prop];
        return value && value.toString().toLowerCase().includes(normalizedFilter)
      })
    }
  }
}
