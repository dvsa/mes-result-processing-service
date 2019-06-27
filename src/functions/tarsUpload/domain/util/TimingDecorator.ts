import { hrtime } from 'process';

export function timed() {
  return function (target: Object, methodName: string, propertyDesciptor: PropertyDescriptor) {
    const originalMethod = propertyDesciptor.value;
    propertyDesciptor.value = function (...args: any[]) {
      console.log(`decorator args are ${args}`);
      const startTime = hrtime();

      const result = originalMethod.apply(this, args);

      const timeTaken = hrtime(startTime);
      console.log(`${methodName} took ${hrTimeAsMs(timeTaken)}ms`);

      return result;
    };
  };
}

const hrTimeAsMs = ([seconds, nanoseconds]: number[]) => {
  return seconds * 1000 + nanoseconds / 1e6;
};
