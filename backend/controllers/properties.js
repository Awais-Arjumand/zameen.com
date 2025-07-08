import { Property } from "../model/properties.js";

// Get all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    const formattedProperties = properties.map((property) => ({
      _id: property._id,
      Area: property.Area,
      areaUnit: property.areaUnit,
      TotalArea: property.TotalArea,
      description: property.description,
      image: property.image,
      images: property.images,
      video: property.video,
      price: property.price,
      priceUnit: property.priceUnit,
      location: property.location,
      category: property.category,
      beds: property.beds,
      Bath: property.Bath,
      city: property.city,
      buyOrRent: property.buyOrRent,
      propertyDealerName: property.propertyDealerName,
      propertyDealerEmail: property.propertyDealerEmail,
      createdAt: property.createdAt?.toISOString(),
      updatedAt: property.updatedAt?.toISOString(),
    }));

    res.json({
      message: "Properties fetched successfully",
      data: formattedProperties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching properties",
    });
  }
};

// Get property by ID
export const getPropertyById = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const formattedProperty = {
      _id: property._id,
      Area: property.Area,
      areaUnit: property.areaUnit,
      TotalArea: property.TotalArea,
      description: property.description,
      image: property.image,
      images: property.images,
      video: property.video,
      price: property.price,
      priceUnit: property.priceUnit,
      location: property.location,
      category: property.category,
      beds: property.beds,
      Bath: property.Bath,
      city: property.city,
      buyOrRent: property.buyOrRent,
      propertyDealerName: property.propertyDealerName,
      propertyDealerEmail: property.propertyDealerEmail,
      createdAt: property.createdAt?.toISOString(),
      updatedAt: property.updatedAt?.toISOString(),
    };

    res.json({
      message: "Property fetched successfully",
      data: formattedProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while fetching property by ID",
    });
  }
};

// Create new property
export const createProperty = async (req, res) => {
  try {
    let images = [];
    if (req.files?.images) {
      images = req.files.images.map((file) => `/uploads/${file.filename}`);
    }

    let video = null;
    if (req.files?.video) {
      video = `/uploads/${req.files.video[0].filename}`;
    }

    const newProperty = await Property.create({
      ...req.body,
      image: images[0] || "",
      images: images,
      video: video || "",
    });

    res.status(201).json({
      message: "Property created successfully",
      data: newProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete property by ID
export const deleteProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    const formattedProperty = {
      _id: deletedProperty._id,
      Area: deletedProperty.Area,
      areaUnit: deletedProperty.areaUnit,
      TotalArea: deletedProperty.TotalArea,
      description: deletedProperty.description,
      image: deletedProperty.image,
      images: deletedProperty.images,
      video: deletedProperty.video,
      price: deletedProperty.price,
      priceUnit: deletedProperty.priceUnit,
      location: deletedProperty.location,
      category: deletedProperty.category,
      beds: deletedProperty.beds,
      Bath: deletedProperty.Bath,
      city: deletedProperty.city,
      buyOrRent: deletedProperty.buyOrRent,
      propertyDealerName: deletedProperty.propertyDealerName,
      propertyDealerEmail: deletedProperty.propertyDealerEmail,
      createdAt: deletedProperty.createdAt?.toISOString(),
      updatedAt: deletedProperty.updatedAt?.toISOString(),
    };

    res.json({
      message: "Property deleted successfully",
      data: formattedProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while deleting property",
    });
  }
};

// Update property by ID
export const updateProperty = async (req, res) => {
  const { id } = req.params;

  const updateData = {
    description: req.body.description,
    price: req.body.price,
    priceUnit: req.body.priceUnit,
    location: req.body.location,
    category: req.body.category,
    beds: req.body.beds,
    Bath: req.body.Bath,
    city: req.body.city,
    buyOrRent: req.body.buyOrRent,
    propertyDealerName: req.body.propertyDealerName,
    propertyDealerEmail: req.body.propertyDealerEmail,
    Area: req.body.Area,
    areaUnit: req.body.areaUnit,
  };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || "Server error while updating property",
    });
  }
};
