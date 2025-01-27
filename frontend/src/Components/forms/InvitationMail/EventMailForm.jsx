import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const EventEmailForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const formData = new FormData();

      // Append all form data
      for (const key in data) {
        if (key === "attachments" || key === "excelFile" || key === "eventPoster") {
          if (data[key]) {
            Array.from(data[key]).forEach((file) => formData.append(key, file));
          }
        } else {
          formData.append(key, data[key]);
        }
      }

      const response = await axios.post("http://localhost:3000/eventMail", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response from server:", response.data);
      alert("Mail sent successfully!");
    } catch (error) {
      console.error("Error sending mail:", error);
      alert("Failed to send mail. Please try again.");
    }
  };

  return (
    <div className="w-1/2 mx-auto my-10 px-12 py-7 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Event Invitation Email Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Subject Line */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Subject Line<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("subjectLine", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the email subject"
          />
          {errors.subjectLine && (
            <p className="text-red-500 text-sm mt-1">Subject line is required</p>
          )}
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Event Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("eventName", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the event name"
          />
          {errors.eventName && (
            <p className="text-red-500 text-sm mt-1">Event name is required</p>
          )}
        </div>

        {/* Event Poster */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Event Poster (File)<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            {...register("eventPoster")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Event Date<span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
            <input
              type="date"
              {...register("endDate", { required: true })}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          {(errors.startDate || errors.endDate) && (
            <p className="text-red-500 text-sm mt-1">
              Both start and end dates are required
            </p>
          )}
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Event Time<span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            {/* From Time */}
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <input
                type="time"
                {...register("startTime", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">Start time is required</p>
              )}
            </div>

            {/* To Time */}
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <input
                type="time"
                {...register("endTime", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1">End time is required</p>
              )}
            </div>
          </div>
        </div>


        {/* Location/Links */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Location<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter location or event link"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              Location is required
            </p>
          )}
        </div>

        {/* Sender Info */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Sender Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("senderName", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter sender's name"
          />
          {errors.senderName && (
            <p className="text-red-500 text-sm mt-1">Sender name is required</p>
          )}
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Info (Optional)
          </label>
          <input
            type="text"
            {...register("contactInfo")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter contact email or phone"
          />
        </div>

        {/* Category */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">
            Category<span className="text-red-500">*</span>
          </label>
          <select
            {...register("category", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">Select Category</option>
            <option value="higherAuthority">Higher Authority</option>
            <option value="faculty">Faculty</option>
            <option value="students">Students</option>
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">Please select a category</p>
          )}
        </div> */}

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Event Purpose
          </label>
          <textarea
            {...register("eventDescription")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Add event details here"
          ></textarea>
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Attach Files<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            {...register("attachments")}
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          <p className="text-sm text-gray-500 mt-1">You can upload multiple files.</p>
        </div>

        {/* Excel File */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Excel File<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            {...register("excelFile", { required: true })}
            accept=".xls,.xlsx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.excelFile && (
            <p className="text-red-500 text-sm mt-1">Excel file is required</p>
          )}
        </div>


        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventEmailForm;