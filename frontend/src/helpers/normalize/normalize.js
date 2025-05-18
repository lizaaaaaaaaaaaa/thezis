const fixSmartPerWord = (str = "") => {
  const isCyrillicLike = (word) => {
    const fakeCyrillicLetters = /[aAeEoOpPcCyxX]/g;
    return fakeCyrillicLetters.test(word) && word.length >= 3;
  };

  const fixLetters = (s) =>
    s
      .replace(/[\u0430\u03B1]/g, "а")
      .replace(/[\u0435\u03B5]/g, "е")
      .replace(/[\u043E\u03BF]/g, "о")
      .replace(/[\u0440\u03C1]/g, "р")
      .replace(/[\u0441\u03C3]/g, "с")
      .replace(/[\u0445\u03C7]/g, "х")
      .replace(/[\u0443\u03C5]/g, "у")
      .replace(/[\u0456\u0069]/g, "і")
      .replace(/\u00AD/g, "")
      .normalize("NFKC");

  return str
    .split(" ")
    .map((word) => (isCyrillicLike(word) ? fixLetters(word) : word))
    .join(" ");
};
