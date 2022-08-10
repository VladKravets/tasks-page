//* SOME TeXt => Some text
export function convertToCapital(text) {
  return text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase();
}

//* WITH_UNDERLINE => With underline
export function convertUnderline(text) {
  const result = text
    .split('_')
    .map((item) => item.toLowerCase())
    .join(' ');
  return result.charAt(0).toUpperCase() + result.slice(1);
}
