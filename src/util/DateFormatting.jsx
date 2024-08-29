function formattedDate(created_at) {
  const longDate = new Date(created_at);
  const options = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  return longDate.toLocaleDateString("en-GB", options);
}

export default formattedDate;
