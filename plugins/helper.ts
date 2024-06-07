import moment from 'moment-timezone';
import { useNuxtApp } from '#imports';
import { GlobalEventType } from '~/types/events';
import { NotificationType } from '~/types/general';

/**
 *	@name dateTimeFormatter
 *	@summary Formats DateTime to MM/DD/YYYY hh:mm AM/PM
 *	@description Returns the formatted date time
 *	@param {string} date Date to be formatted
 *	@returns string
 **/
const dateTimeFormatter = (date: string = ''): string => {
  if (date) {
    const currentDate = new Date(date);

    // check if currentDate is a valid date. If it is a valid date - Format it.
    if (!isNaN(currentDate.getTime())) {
      return `${
        currentDate.getMonth() + 1
      }/${currentDate.getDate()}/${currentDate
        .getFullYear()
        .toString()
        .slice(-2)} ${currentDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })}`;
    }
    return '-';
  }
  return '-';
};

/**
 *	@name dateFormatter
 *	@summary Formats Date to MM/DD/YYYY
 *	@description Returns the formatted date
 *	@param {string} date Date to be formatted
 *	@returns string
 **/
const dateFormatter = (date: string = ''): string => {
  if (date.length > 0) return new Date(date).toLocaleDateString();
  return '-';
};

/**
 *	@name copyToClipboard
 *	@summary copy to clipboard
 *	@description copies value to clipboard
 *	@param {string} value value to be copied
 *	@returns {boolean} Promise<boolean>
 **/
const copyToClipboard = async (value: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(value);

    const { $bus } = useNuxtApp();
    $bus.emit(GlobalEventType.notification, {
      color: NotificationType.success,
      text: 'Copied to clipboard!',
    });
    return true;
  } catch (e) {
    return false;
  }
};

/**
 *	@name filterSpecialChars
 *	@summary replace all special characters with "_"
 *	@description  replace all special characters with an underscore "_"
 *	@param {string} str string to be filtered
 *	@returns {string}
 **/
const filterSpecialChars = (str: string) => {
  return str
    .replace(/[^\w\s]|_/g, '_')
    .replace(/\s+/g, '_')
    .toLowerCase();
};

/**
 * @name differenceInDays
 * @param {string} utcDateTimeString - The UTC date-time string in "YYYY-MM-DDTHH:mm" format.
 * @returns {number} The difference in days from January 1, 2000 to the specified date-time.
 */
const differenceInDays = (utcDateTimeString: string): number => {
  const date1 = new Date(2000, 0, 1);
  const date2 = new Date(utcDateTimeString);
  // To calculate the time difference of two dates
  const differenceInTime = date2.getTime() - date1.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.floor(differenceInDays);
};

/**
 * Get the date in string format based on the number of days elapsed since January 1, 2000.
 *
 * @param {number} days - The number of days elapsed since January 1, 2000.
 * @returns {string} The date in string format.
 */
const getDateFromDays = (days: number = 0): string => {
  let startDate = new Date(2000, 0, 1);
  startDate.setDate(startDate.getDate() + days);
  return startDate.toLocaleDateString();
};

/**
 * Get the localized date string based on the number of days elapsed since January 1, 2000 and the specified time zone.
 *
 * @param {number} days - The number of days elapsed since January 1, 2000.
 * @param {string} timeZone - The desired time zone.
 * @returns {string} The localized date string.
 */
const getLocaleDateStringfromDays = (
  days: number,
  targetTimeZone: string = 'America/Los_Angeles'
): string => {
  const date = getDateFromDays(days);
  const newDate = new Date(date);

  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: targetTimeZone,
  });
  return formatter.format(newDate);
};

/**
 * Get the ISO date string based on the number of days elapsed since January 1, 2000.
 *
 * @param {number} days - The number of days elapsed since January 1, 2000.
 * @returns {string|null} The ISO date string, or null if the input is not a number or results in an invalid date.
 */
const getIsoDateFromDays = (days: number): string | null => {
  if (isNaN(days)) {
    // Handle non-numeric input
    return null;
  }

  let isoStartDate = new Date(2000, 0, 1);
  isoStartDate.setDate(isoStartDate.getDate() + days);

  if (isNaN(isoStartDate.getTime())) {
    // Handle out-of-range input
    return null;
  }

  // Return the ISO date string directly
  return isoStartDate.toISOString();
};

/**
 * Converts military time to regular time with AM/PM notation.
 * @param {number} inputTime - The input military time in 24-hour format (e.g., 1430 for 2:30 PM).
 * @returns {string} The converted regular time with AM/PM notation (e.g., "2:30 PM").
 */
