import { useState } from "react";
import { Modal } from "./CreateServerModal";
import { Users, Upload, ChevronRight, Plus } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { useDropzone } from "react-dropzone";

type Step = "initial" | "type" | "customize";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function ServerCreation() {
  const [isOpen, setIsOpen] = useState(false);
  const [serverName, setServerName] = useState("New Server");
  const [step, setStep] = useState<Step>("initial");
  const { userId } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const handleCreateServer = async () => {
    try {
      // Close modal
      setIsOpen(false);

      let uploadedImageUrl = null;

      if (imageFile) {
        console.log("Uploading image...");

        // Step 1: Request a signed URL
        const response = await axios.post(
          `${VITE_API_BASE_URL}/upload/get-signed-url`,
          {
            fileName: imageFile.name,
            fileType: imageFile.type,
          }
        );

        const { url: signedUrl } = response.data;

        if (!signedUrl) {
          throw new Error("Signed URL not received from server.");
        }

        console.log("Received signed URL:", signedUrl);

        // Step 2: Upload the file to the signed URL
        await axios.put(signedUrl, imageFile, {
          headers: {
            "Content-Type": imageFile.type,
          },
        });

        console.log("Image uploaded successfully.");

        // Extract the uploaded image's URL (assumes the signed URL matches the image URL)
        uploadedImageUrl = signedUrl.split("?")[0]; // Removes query params to get the public URL
      }

      console.log("Creating server with uploaded image URL:", uploadedImageUrl);

      // Step 3: Create the server with the image URL
      const createResponse = await axios.post(
        `${VITE_API_BASE_URL}/server/create`,
        {
          name: serverName,
          userId: userId,
          iconUrl: uploadedImageUrl,
        }
      );

      console.log("Server created successfully:", createResponse.data);

      // Reset state after success
      setStep("initial");
    } catch (error) {
      console.error("Error during server creation:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // accept: "image/*", // Only allow image files
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setImageFile(file);
        const imageUrl = URL.createObjectURL(file); // Create a preview URL
        setImageUrl(imageUrl); // Set the image preview URL
        // handleImageUpload(file); // Upload the selected image
      }
    },
  });

  const handleClose = () => setIsOpen(false);
  const renderStep = () => {
    switch (step) {
      case "initial":
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Create Your Server
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Your server is where you and your friends hang out. Make yours and
              start talking.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setStep("type")}
                className="w-full flex items-center justify-between p-4 bg-[#2B2D31] hover:bg-[#404249] rounded-md transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#5865F2] p-2 rounded-full">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-medium">Create My Own</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        );

      case "type":
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Tell Us More About Your Server
            </h2>
            <p className="text-gray-400 text-center mb-6">
              In order to help you with your setup, is your new server for just
              a few friends or a larger community?
            </p>

            <div className="space-y-3">
              {[
                { icon: Users, text: "For a club or community" },
                { icon: Users, text: "For me and my friends" },
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={() => setStep("customize")}
                  className="w-full flex items-center justify-between p-4 bg-[#2B2D31] hover:bg-[#404249] rounded-md transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#5865F2] p-2 rounded-full">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("initial")}
              className="mt-4 px-4 py-2 text-white hover:underline"
            >
              Back
            </button>
          </div>
        );

      case "customize":
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Customize Your Server
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Give your new server a personality with a name and an icon. You
              can always change it later.
            </p>

            {/* <div className="flex justify-center mb-6">
              <button className="relative group">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="absolute bottom-0 right-0 bg-[#5865F2] rounded-full p-1">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </button>
            </div> */}
            <div className="flex justify-center mb-6">
              <div
                {...getRootProps()}
                className="relative group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                  {isDragActive ? (
                    <p className="text-gray-400">Drop the image here</p>
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Server Icon"
                      className="w-20 h-20 rounded-full"
                    />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-[#5865F2] rounded-full p-1">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <input {...getInputProps()} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-300 uppercase mb-2">
                SERVER NAME
              </label>
              <input
                type="text"
                className="w-full bg-[#1E1F22] text-white p-2.5 rounded-md border border-[#1E1F22] focus:border-[#5865F2] focus:outline-none"
                defaultValue="My Server"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
              />
            </div>

            <p className="text-xs text-gray-400 mb-6">
              By creating a server, you agree to Discord-2's Community
              Guidelines.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("type")}
                className="px-4 py-2 text-white hover:underline"
              >
                Back
              </button>
              <button
                onClick={handleCreateServer}
                className="px-8 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-3 py-3 ">
        {/* Create a Server */}
        <Plus className="w-6 h-6 text-[#3b9c5b] group-hover:text-white transition-colors duration-200" />
      </button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        {renderStep()}
      </Modal>
    </>
  );
}
