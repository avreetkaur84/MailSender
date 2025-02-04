import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const ThankMail = () => {
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

      axios.defaults.withCredentials = true;

      // const response = await axios.post("http://localhost:3000/mail/thankmail", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      const response = await axios.post(
        "https://mail-sender-backend-three.vercel.app/mail/thankmail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      

      console.log("Response from server:", response.data);
      alert("Mail sent successfully!");
    } catch (error) {
      console.error("Error sending mail:", error);
      alert("Failed to send mail. Please try again.");
    }
  };

  return (
    <div className="w-1/2 mx-auto my-10 px-12 py-7 border border-gray-300 rounded-lg shadow-md bg-white border-2">
      <h2 className="text-2xl font-bold mb-6 text-center">Thank You Email Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Collaboration With */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Collaboration With<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("collaboration_with", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter collaboration details"
          />
          {errors.collaboration_with && (
            <p className="text-red-500 text-sm mt-1">This field is required</p>
          )}
        </div>

        {/* Skills Gained */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Skills Gained<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("skills_gained", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the skills participants will gain"
          />
          {errors.skills_gained && (
            <p className="text-red-500 text-sm mt-1">This field is required</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("date", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">Date is required</p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Start Time<span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            {...register("start_time", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.start_time && (
            <p className="text-red-500 text-sm mt-1">Start time is required</p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium mb-1">
            End Time<span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            {...register("end_time", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.end_time && (
            <p className="text-red-500 text-sm mt-1">End time is required</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Location<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("location", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the event location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">Location is required</p>
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

        {/* Google Feedback Form URL */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Google Feedback Form URL<span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            {...register("feedbackFormUrl", { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter the Google Feedback form URL"
          />
          {errors.feedbackFormUrl && (
            <p className="text-red-500 text-sm mt-1">Feedback form URL is required</p>
          )}
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

export default ThankMail;