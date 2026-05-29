/**
 * Class DateMapper
 * Cette classe format une date pour passer d'un string à un objet
 */
export class DateMapper {
  /**
   * Transforme une date au format string en objet Date
   * @param dateStr Date au format string
   * @returns Renvoie un objet Date
   */
  stringToDate(dateStr: string): Date {
    const newStr = dateStr.replace(' ', 'T');
    return new Date(newStr);
  }

  /**
   * Transforme une date au format Date en string
   * @param date Date au format Date
   * @returns Renvoie un string
   */
  dateToString(date: Date): string {
    const seconds: number = date.getSeconds();
    const minutes: number = date.getMinutes();
    const hours: number = date.getHours();
    const day: number = date.getDate();
    const month: number = date.getMonth() + 1;
    const fullYear: number = date.getFullYear();

    return `${fullYear}-${this.dateformat(month)}-${this.dateformat(day)} ${this.dateformat(hours)}:${this.dateformat(minutes)}:${this.dateformat(seconds)}`;
  }

  /**
   * Formatage de l'affichage d'une date
   * @param nb Nombre à formater
   * @returns Renvoie un string et rajoute un 0 si le nombre est inférieur à 10
   */
  private dateformat(nb: number): string {
    if (nb < 10) return `0${nb}`;
    else return `${nb}`;
  }
}
