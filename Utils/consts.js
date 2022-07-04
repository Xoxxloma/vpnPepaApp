import fifteenDays from '../Images/15daysSub.png'
import threeMonths from '../Images/happy.png';
import halfOfTheYear from '../Images/glassesDown.png';
import oneMonth from '../Images/waiting.png'
import mario from '../Images/mario.gif';

export const termUnits = {
  day: 'день',
  month: 'месяц',
  year: 'год'
}

export const paymentsStatuses = {
  PAID: 'Успешно оплачен',
}

export const subscribes = {
  "15 дней": {
    text: '15 дней', termUnit: "day", term: 15, price: 85, description: 'Это небольшие деньги, но честные', logo: fifteenDays
  },
  "1 месяц": {
    text: '1 месяц', termUnit: "month", term: 1, price: 150, description: 'Между чашкой кофе и Pepa-VPN на месяц выбор очевиден', logo: oneMonth
  },
  "3 месяца": {
    text: '3 месяца', termUnit: "month", term: 3, price: 400, description: 'Это как два месяца, но на один побольше', logo: threeMonths
  },
  "6 месяцев": {
    text: '6 месяцев', termUnit: "month", term: 6, price: 800, description: 'Возможно у Вас в роду были лепреконы или русские олигархи, ПООООООЛГОДА PEPA-VPN', logo: halfOfTheYear
  },
  "1 год": {
    text: '1 год', termUnit: "year", term: 1, price: 3000, description: 'Подписку на год пока не продаем, только показываем. Но скоро точно будем продавать, когда нарисуем лягушку-рэпера, чтобы подчеркнуть всю роскошь и богатство этой опции', logo: mario
  },
}


