import http from "k6/http";

export function getAuthToken(data: { username: string; password: string }) {
  const res = http.post(
    "https://quickpizza.grafana.com/api/users/token/login",
    JSON.stringify({
      username: data.username,
      password: data.password,
    })
  );

  const responseBody = res.json();
  const token = responseBody!["token"];

  return token;
}
