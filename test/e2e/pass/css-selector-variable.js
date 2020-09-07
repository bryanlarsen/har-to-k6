import { sleep } from "k6";
import http from "k6/http";

export const options = {};

export default function main() {
  let response;

  const vars = {};

  response = http.get("https://test.k6.io/my_messages.php");

  vars["redir"] = response
    .html()
    .find("input[name=redir]")
    .map((idx, el) => el.attr("value"))[0];

  response = http.post(
    "https://test.k6.io/my_messages.php",
    {
      username: "admin",
      password: "123",
      redir: `${vars["redir"]}`,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // Automatically added sleep
  sleep(1);
}
