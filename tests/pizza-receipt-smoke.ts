import http from "k6/http";
import { check, sleep } from "k6";
import { getAuthToken } from "../utils/auth.helper.ts";
import { Options } from "k6/options";

/*
Smoke test
Їх запускають для перевірки, чи система працює коректно при мінімальному навантаженні, а також для збору базових значень продуктивності.
запуск тестів з невеликою кількістю віртуальних користувачів (VUs) — понад 5 VUs можна вважати міні-навантажувальним тестом.
тести повинені виконуватися протягом короткого періоду: або з невеликою кількістю ітерацій, або тривалістю від кількох секунд до кількох хвилин.
*/

export const options: Options = {
  vus: 1, // Кількість віртуальних користувачів (VUs), що будуть одночасно виконувати тест
  duration: "10s", // Загальна тривалість тесту (10 секунд).

  cloud: {
    // Налаштування для запуску тесту в хмарному сервісі k6 Cloud.
    projectID: 3754403, // Унікальний ідентифікатор проєкту в k6 Cloud.
    name: "get_pizza_receipt", // Назва тесту в k6 Cloud

    distribution: {
      // Визначає, як трафік розподіляється між зонами навантаження.
      scenario: {
        loadZone: "amazon:de:frankfurt", // Локація хмарного дата-центру
        percent: 100, // Частка трафіку, яка спрямовується в цей дата-центр
      },
    },
  },
};

// ОДИН РАЗ ПЕРЕД ЗАПУСКОМ ВСІХ ТЕСТІВ
export function setup() {
  const token = getAuthToken({
    username: "default",
    password: "12345678",
  });

  return { token }; // як обʼєкт!!!
}

export default function ({ token }) {
  const res = http.post(
    "https://quickpizza.grafana.com/api/pizza",
    JSON.stringify({
      maxCaloriesPerSlice: 1000,
      mustBeVegetarian: false,
      excludedIngredients: [],
      excludedTools: [],
      maxNumberOfToppings: 5,
      minNumberOfToppings: 2,
    }),
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  check(res, {
    "Status-code": (res) => res.status == 200,
    "Request-duration": (res) => res.timings.duration < 300,
  });

  sleep(2);
}
