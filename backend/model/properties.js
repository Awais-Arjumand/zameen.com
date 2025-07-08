import mongoose, { Schema } from "mongoose";

const PropertySchema = new Schema(
  {
    Area: {
      type: String,
      required: true,
    },
    areaUnit: {
      type: String,
      required: false,
    },
    TotalArea: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
    video: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    beds: {
      type: Number,
      required: true,
    },
    Bath: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    buyOrRent: {
      type: String,
      required: true,
    },
    propertyDealerName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.trim().split(/\s+/).length >= 2;
        },
        message: (props) =>
          `${props.value} should be a full name (at least first and last name)`,
      },
    },
    propertyDealerEmail: {
      type: String,
      required: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
  },
  { timestamps: true }
);

export const Property = mongoose.model("Property", PropertySchema);
