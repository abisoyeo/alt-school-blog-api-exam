const { calculateReadingTime } = require("../utils/reading-time.util");

const blogPostPlugin = function (schema) {
  schema.pre(/^find/, function (next) {
    this.populate({
      path: "tags",
      select: "name",
    });

    this.populate({
      path: "author",
      select: "first_name last_name email",
    });

    next();
  });

  schema.pre("save", function (next) {
    try {
      this.reading_time = calculateReadingTime(this.body);
      next();
    } catch (err) {
      next(err);
    }
  });

  schema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    try {
      const newReadingTime = calculateReadingTime(update.body);
      this.reading_time = newReadingTime;
      this.set({ reading_time: newReadingTime });
    } catch (err) {
      next(err);
    }

    next();
  });
};

module.exports = blogPostPlugin;
