const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

// Index location for geospatial queries
organizationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Organization", organizationSchema);

// Point = نقطة واحدة (مثلاً مقر شركة).

// LineString = خط (مثلاً شارع أو طريق).

// Polygon = مضلع (مثلاً حدود مدينة أو منطقة).

// في مشروعنا، إحنا بنستخدم النوع Point، لأن كل شركة ليها "موقع ثابت" على الخريطة مش منطقة أو خط.
