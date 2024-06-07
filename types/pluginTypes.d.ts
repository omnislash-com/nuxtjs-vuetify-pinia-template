/**
 * This code extends the NuxtApp (context) interface from nuxt3. It allows you
 * to add a new property [ex. $myCustomProp] to the context, which can be used
 * to store custom data and make it accessible throughout the Nuxt application.
 * This is a type-safe way to add functionality to the Nuxt context.
 **/

import { Emitter } from 'mitt';

interface Events {
  [key: string]: unknown;
  [key: symbol]: unknown;
}

declare module '#app' {
  interface NuxtApp {
    $bus: {
      all: EventHandlerMap<Events>;
      on<Key extends keyof Events>(
        type: Key,
        handler: Handler<Events[Key]>
      ): void;
      on(type: '*', handler: WildcardHandler<Events>): void;
      off<Key extends keyof Events>(
        type: Key,
        handler?: Handler<Events[Key]>
      ): void;
      off(type: '*', handler: WildcardHandler<Events>): void;
      emit<Key extends keyof Events>(
        type: Key,
        event: Events[Key]
      ): void;
      emit<Key extends keyof Events>(
        type: undefined extends Events[Key] ? Key : never
      ): void;
    };

    // Custom Plugin Types for Helper Methods
    $dt(date: string): string;
    $df(date: string): string;
    $copy(value: string): Promise<void>;
    $differenceInDays(utcDateTimeString: string): number;
    $getDateFromDays(days?: number): string;
    $getIsoDateFromDays(days: number): string | null;
    $getLocaleDateStringfromDays(
      days: number,
      targetTimeZone?: string = 'America/Los_Angeles'
    ): string;
    $militaryToRegularTime(inputTime: number): string;
    $militaryToRegularTimeWithTimeZone(
      inputTime?: number,
      targetTimeZone?: string = 'America/Los_Angeles'
    ): string;
    $convertToUTC(datetimeLocal: string): string;
    $utcTimeToTimezone(
      utcTimeString: string,
      targetTimeZone?: string = 'Etc/UTC'
    ): string;
    $convertDayAndTimeToTargetTimeZone(
      day: number,
      militaryTime: number,
      targetTimeZone: string = 'America/Los_Angeles'
    );
    $dateStringToDayAndTime(
      date: string = ''
    ): { day: number; time: number } | null;
    $localTimeToTargetTimezone(
      date: string | null,
      targetTimeZone = 'Etc/UTC'
    ): number | null;
    $localTimeToNumber(
      localTime: string | null | undefined
    ): number | null;
    $validateObject(
      obj: Record<string, any>,
      requiredKeys: string[]
    ): boolean;
    $utcTimeToLocalTime(utcTime: number): string | null;
    $getDateFromUtcDaysWithTime(
      days: number = 0,
      timeOfDay: string | null = '00:00 AM'
    ): string;

    $convertToDateTimeUTC(
      dateString = '',
      timeString: string | null = ''
    ): string | null;
    $fsc(str: string): string;
    $isValidDate(date: Date | null): boolean;
  }
}

declare module 'nuxt/dist/app/nuxt' {
  interface NuxtApp {
    $bus: {
      all: EventHandlerMap<Events>;
      on<Key extends keyof Events>(
        type: Key,
        handler: Handler<Events[Key]>
      ): void;
      on(type: '*', handler: WildcardHandler<Events>): void;
      off<Key extends keyof Events>(
        type: Key,
        handler?: Handler<Events[Key]>
      ): void;
      off(type: '*', handler: WildcardHandler<Events>): void;
      emit<Key extends keyof Events>(
        type: Key,
        event: Events[Key]
      ): void;
      emit<Key extends keyof Events>(
        type: undefined extends Events[Key] ? Key : never
      ): void;
    };

    $dt(date: string): string;
    $df(date: string): string;
    $copy(value: string): Promise<boolean>;
    $differenceInDays(utcDateTimeString: string): number;
    $getDateFromDays(days?: number): string;
    $getIsoDateFromDays(days: number): string | null;
    $getLocaleDateStringfromDays(
      days: number,
      targetTimeZone?: string = 'America/Los_Angeles'
    ): string;
    $militaryToRegularTime(inputTime: number): string;
    $militaryToRegularTimeWithTimeZone(
      inputTime?: number,
      targetTimeZone?: string = 'America/Los_Angeles'
    ): string;
    $convertToUTC(datetimeLocal: string): string;
    $utcTimeToTimezone(
      utcTimeString: string,
      targetTimeZone?: string = 'Etc/UTC'
    ): string;
    $convertDayAndTimeToTargetTimeZone(
      day: number,
      militaryTime: number,
      targetTimeZone: string = 'America/Los_Angeles'
    );
    $dateStringToDayAndTime(date: string = ''): {
      day: number;
      time: number;
    };
    $localTimeToTargetTimezone(
      date: string | null,
      targetTimeZone = 'Etc/UTC'
    ): number | null;
    $localTimeToNumber(
      localTime: string | null | undefined
    ): number | null;
    $validateObject(
      obj: Record<string, any>,
      requiredKeys: string[]
    ): boolean;
    $utcTimeToLocalTime(utcTime: number): string | null;
    $getDateFromUtcDaysWithTime(
      days: number = 0,
      timeOfDay: string | null = '00:00 AM'
    ): string;
    $convertToDateTimeUTC(
      dateString = '',
      timeString: string | null = ''
    ): string | null;

    $fsc(str: string): string;
    $isValidDate(date: Date | null): boolean;
  }
}