const militaryToRegularTime = (inputTime: number): string => {
  const hour = Math.floor(inputTime / 100);
  const minute = inputTime % 100;

  const period = hour >= 12 ? 'PM' : 'AM';
  const regularHour = hour % 12 || 12;

  const regularTimeFormatted = `${regularHour}:${String(
    minute
  ).padStart(2, '0')} ${period}`;

  return regularTimeFormatted;
};

/**
 * Converts military time to regular time in a different timezone.
 * @param {number} inputTime - The input military time in 24-hour format (e.g., 1430 for 2:30 PM).
 * @param {string} targetTimeZone - The target timezone in IANA timezone format (e.g., "America/New_York").
 * @returns {string} The converted regular time in the format "hh:mm AM/PM" (e.g., "02:30 PM").
 */
const militaryToRegularTimeWithTimeZone = (
  inputTime: number = 0,
  targetTimeZone: string = 'America/Los_Angeles'
): string => {
  const sourceHour = Math.floor(inputTime / 100);
  const sourceMinute = inputTime % 100;

  // Create a sourceTime Date object in UTC
  const sourceTime = new Date();
  sourceTime.setUTCHours(sourceHour, sourceMinute, 0, 0);

  // Use moment-timezone to convert the sourceTime to the targetTimeZone
  const targetMoment = moment(sourceTime).tz(targetTimeZone);

  // Format the targetTime in the desired format
  const targetTimeFormatted = targetMoment.format('hh:mm A');

  return targetTimeFormatted;
};

/**
 * Converts a local date and time to UTC time.
 * @param {string} datetimeLocal - The local date and time string in "YYYY-MM-DDTHH:mm" format.
 * @returns {string} The UTC date and time in "YYYY-MM-DDTHH:mm" format.
 */
function convertToUTC(datetimeLocal: string): string {
  // Parse the local time string using moment
  const localMoment = moment(datetimeLocal, 'YYYY-MM-DDTHH:mm');

  // Convert to UTC moment and format in ISO string format
  const utcMoment = localMoment.utc();
  const utcTime = utcMoment.format('YYYY-MM-DDTHH:mm');

  return utcTime;
}

/**
 * Converts a UTC time to the specified target time zone.
 * @param {string} utcTimeString - The UTC time string in "YYYY-MM-DDTHH:mm:ss.SSSZ" format.
 * @param {string} targetTimeZone - The target time zone in the IANA time zone format (e.g., "America/New_York").
 * @returns {string} The date and time in the target time zone, formatted as "YYYY-MM-DDTHH:mm:ss.SSSZ".
 */
function utcTimeToTimezone(
  utcTimeString: string = '',
  targetTimeZone: string = 'Etc/UTC'
): string | null {
  if (utcTimeString?.length === 0) {
    return null;
  }

  // Parse the UTC time string using moment
  const utcMoment = moment.utc(utcTimeString);

  // Convert to the target time zone moment
  const targetMoment = utcMoment.tz(targetTimeZone);

  // Check if the time is between 5:00 PM and 5:59 PM in the target time zone
  if (
    targetMoment.hour() === 17 &&
    targetMoment.minute() >= 0 &&
    targetMoment.minute() <= 59
  ) {
    targetMoment.add(1, 'day'); // Add 1 day if time is between 5-5:59 PM
  }

  // Format datetime
  const targetDateTime = targetMoment.format('YYYY-MM-DDTHH:mm');

  return targetDateTime;
}

/**
 * Converts a day and time to a local date string in ISO format with the target time zone.
 * @param {number} day - The day count since January 1, 2000.
 * @param {number} militaryTime - The time in military format (e.g., 900 for 9:00 AM).
 * @param {string} targetTimeZone - The target time zone in IANA time zone format (e.g., "America/New_York").
 * @returns {string} The local date string in ISO format (e.g., "2023-07-23T14:30:00").
 */
