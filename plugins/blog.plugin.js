const calculateReadingTime = require("../utils/reading-time.utils");

const blogPostPlugin = function (schema) {
  // Pre-save hook to populate tags and author
  schema.pre(/^find/, function (next) {
    this.populate({
      path: "tags",
      select: "name",
    });

    this.populate({
      path: "author",
      select: "first_name last_name avatar",
    });

    next();
  });

  // Pre-save hook to set reading time
  schema.pre("save", function (next) {
    this.reading_time = calculateReadingTime(this.body);
    next();
  });

  // Pre-update hook to recalculate reading time
  schema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.body) {
      const newReadingTime = calculateReadingTime(update.$set.body);
      this.set({ reading_time: newReadingTime });
    }
    next();
  });
};

module.exports = blogPostPlugin;
