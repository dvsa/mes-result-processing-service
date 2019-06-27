import { hrtime } from 'process';

export function timed(metricName: string, metricDescription: string) {
  return function (target: Object, methodName: string, propertyDesciptor: PropertyDescriptor) {
    const originalMethod = propertyDesciptor.value;
    propertyDesciptor.value = async function (...args: any[]) {
      const startTime = hrtime();

      const result = await originalMethod.apply(this, args);

      const timeTaken = hrtime(startTime);
      const metricReport = {
        service: 'result-processing-service',
        name: metricName,
        description: metricDescription,
        value: hrTimeAsMs(timeTaken),
      };
      console.log(JSON.stringify(metricReport));

      return result;
    };
  };
}

const hrTimeAsMs = ([seconds, nanoseconds]: number[]) => {
  return seconds * 1000 + nanoseconds / 1e6;
};
