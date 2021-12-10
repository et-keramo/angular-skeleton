import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateUtil {

  private DEFAULT_FORMAT: string = 'YYYY-MM-DD';

  public now(format?: string) {
    return moment().format(format || this.DEFAULT_FORMAT);
  }

  public format(date: string, format?: string) {
    return moment(date).format(format || this.DEFAULT_FORMAT);
  }

  public beforeDays(amount: number, format?: string) {
    return moment()
      .clone()
      .subtract(amount, 'day')
      .format(format || this.DEFAULT_FORMAT);
  }

  public afterDays(amount: number, format?: string) {
    return moment()
      .clone()
      .add(amount, 'day')
      .format(format || this.DEFAULT_FORMAT);
  }

  public beforeWeeks(amount: number, format?: string) {
    return moment()
      .clone()
      .subtract(amount, 'week')
      .format(format || this.DEFAULT_FORMAT);
  }

  public afterWeeks(amount: number, format?: string) {
    return moment()
      .clone()
      .add(amount, 'week')
      .format(format || this.DEFAULT_FORMAT);
  }

  public beforeMonths(amount: number, format?: string) {
    return moment()
      .clone()
      .subtract(amount, 'month')
      .format(format || this.DEFAULT_FORMAT);
  }

  public afterMonths(amount: number, format?: string) {
    return moment()
      .clone()
      .add(amount, 'month')
      .format(format || this.DEFAULT_FORMAT);
  }

  public beforeYears(amount: number, format?: string) {
    return moment()
      .clone()
      .subtract(amount, 'year')
      .format(format || this.DEFAULT_FORMAT);
  }

  public afterYears(amount: number, format?: string) {
    return moment()
      .clone()
      .add(amount, 'year')
      .format(format || this.DEFAULT_FORMAT);
  }

  public before(amount: number, unit: 'day' | 'week' | 'month' | 'year', format?: string) {
    return moment()
      .clone()
      .subtract(amount, unit)
      .format(format || this.DEFAULT_FORMAT);
  }

  public after(amount: number, unit: 'day' | 'week' | 'month' | 'year', format?: string) {
    return moment()
      .clone()
      .add(amount, unit)
      .format(format || this.DEFAULT_FORMAT);
  }

  public diffDay(date1: string, date2: string) {
    return Math.abs(moment(date1).diff(moment(date2), 'day'));
  }

  public getTimestamp() {
    const date = new Date();

    const month = date.getMonth();
    const monthStr = month + 1 < 10 ? '0' + (month + 1) : month + 1;

    const dt = date.getDate();
    const dtStr = dt < 10 ? '0' + dt : dt;

    const hour = date.getHours();
    const hourStr = hour < 10 ? '0' + hour : hour;

    const minute = date.getMinutes();
    const minuteStr = minute < 10 ? '0' + minute : minute;

    const second = date.getSeconds();
    const secondStr = second < 10 ? '0' + second : second;

    return `${date.getFullYear()}${monthStr}${dtStr}_${hourStr}${minuteStr}${secondStr}`;
  }

}
