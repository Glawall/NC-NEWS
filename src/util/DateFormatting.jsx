export function formattedDate(created_at) {
  const longDate = new Date(created_at);
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  return longDate.toLocaleDateString("en-GB", options);
}

export function formattedTime(created_at) {
  const date = new Date(created_at);
  const formattedDate = `${
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2)
  }`;
  return formattedDate;
}
