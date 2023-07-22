const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getDayOfTheWeek = () => {
    const date = new Date();
    const day = date.getDay();
    return days[day];
}

export const getTomorrow = (currentDay:string) => {
    const index = days.findIndex((day: string) => day === currentDay);
    if (index < days.length - 1) {
        return days[index + 1];
    } else {
        return days[0];
    }
}

export const getYesterday = (currentDay:string) => {
    const index = days.findIndex((day: string) => day === currentDay);
    if (index > 0) {
        return days[index - 1];
    } else {
        return days[days.length - 1];
    }
}