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
      
      const response = await axios.post(
        "https://mail-sender-backend-three.vercel.app/mail/invitationmail",
        formData,
        {
            withCredentials: true,
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
    <div className="w-1/2 mx-auto my-10 px-12 py-7 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Event Invitation Email Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Subject Line */}
        <div>
          <label className="block text-sm font-medium mb-1">Subject Line<span className="text-red-500">*</span></label>
          <input type="text" {...register("subjectLine", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter the email subject" />
          {errors.subjectLine && <p className="text-red-500 text-sm mt-1">Subject line is required</p>}
        </div>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Name<span className="text-red-500">*</span></label>
          <input type="text" {...register("eventName", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter the event name" />
          {errors.eventName && <p className="text-red-500 text-sm mt-1">Event name is required</p>}
        </div>

        {/* Event Host */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Host<span className="text-red-500">*</span></label>
          <input type="text" {...register("eventHost", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter the host name" />
          {errors.eventHost && <p className="text-red-500 text-sm mt-1">Event host is required</p>}
        </div>

        {/* Event Poster */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Poster (File)</label>
          <input type="file" {...register("eventPoster")} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Date<span className="text-red-500">*</span></label>
          <div className="flex space-x-2">
            <input type="date" {...register("startDate", { required: true })} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
            <input type="date" {...register("endDate")} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
          </div>
          {errors.startDate && <p className="text-red-500 text-sm mt-1">Start date is required</p>}
        </div>

        {/* Event Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Time<span className="text-red-500">*</span></label>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <input type="time" {...register("startTime", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
              {errors.startTime && <p className="text-red-500 text-sm mt-1">Start time is required</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <input type="time" {...register("endTime", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
              {errors.endTime && <p className="text-red-500 text-sm mt-1">End time is required</p>}
            </div>
          </div>
        </div>

        {/* Event Venue */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Venue<span className="text-red-500">*</span></label>
          <input type="text" {...register("eventVenue", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter event venue" />
          {errors.eventVenue && <p className="text-red-500 text-sm mt-1">Event venue is required</p>}
        </div>

        {/* Event Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Description<span className="text-red-500">*</span></label>
          <textarea {...register("eventDescription", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" rows="4" placeholder="Enter event details"></textarea>
          {errors.eventDescription && <p className="text-red-500 text-sm mt-1">Event description is required</p>}
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-medium mb-1">Special Instructions</label>
          <textarea {...register("specialInstructions")} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" rows="3" placeholder="Enter any special instructions"></textarea>
        </div>

        {/* RSVP Link */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">RSVP Link<span className="text-red-500">*</span></label>
          <input type="url" {...register("rsvpLink", { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" placeholder="Enter RSVP link" />
          {errors.rsvpLink && <p className="text-red-500 text-sm mt-1">RSVP link is required</p>}
        </div> */}

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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Send Invitation</button>
      </form>
    </div>
  );

};

export default EventEmailForm;