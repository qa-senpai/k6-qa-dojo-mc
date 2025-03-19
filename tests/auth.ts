/*
Request URL: https://quickpizza.grafana.com/api/users/token/login?set_cookie=true
Request Method: POST 
Status Code: 200 OK
*/

import http from "k6/http";

export default function () {
  const res = http.post(
    "https://quickpizza.grafana.com/api/users/token/login",
    JSON.stringify({
      username: "default",
      password: "12345678",
    })
  );

  const responseBody = res.json();
  const token = responseBody!["token"];

  console.log(token);
}
