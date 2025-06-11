const { calculateReadingTime } = require("../utils/reading-time.util");

const blogPostPlugin = function (schema) {
  // Pre-save hook to populate tags and author
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

  // Pre-save hook to set reading time
  schema.pre("save", function (next) {
    try {
      this.reading_time = calculateReadingTime(this.body);
      next();
    } catch (err) {
      console.error("Plugin: Error in calculateReadingTime:", err);
      next(err);
    }
  });

  // Pre-update hook to recalculate reading time
  schema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    try {
      const newReadingTime = calculateReadingTime(update.body);
      this.reading_time = newReadingTime;
      this.set({ reading_time: newReadingTime });
    } catch (err) {
      console.error("Plugin: Error in calculateReadingTime for update:", err);
    }

    next();
  });
};

module.exports = blogPostPlugin;
