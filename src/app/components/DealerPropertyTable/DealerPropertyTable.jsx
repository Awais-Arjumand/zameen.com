"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Select from "react-select";

export default function DealerPropertyTable({
  properties,
  onDelete,
  activeFilter,
  companyName,
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    description: "",
    minPrice: "",
    maxPrice: "",
    priceUnit: "PKR",
    location: "",
    category: "",
    city: "",
    beds: "",
    Bath: "",
    buyOrRent: "",
    senderName: "",
    propertyDealerName: "",
    propertyDealerEmail: "",
    Area: "",
    areaUnit: "",
    status: "public",
  });

  const statusOptions = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
    { value: "company-website", label: "Company Website" },
  ];

  const priceUnitOptions = [
    { value: "PKR", label: "PKR" },
    { value: "LAKH", label: "LAKH" },
    { value: "CRORE", label: "CRORE" },
  ];

  const areaUnitOptions = [
    { value: "SqFt", label: "SqFt" },
    { value: "Marla", label: "Marla" },
  ];

  const buyOrRentOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Rent", label: "Rent" },
  ];

  const showDeleteConfirmation = (property) => {
    setPropertyToDelete(property);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    const id = propertyToDelete._id;
    setDeletingId(id);
    try {
      const isCompanyProperty =
        propertyToDelete.propertyDealerName === companyName;

      const endpoint = isCompanyProperty
        ? `http://localhost:3000/api/company-properties/${id}`
        : `http://localhost:3000/api/user/${id}`;

      await axios.delete(endpoint);
      router.refresh();
      if (onDelete) {
        onDelete();
      }
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);

      setNotification({
        show: true,
        message: "Property deleted successfully!",
        type: "success",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Delete failed:", error);
      setNotification({
        show: true,
        message: "Failed to delete property. Please try again.",
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setPropertyToDelete(null);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setFormData({
      description: property.description || "",
      minPrice: property.minPrice || property.price || "",
      maxPrice: property.maxPrice || property.price || "",
      priceUnit: property.priceUnit || "PKR",
      location: property.location || "",
      category: property.category || "",
      city: property.city || "",
      beds: property.beds || "",
      Bath: property.Bath || "",
      buyOrRent: property.buyOrRent || "",
      senderName: property.senderName || "",
      propertyDealerName: property.propertyDealerName || "",
      propertyDealerEmail: property.propertyDealerEmail || "",
      Area: property.Area || "",
      areaUnit: property.areaUnit || "",
      status: property.status || "public",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption.value,
    });
  };

  const handleSaveChanges = async () => {
    if (!selectedProperty) return;

    try {
      const isCompanyProperty =
        selectedProperty.propertyDealerName === companyName;

      const endpoint = isCompanyProperty
        ? `http://localhost:3000/api/company-properties/${selectedProperty._id}`
        : `http://localhost:3000/api/user/${selectedProperty._id}`;

      await axios.patch(endpoint, formData);
      router.refresh();
      handleCloseModal();

      setNotification({
        show: true,
        message: "Property updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setNotification({
        show: true,
        message: "Failed to update property. Please try again.",
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="overflow-x-auto bg-white shadow rounded relative"
    >
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {properties.length === 0 ? (
        <div className="w-full p-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 text-lg"
          >
            {activeFilter === "company"
              ? "No Company Properties found"
              : activeFilter === "private"
              ? "No Private Properties found"
              : "No Properties found"}
          </motion.p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#3B404C] text-white">
              <tr>
                <th className="p-3 font-medium text-xs md:text-sm">
                  Dealer Name
                </th>
                <th className="p-3 font-medium text-xs md:text-sm">Purpose</th>
                <th className="p-3 font-medium text-xs md:text-sm">City</th>
                <th className="p-3 font-medium text-xs md:text-sm">Location</th>
                <th className="p-3 font-medium text-xs md:text-sm">Category</th>
                <th className="p-3 font-medium text-xs md:text-sm">Portion</th>
                <th className="p-3 font-medium text-xs md:text-sm whitespace-nowrap">
                  Time Requirement
                </th>
                <th className="p-3 font-medium text-xs md:text-sm">Bedrooms</th>
                <th className="p-3 font-medium text-xs md:text-sm">
                  Bathrooms
                </th>
                <th className="p-3 font-medium text-xs md:text-sm whitespace-nowrap">
                  Area Size
                </th>
                <th className="p-3 font-medium text-xs md:text-sm">
                  Min Price
                </th>
                <th className="p-3 font-medium text-xs md:text-sm">
                  Max Price
                </th>
                <th className="p-3 font-medium text-xs md:text-sm">Status</th>
                <th className="p-3 font-medium text-xs md:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, index) => (
                <motion.tr
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2 text-xs md:text-sm whitespace-nowrap">
                    {property.senderName || property.propertyDealerName || "-"}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.buyOrRent || "-"}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.city || "-"}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm whitespace-nowrap">
                    {property.location || "-"}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.category || "-"}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm ">
                    {property.portionCategory || "-"}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.timeRequirement || "-"}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.beds || "-"} Beds
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.Bath || "-"} Baths
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.Area} {property.areaUnit}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.minPrice || "-"} {property.priceUnit}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    {property.maxPrice || "-"} {property.priceUnit}
                  </td>
                  <td className="px-3 py-2 text-xs md:text-sm">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                        property.status === "public"
                          ? "font-semibold bg-green-100 !text-green-500"
                          : property.status === "private"
                          ? "font-semibold bg-blue-100 !text-blue-800"
                          : "font-semibold bg-purple-100 !text-purple-800"
                      }`}
                    >
                      {property.status || "Public"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(property)}
                        className="px-2 py-1 bg-blue-500 cursor-pointer text-white rounded text-xs hover:bg-blue-600"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => showDeleteConfirmation(property)}
                        className="px-2 py-1 bg-red-500 cursor-pointer text-white rounded text-xs hover:bg-red-600"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Edit Property
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={formData.minPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Unit
                  </label>
                  <Select
                    name="priceUnit"
                    options={priceUnitOptions}
                    value={priceUnitOptions.find(
                      (option) => option.value === formData.priceUnit
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, { name: "priceUnit" })
                    }
                    className="text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beds
                  </label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bath
                  </label>
                  <input
                    type="number"
                    name="Bath"
                    value={formData.Bath}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buy/Rent
                  </label>
                  <Select
                    name="buyOrRent"
                    options={buyOrRentOptions}
                    value={buyOrRentOptions.find(
                      (option) => option.value === formData.buyOrRent
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, { name: "buyOrRent" })
                    }
                    className="text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select
                    name="status"
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === formData.status
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, { name: "status" })
                    }
                    className="text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer Name
                  </label>
                  <input
                    type="text"
                    name="propertyDealerName"
                    value={formData.propertyDealerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer Email
                  </label>
                  <input
                    type="email"
                    name="propertyDealerEmail"
                    value={formData.propertyDealerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <input
                    type="text"
                    name="Area"
                    value={formData.Area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Unit
                  </label>
                  <Select
                    name="areaUnit"
                    options={areaUnitOptions}
                    value={areaUnitOptions.find(
                      (option) => option.value === formData.areaUnit
                    )}
                    onChange={(selectedOption) =>
                      handleSelectChange(selectedOption, { name: "areaUnit" })
                    }
                    className="text-sm md:text-base"
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseModal}
                  className="px-4 py-2 cursor-pointer transition-all duration-300 border border-black bg-white hover:bg-black hover:text-white rounded text-sm md:text-base"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveChanges}
                  className="px-4 py-2 cursor-pointer transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm md:text-base"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && propertyToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md"
            >
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Confirm Deletion
              </h2>
              <p className="mb-4 md:mb-6 text-sm md:text-base">
                Are you sure you want to delete this property? This action
                cannot be undone.
              </p>
              <p className="mb-4 font-semibold text-sm md:text-base">
                "{propertyToDelete.description}" at {propertyToDelete.location}
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 cursor-pointer transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-100 rounded text-sm md:text-base"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 cursor-pointer transition-all duration-300 bg-red-600 hover:bg-red-700 text-white rounded text-sm md:text-base"
                  disabled={deletingId === propertyToDelete._id}
                >
                  {deletingId === propertyToDelete._id
                    ? "Deleting..."
                    : "Delete Property"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