const convertDayAndTimeToTargetTimeZone = (
  day = 0,
  militaryTime = 0,
  targetTimeZone = 'America/Los_Angeles'
): string | null => {
  // if day is null or equal to 0, return null
  if (day === null || day === 0) {
    return null;
  }

  const startDate = getDateFromDays(day);

  // Extract year, month, and day from the startDate string
  const [month, dayOfMonth, year] = startDate.split('/').map(Number);

  // Convert military time to hours and minutes
  const hours = Math.floor(militaryTime / 100);
  const minutes = militaryTime % 100;

  // Create a new Date object using the extracted year, month, day, hours, and minutes
  const localTime = new Date(
    year,
    month - 1,
    dayOfMonth,
    hours,
    minutes
  );

  // Use moment-timezone to convert the localTime to the targetTimeZone
  const targetMoment = moment.tz(localTime, targetTimeZone);

  // Format the target time in "datetime-local" format
  const targetDateTimeLocal = targetMoment.format('YYYY-MM-DDTHH:mm');

  return targetDateTimeLocal;
};

/**
 * Converts a given date string to an object containing the day and time parts.
 *
 * @param {string} [date=''] - The input date string in a valid format. Defaults to an empty string.
 * @returns {{ day: number; time: number }} An object with the day and time parts extracted from the input date string. If the input is empty or invalid, day and time default to 0.
 */
const dateStringToDayAndTime = (
  date: string = ''
): { day: number; time: number } => {
  if (date === '' || date === 'Invalid date') {
    console.log(
      'Input date is an empty string. Defaulting to day: 0, time: 0'
    );
    return { day: 0, time: 0 }; // Return default values for empty input.
  }

  const dateTime = new Date(date).toISOString().slice(0, 16);
  const day = differenceInDays(dateTime);
  const time = +dateTime.split('T')[1].split(':').join('');

  return { day, time };
};

/**
 * Checks if a given date object is valid.
 * @param {Date} date The date object to validate.
 * @returns {boolean} Returns true if the date object is valid, otherwise returns false.
 */
const isValidDate = (date: Date | null): boolean => {
  if (date === null) {
    return false; // If date is null, it's not a valid date
  }
  return !isNaN(date.getTime()); // Check if the date object represents a valid date
};

/**
 * Converts local time in "HH:mm A" format to the specified target timezone.
 * @param localTime - The local time in "HH:mm A" format (e.g., "05:00 PM").
 * @param targetTimeZone - The target timezone in IANA timezone format (e.g., "America/New_York").
 * @returns The converted time as a number (e.g., 1700).
 *          Returns null if localTime is falsy.
 */
const localTimeToTargetTimezone = (
  localTime: string | null | undefined,
  targetTimeZone: string = 'Etc/UTC'
): number | null => {
  try {
    return localTime
      ? parseInt(
          moment(localTime, 'hh:mm A')
            .tz(targetTimeZone)
            .format('HHmm')
        )
      : null;
  } catch (error) {
    return null;
  }
};

/**
 * Converts local time in "HH:mm A" format to a number representation.
 * @param localTime - The local time in "HH:mm A" format (e.g., "05:00 PM").
 * @returns The converted time as a number (e.g., 1700).
 *          Returns null if localTime is falsy.
 */
const localTimeToNumber = (
  localTime: string | null | undefined
): number | null => {
  try {
    return localTime
      ? parseInt(moment(localTime, 'hh:mm A').format('HHmm'))
      : null;
  } catch (error) {
    return null;
  }
};

/**
 * Validates an object against a set of required keys, ensuring that each key exists
 * and has a valid value of the correct type.
 * @param obj - The object to validate.
 * @param requiredKeys - An array of required keys that must exist in the object.
 * @returns True if the object is valid, false otherwise.
 */
function validateObject(
  obj: Record<string, any>,
  requiredKeys: string[]
): boolean {
  /**
   * Check if the object is valid.
   */
  let isValid = true;

  for (const key of requiredKeys) {
    if (!(key in obj)) {
      console.error(
        `Required key '${key}' is missing in the object.`
      );
      isValid = false;
      break;
    }

    // Validate value based on its data type
    const value = obj[key];
    if (typeof value === 'string' && value.trim() === '') {
      console.error(`Value for key '${key}' is an empty string.`);
      isValid = false;
      break;
    }
    if (typeof value === 'number' && isNaN(value)) {
      console.error(`Value for key '${key}' is not a valid number.`);
      isValid = false;
      break;
    }
    if (Array.isArray(value) && value.length === 0) {
      console.error(`Value for key '${key}' is an empty array.`);
      isValid = false;
      break;
    }
    // Add more type-specific validation checks as needed
  }

  return isValid;
}

/**
 * Converts time in 24-hour format (e.g., 1300) from UTC to the local timezone in "hh:mm A" format.
 * The local timezone is automatically detected.
 * @param utcTime - The time in 24-hour format in UTC (e.g., 1300).
 * @returns The converted time in "hh:mm A" format.
 *          Returns null if utcTime is falsy.
 */
