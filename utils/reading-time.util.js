const calculateReadingTime = (text) => {
  console.log("Inside calculateReadingTime with body:", text);
  if (!text || typeof text !== "string") {
    return 0;
  }

  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return readingTime;
};

module.exports = { calculateReadingTime };
