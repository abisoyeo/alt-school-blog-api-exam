const Tag = require("../models/tag.model");

exports.SaveTags = async (rawTags) => {
  if (!rawTags || !Array.isArray(rawTags) || rawTags.length === 0) {
    return [];
  }

  const tagIds = rawTags.map(async (tagName) => {
    const normalizedTagName = tagName.toLowerCase().trim();

    const tagDoc = await Tag.findOneAndUpdate(
      { name: normalizedTagName },
      { name: normalizedTagName },
      { new: true, upsert: true }
    );
    return tagDoc._id;
  });

  return await Promise.all(tagIds);
};