const utcTimeToLocalTime = (utcTime: number): string | null => {
  try {
    if (!utcTime && utcTime !== 0) return null;
    const paddedUtcTime = utcTime.toString().padStart(4, '0'); // Ensure UTC time has 4 digits
    const localTimeZone = moment.tz.guess();
    const localTime = moment
      .utc(paddedUtcTime, 'HHmm')
      .tz(localTimeZone);
    return localTime.format('hh:mm A');
  } catch (error) {
    return null;
  }
};

/**
 * Parse a date and time string in "MM/DD/YYYY" and "hh:mm A" formats and return a combined UTC date-time string.
 * @param {string} dateString - The date string in "MM/DD/YYYY" format.
 * @param {string} timeString - The time string in "hh:mm A" format.
 * @returns {string} The combined UTC date-time string in "YYYY-MM-DDTHH:mm" format.
 */
const convertToDateTimeUTC = (
  dateString = '',
  timeString: string | null = ''
): string | null => {
  // Check if either dateString or timeString is an empty string
  if (!dateString || !timeString) return null;

  // Parse date and time strings
  const [month, day, year] = dateString.split('/');
  const [time, meridiem] = timeString.split(' ');
  const [hour, minute] = time.split(':');

  // Create a new Date object with combined date and time
  const combinedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    meridiem === 'PM' ? Number(hour) + 12 : Number(hour),
    Number(minute)
  );

  // Get UTC date-time string in "YYYY-MM-DDTHH:mm" format
  const utcDateTimeString = combinedDate.toISOString().slice(0, 16);

  return utcDateTimeString;
};

/**
 * Get the date in string format based on the number of UTC days elapsed since January 1, 2000, considering the time of day.
 * @param {number} days - The number of days elapsed since January 1, 2000 (UTC days).
 * @param {string} [timeOfDay] - The time of day in "HH:mm A" format. Defaults to "00:00 AM" if not provided.
 * @returns {string} The date in string format.
 */
const getDateFromUtcDaysWithTime = (
  days: number = 0,
  timeOfDay: string | null = '00:00 AM'
): string => {
  if (timeOfDay === null || timeOfDay.trim() === '') {
    timeOfDay = '00:00 AM'; // Default value if timeOfDay is null or empty
  }

  let startDate = new Date(2000, 0, 1);
  startDate.setDate(startDate.getDate() + days);

  const [hours, minutes, meridiem] = timeOfDay.split(/:|\s/); // Splitting timeOfDay into hours, minutes, and meridiem

  // Adjusting hours based on meridiem
  let adjustedHours = parseInt(hours);
  if (meridiem === 'PM' && adjustedHours < 12) {
    adjustedHours += 12;
  } else if (meridiem === 'AM' && adjustedHours === 12) {
    adjustedHours = 0;
  }

  startDate.setHours(adjustedHours, parseInt(minutes));

  // Format the date to MM/DD/YYYY
  const formattedDate = startDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formattedDate;
};

export default defineNuxtPlugin((ctx) => {
  ctx.$dt = dateTimeFormatter;
  ctx.$df = dateFormatter;
  ctx.$copy = copyToClipboard;
  ctx.$differenceInDays = differenceInDays;
  ctx.$getDateFromDays = getDateFromDays;
  ctx.$getIsoDateFromDays = getIsoDateFromDays;
  ctx.$getLocaleDateStringfromDays = getLocaleDateStringfromDays;
  ctx.$militaryToRegularTime = militaryToRegularTime;
  ctx.$militaryToRegularTimeWithTimeZone =
    militaryToRegularTimeWithTimeZone;
  ctx.$convertToUTC = convertToUTC;
  ctx.$utcTimeToTimezone = utcTimeToTimezone;
  ctx.$convertDayAndTimeToTargetTimeZone =
    convertDayAndTimeToTargetTimeZone;
  ctx.$dateStringToDayAndTime = dateStringToDayAndTime;
  ctx.$isValidDate = isValidDate;
  ctx.$localTimeToTargetTimezone = localTimeToTargetTimezone;
  ctx.$localTimeToNumber = localTimeToNumber;
  ctx.$validateObject = validateObject;
  ctx.$utcTimeToLocalTime = utcTimeToLocalTime;
  ctx.$getDateFromUtcDaysWithTime = getDateFromUtcDaysWithTime;
  ctx.$convertToDateTimeUTC = convertToDateTimeUTC;

  ctx.$fsc = filterSpecialChars;
});
