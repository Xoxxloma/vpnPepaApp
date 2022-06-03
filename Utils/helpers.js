import dayjs from "dayjs";

export const formatDate = (date) => dayjs(date).format("DD.MM.YYYY")

export const shouldUpdateAuthData = (date) => {
  return dayjs(date).isSame(dayjs(), 'day');
}
