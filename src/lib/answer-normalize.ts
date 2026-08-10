export const normalizeAnswer = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064b-\u0652]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/^(the |a |an |le |la |les |un |une |el )/, "")
    .replace(/\s+/g, " ");

export const normalizeForCompare = (value: string) =>
  normalizeAnswer(value).replace(/\s+/g, "");

export const isNumericAnswer = (value: string) => /^\d+$/.test(value);

export const answersMatch = (input: string, acceptedAnswers: string[]) =>
  acceptedAnswers.some(
    (answer) => normalizeForCompare(answer) === normalizeForCompare(input)
  );
